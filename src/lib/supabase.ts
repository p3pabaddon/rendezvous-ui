import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://szlkjqamknjiwlwtaxpw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bGtqcWFta25qaXdsd3RheHB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MDczODMsImV4cCI6MjA5MDI4MzM4M30.zMBLcwUkEfqaN_A5zrTxWBCXn_IiyOA1bkhb6EVH2PE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
