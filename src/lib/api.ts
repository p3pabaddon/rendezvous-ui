import { supabase } from "@/lib/supabase";

export async function getBusinesses(filters?: { city?: string; category?: string; search?: string }) {
  let query = supabase
    .from("businesses")
    .select("*")
    .eq("is_active", true)
    .order("rating", { ascending: false });

  if (filters?.city && filters.city !== "all") {
    query = query.eq("city", filters.city);
  }
  if (filters?.category) {
    query = query.eq("category", filters.category);
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,category.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getBusinessBySlug(slug: string) {
  const { data: business, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;

  const [servicesRes, staffRes, reviewsRes] = await Promise.all([
    supabase.from("services").select("*").eq("business_id", business.id).eq("is_active", true).order("created_at"),
    supabase.from("staff").select("*").eq("business_id", business.id).eq("is_active", true),
    supabase.from("reviews").select("*").eq("business_id", business.id).eq("is_visible", true).order("created_at", { ascending: false }).limit(10),
  ]);

  return {
    ...business,
    services: servicesRes.data || [],
    staff: staffRes.data || [],
    reviews: reviewsRes.data || [],
  };
}

export async function getMyBusiness() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (error) return null;
  return data;
}

export async function getBusinessAppointments(businessId: string, status?: string) {
  let query = supabase
    .from("appointments")
    .select("*, staff(name)")
    .eq("business_id", businessId)
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateAppointmentStatus(id: string, status: string) {
  const { data: apt, error: fetchError } = await supabase
    .from("appointments")
    .select("*, business:businesses(name)")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);

  if (error) throw error;

  // Trigger notification
  if (apt) {
    sendNotification({
      type: "status_change",
      to: apt.customer_email || apt.customer_phone,
      data: {
        status,
        businessName: apt.business?.name,
        date: apt.appointment_date,
        time: apt.appointment_time
      }
    });

    // Waitlist logic: if cancelled, notify people waiting for this day
    if (status === "cancelled") {
      const { data: waitlist } = await supabase
        .from("waitlist")
        .select("*")
        .eq("business_id", apt.business_id)
        .eq("date", apt.appointment_date);
      
      if (waitlist && waitlist.length > 0) {
        waitlist.forEach((entry: any) => {
          sendNotification({
            type: "waitlist_alert",
            to: entry.id, // Simulation
            data: {
              businessName: apt.business?.name,
              date: apt.appointment_date
            }
          });
        });
      }
    }
  }
}

export async function joinWaitlist(data: { business_id: string; user_id: string; date: string }) {
  const { error } = await supabase.from("waitlist").insert(data);
  if (error) throw error;
  return true;
}

const NOTIFICATION_TEMPLATES = {
  status_change: (data: any) => `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #3b82f6;">Randevu Güncellemesi</h2>
      <p>Merhaba,</p>
      <p><strong>${data.businessName}</strong> işletmesindeki randevunuzun durumu güncellendi.</p>
      <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Yeni Durum:</strong> ${data.statusLabel}</p>
        <p><strong>Tarih:</strong> ${data.date}</p>
        <p><strong>Saat:</strong> ${data.time}</p>
      </div>
      <p>Sorularınız için işletme ile iletişime geçebilirsiniz.</p>
    </div>
  `,
  waitlist_alert: (data: any) => `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #10b981;">Bekleme Listesi Müjdesi!</h2>
      <p>Merhaba,</p>
      <p><strong>${data.businessName}</strong> işletmesinde <strong>${data.date}</strong> tarihi için beklediğiniz yer açıldı!</p>
      <p>Vakit kaybetmeden hemen randevunuzu oluşturun.</p>
      <a href="#" style="display: inline-block; background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Randevu Al</a>
    </div>
  `
};

async function sendNotification(params: { type: string, to: string, data: any }) {
  const statusLabels: any = { 
    confirmed: "Onaylandı ✅", 
    cancelled: "İptal Edildi ❌", 
    completed: "Tamamlandı ✨" 
  };
  
  const templateData = {
    ...params.data,
    statusLabel: statusLabels[params.data.status] || params.data.status
  };

  const html = (NOTIFICATION_TEMPLATES as any)[params.type]?.(templateData);
  
  if (html) {
    console.log(`[REAL NOTIFICATION SIMULATION] to: ${params.to}`);
    console.log(`SUBJECT: ${params.type === 'waitlist_alert' ? 'Yer Açıldı!' : 'Randevu Güncellemesi'}`);
    console.log(`CONTENT: ${html}`);
  }
}

export async function getBusinessStats(businessId: string) {
  const today = new Date().toISOString().split("T")[0];
  
  const [totalRes, todayRes, pendingRes, revenueRes] = await Promise.all([
    supabase.from("appointments").select("id", { count: "exact", head: true }).eq("business_id", businessId),
    supabase.from("appointments").select("id", { count: "exact", head: true }).eq("business_id", businessId).eq("appointment_date", today),
    supabase.from("appointments").select("id", { count: "exact", head: true }).eq("business_id", businessId).eq("status", "pending"),
    supabase.from("appointments").select("total_price").eq("business_id", businessId).eq("status", "completed"),
  ]);

  const totalRevenue = (revenueRes.data || []).reduce((sum: number, a: any) => sum + (Number(a.total_price) || 0), 0);

  return {
    totalAppointments: totalRes.count || 0,
    todayAppointments: todayRes.count || 0,
    pendingAppointments: pendingRes.count || 0,
    totalRevenue,
  };
}

export async function createAppointment(data: any) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const insertData: Record<string, any> = {
    business_id: data.business_id,
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    customer_email: data.customer_email || null,
    appointment_date: data.appointment_date,
    appointment_time: data.appointment_time,
    total_price: data.total_price || 0,
    notes: data.notes || null,
    status: data.total_price > 0 && data.is_paid ? "confirmed" : "pending",
  };

  if (data.staff_id) insertData.staff_id = data.staff_id;
  if (user?.id) insertData.customer_id = user.id;

  const { error } = await supabase.from("appointments").insert(insertData);
  if (error) throw error;
}

export async function getOccupiedSlots(businessId: string, date: string, staffId?: string) {
  let query = supabase
    .from("appointments")
    .select("appointment_time, staff_id")
    .eq("business_id", businessId)
    .eq("appointment_date", date)
    .in("status", ["pending", "confirmed", "completed"]);

  if (staffId) {
    query = query.eq("staff_id", staffId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getAdminSystemStats() {
  const [bizRes, usersRes, aptsRes, revenueRes] = await Promise.all([
    supabase.from("businesses").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("appointments").select("id", { count: "exact", head: true }),
    supabase.from("appointments").select("total_price").eq("status", "completed"),
  ]);

  const totalRevenue = (revenueRes.data || []).reduce((sum, a: any) => sum + (Number(a.total_price) || 0), 0);

  return {
    totalBusinesses: bizRes.count || 0,
    totalUsers: usersRes.count || 0,
    totalAppointments: aptsRes.count || 0,
    totalRevenue,
  };
}
