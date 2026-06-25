import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Calendar, CreditCard } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { useWorkspace } from "../../hooks/useWorkspaces";
import { useBookings } from "../../hooks/useBookings";

const TIMES = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];

export function Booking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = (location.state ?? {}) as { from?: string; to?: string };
  const { workspace, loading } = useWorkspace(id ?? "");
  const { createBooking } = useBookings();

  // Dates picked on the workspace page are passed via router state and pre-filled here.
  const [startDate, setStartDate] = useState(incoming.from ?? "");
  const [endDate,   setEndDate]   = useState(incoming.to ?? incoming.from ?? "");
  const [startTime, setStartTime] = useState("");
  const [endTime,   setEndTime]   = useState("");
  const [seats,     setSeats]     = useState("1");
  const [cardName, setCardName]   = useState("");
  const [cardNum,  setCardNum]    = useState("");
  const [expiry,   setExpiry]     = useState("");
  const [cvv,      setCvv]        = useState("");
  const [busy,     setBusy]       = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;
  if (!workspace) return <div className="min-h-screen flex items-center justify-center"><p>Workspace not found.</p></div>;

  // Inclusive day count (single day = 1); falls back to 1 until both dates are set.
  const days = startDate && endDate
    ? Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000) + 1)
    : 1;
  const subtotal = workspace.price_per_day * days;
  const total = subtotal + 5;
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!startDate || !endDate || !startTime || !endTime) { toast.error("Fill in all booking details"); return; }
    if (endDate < startDate) { toast.error("End date can't be before start date"); return; }
    setBusy(true);
    const { error } = await createBooking({ workspaceId: workspace.id, date: startDate, endDate, startTime, endTime, seats: parseInt(seats), totalPrice: total });
    setBusy(false);
    if (error) toast.error("Booking failed", { description: error });
    else { toast.success("Booking confirmed!"); setTimeout(() => navigate("/dashboard"), 1200); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Booking Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Start Date</Label>
                    <Input type="date" required min={today} value={startDate}
                      onChange={e => { setStartDate(e.target.value); if (endDate && e.target.value > endDate) setEndDate(e.target.value); }} />
                  </div>
                  <div className="space-y-2"><Label>End Date</Label>
                    <Input type="date" required min={startDate || today} value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Start Time</Label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                      <SelectContent>{TIMES.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>End Time</Label>
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                      <SelectContent>{TIMES.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2"><Label>Seats</Label>
                  <Select value={seats} onValueChange={setSeats}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Array.from({length:Math.min(workspace.capacity,10)},(_,i)=>i+1).map(n=><SelectItem key={n} value={String(n)}>{n} {n===1?"seat":"seats"}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Payment</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Name on Card</Label><Input required value={cardName} onChange={e=>setCardName(e.target.value)} /></div>
                <div className="space-y-2"><Label>Card Number</Label><Input required placeholder="1234 5678 9012 3456" value={cardNum} onChange={e=>setCardNum(e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Expiry</Label><Input placeholder="MM/YY" required value={expiry} onChange={e=>setExpiry(e.target.value)} /></div>
                  <div className="space-y-2"><Label>CVV</Label><Input placeholder="123" required value={cvv} onChange={e=>setCvv(e.target.value)} /></div>
                </div>
              </CardContent>
            </Card>
            <Button type="submit" className="w-full" size="lg" disabled={busy}>{busy ? "Processing…" : `Confirm & Pay $${total}`}</Button>
          </form>
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg overflow-hidden h-40"><ImageWithFallback src={workspace.image} alt={workspace.name} className="w-full h-full object-cover" /></div>
              <div><h3 className="font-semibold">{workspace.name}</h3><p className="text-sm text-muted-foreground">{workspace.location}</p></div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">${workspace.price_per_day} × {days} {days===1?"day":"days"}</span><span>${subtotal}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Service fee</span><span>$5</span></div>
                <Separator />
                <div className="flex justify-between font-semibold text-base"><span>Total</span><span>${total}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
