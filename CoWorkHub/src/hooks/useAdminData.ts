import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Workspace, Profile } from "../lib/database.types";

export type AdminBooking = {
  id: string; user_id: string; workspace_id: string;
  date: string; end_date: string; start_time: string; end_time: string;
  seats: number; total_price: number;
  status: "upcoming" | "completed" | "cancelled"; created_at: string;
  workspace: Pick<Workspace, "name"> | null;
  user: Pick<Profile, "name" | "email"> | null;
};

export function useAdminData() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [bookings, setBookings]     = useState<AdminBooking[]>([]);
  const [profiles, setProfiles]     = useState<Profile[]>([]);
  const [loading, setLoading]       = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [{ data: ws }, { data: bk }, { data: pr }] = await Promise.all([
      supabase.from("workspaces").select("*").order("created_at", { ascending: false }),
      supabase.from("bookings").select("*, workspace:workspaces(name), user:profiles(name,email)").order("date", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    ]);
    setWorkspaces(ws ?? []);
    setBookings((bk as AdminBooking[]) ?? []);
    setProfiles(pr ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { workspaces, bookings, profiles, loading, refresh };
}
