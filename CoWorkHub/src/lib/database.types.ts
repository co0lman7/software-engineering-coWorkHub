export type Profile = {
  id: string; name: string; avatar_url: string | null;
  role: "user" | "admin"; created_at: string;
};
export type Workspace = {
  id: string; name: string; location: string; description: string;
  price_per_day: number; capacity: number; rating: number; reviews: number;
  type: "desk" | "meeting-room" | "private-office" | "coworking";
  image: string; images: string[]; amenities: string[];
  available: boolean; created_at: string;
};
export type Booking = {
  id: string; user_id: string; workspace_id: string;
  date: string; end_date: string; start_time: string; end_time: string;
  seats: number; total_price: number;
  status: "upcoming" | "completed" | "cancelled"; created_at: string;
};
export type BookingWithWorkspace = Booking & {
  workspace: Pick<Workspace, "name" | "image" | "location">;
};
