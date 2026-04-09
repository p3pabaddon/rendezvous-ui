import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function generateTimeSlots(startTime: string, endTime: string, interval: number = 30): string[] {
  const slots: string[] = [];
  
  if (!startTime || !endTime || startTime.toLowerCase().includes("kapal") || endTime.toLowerCase().includes("kapal")) {
    return [];
  }

  // Parse hours and minutes
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  let current = new Date();
  current.setHours(startH, startM, 0, 0);

  const end = new Date();
  end.setHours(endH, endM, 0, 0);

  while (current < end) {
    slots.push(format(current, "HH:mm"));
    current.setMinutes(current.getMinutes() + interval);
  }

  return slots;
}

export function getWorkingHoursForDay(workingHours: any, date: Date | undefined): { start: string; end: string } | null {
  if (!workingHours || !date) return null;

  const dayName = format(date, "EEEE", { locale: tr }); // e.g., "Pazartesi"
  const hours = workingHours[dayName];

  if (!hours || typeof hours !== "string" || hours.toLowerCase().includes("kapal")) {
    return null;
  }

  // Expecting format "09:00 - 18:00"
  const parts = hours.split("-").map(p => p.trim());
  if (parts.length !== 2) return null;

  return { start: parts[0], end: parts[1] };
}

export function isSlotOccupied(
  slot: string,
  occupiedSlots: any[],
  staffId: string | null,
  totalStaffCount: number
): boolean {
  const appointmentsInSlot = occupiedSlots.filter(s => s.appointment_time.slice(0, 5) === slot);

  if (staffId) {
    // Specific staff member: check if they have an appointment at this time
    return appointmentsInSlot.some(a => a.staff_id === staffId);
  } else {
    // "Anyone": check if ALL staff members are busy at this time
    // If totalStaffCount is 0 (no staff defined), we assume 1 implicit staff
    const limit = totalStaffCount > 0 ? totalStaffCount : 1;
    return appointmentsInSlot.length >= limit;
  }
}
