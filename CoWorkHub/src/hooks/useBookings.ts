import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";
import type { BookingWithWorkspace } from "../lib/database.types";

export function useBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithWorkspace[]>([]);
  const [loading,  setLoading]  = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!user) { setBookings([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase.from("bookings")
      .select("*, workspace:workspaces(name,image,location)")
      .eq("user_id", user.id).order("date", { ascending: false });
    setBookings((data as BookingWithWorkspace[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const createBooking = async (p: { workspaceId: string; date: string; endDate: string; startTime: string; endTime: string; seats: number; totalPrice: number }) => {
    if (!user) return { error: "Not authenticated" };
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id, workspace_id: p.workspaceId, date: p.date, end_date: p.endDate,
      start_time: p.startTime, end_time: p.endTime, seats: p.seats,
      total_price: p.totalPrice, status: "upcoming",
    });
    if (!error) await fetchBookings();
    return { error: error?.message ?? null };
  };

  const cancelBooking = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ status: "cancelled" })
      .eq("id", id).eq("user_id", user?.id ?? "");
    if (!error) await fetchBookings();
    return { error: error?.message ?? null };
  };

  return { bookings, loading, createBooking, cancelBooking };
}
