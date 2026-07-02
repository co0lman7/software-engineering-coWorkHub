import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Calendar, Clock, History as HistoryIcon, ListChecks, MapPin, XCircle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { useBookings } from "../../hooks/useBookings";
import type { BookingWithWorkspace } from "../../lib/database.types";

export function UserDashboard() {
  const { user, profile } = useAuth();
  const { bookings, loading, cancelBooking } = useBookings();
  const [historyFilter, setHistoryFilter] = useState<"all" | "completed" | "cancelled">("all");
  const upcoming = bookings.filter(b => b.status === "upcoming");
  const history  = bookings.filter(b => b.status !== "upcoming");
  const filteredHistory = historyFilter === "all" ? history : history.filter(b => b.status === historyFilter);
  const completedCount = bookings.filter(b => b.status === "completed").length;
  const cancelledCount = bookings.filter(b => b.status === "cancelled").length;
  const totalSpent = bookings.filter(b => b.status !== "cancelled").reduce((sum, b) => sum + b.total_price, 0);
  const nextUpcoming = upcoming.reduce<BookingWithWorkspace | null>((soonest, b) => !soonest || b.date < soonest.date ? b : soonest, null);

  const handleCancel = async (id: string) => {
    const { error } = await cancelBooking(id);
    if (error) toast.error("Failed", { description: error });
    else toast.success("Booking cancelled");
  };

  const BookingCard = ({ b }: { b: BookingWithWorkspace }) => (
    <Card><CardContent className="p-6">
      <div className="flex gap-4">
        <div className="w-28 h-28 rounded-lg overflow-hidden flex-shrink-0">
          <ImageWithFallback src={b.workspace.image} alt={b.workspace.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg truncate">{b.workspace.name}</h3>
            <Badge className={{ upcoming:"bg-blue-100 text-blue-800", completed:"bg-green-100 text-green-800", cancelled:"bg-red-100 text-red-800" }[b.status]}>
              {b.status}
            </Badge>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{b.workspace.location}</div>
            <div className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />
              {new Date(b.date).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
              {b.end_date && b.end_date !== b.date && ` – ${new Date(b.end_date).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}`}
            </div>
            <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{b.start_time} – {b.end_time}</div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">${b.total_price}</span>
            {b.status === "upcoming" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50"><XCircle className="h-4 w-4 mr-1" />Cancel</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Cancel Booking?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleCancel(b.id)} className="bg-red-600 hover:bg-red-700">Cancel</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </CardContent></Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback>{profile?.name?.charAt(0) ?? "?"}</AvatarFallback>
          </Avatar>
          <div><h1 className="text-2xl font-bold">{profile?.name ?? "My Dashboard"}</h1><p className="text-muted-foreground">{user?.email}</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="gap-2">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
              <CardTitle className="text-sm">Total Bookings</CardTitle>
              <ListChecks className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-3xl font-semibold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">${totalSpent.toLocaleString()} total spent</p>
            </CardContent>
          </Card>
          <Card className="gap-2">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
              <CardTitle className="text-sm">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-3xl font-semibold">{upcoming.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {nextUpcoming ? `Next: ${new Date(nextUpcoming.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}` : "None scheduled"}
              </p>
            </CardContent>
          </Card>
          <Card className="gap-2">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
              <CardTitle className="text-sm">History</CardTitle>
              <HistoryIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-3xl font-semibold">{history.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{completedCount} completed · {cancelledCount} cancelled</p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="history">History ({history.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-4">
            {loading && <p className="text-muted-foreground">Loading…</p>}
            {!loading && upcoming.length === 0 && <Card><CardContent className="py-12 text-center text-muted-foreground">No upcoming bookings. <a href="/workspaces" className="text-primary hover:underline">Browse workspaces</a></CardContent></Card>}
            {upcoming.map(b => <BookingCard key={b.id} b={b} />)}
          </TabsContent>
          <TabsContent value="history" className="space-y-4">
            <div className="flex justify-end">
              <Select value={historyFilter} onValueChange={v => setHistoryFilter(v as typeof historyFilter)}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!loading && filteredHistory.length === 0 && (
              <Card><CardContent className="py-12 text-center text-muted-foreground">
                No {historyFilter === "all" ? "" : `${historyFilter} `}history yet.
              </CardContent></Card>
            )}
            {filteredHistory.map(b => <BookingCard key={b.id} b={b} />)}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
