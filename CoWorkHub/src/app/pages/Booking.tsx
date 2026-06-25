import { useState } from "react";
import { useParams, useNavigate } from "react-router";
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

export function Booking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workspace, loading } = useWorkspace(id ?? "");
  const { createBooking } = useBookings();

  const [date,s,e,seats] = [useState(""), useState(""), useState(""), useState("1")];
  const [cardName, setCardName]   = useState("");
  const [cardNum,  setCardNum]    = useState("");
  const [expiry,   setExpiry]     = useState("");
  const [cvv,      setCvv]        = useState("");
  const [busy,     setBusy]       = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;
  if (!workspace) return <div className="min-h-screen flex items-center justify-center"><p>Workspace not found.</p></div>;

  const total = workspace.price_per_day + 5;

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!date[0] || !s[0] || !e[0]) { toast.error("Fill in all booking details"); return; }
    setBusy(true);
    const { error } = await createBooking({ workspaceId: workspace.id, date: date[0], startTime: s[0], endTime: e[0], seats: parseInt(seats[0]), totalPrice: total });
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
                <div className="space-y-2"><Label>Date</Label><Input type="date" required min={new Date().toISOString().split("T")[0]} value={date[0]} onChange={e => date[1](e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-4">
                  {[["Start", s],["End", e]].map(([label, state]) => (
                    <div key={label as string} className="space-y-2"><Label>{label as string} Time</Label>
                      <Select value={(state as typeof s)[0]} onValueChange={(state as typeof s)[1]}>
                        <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                        <SelectContent>{["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"].map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                <div className="space-y-2"><Label>Seats</Label>
                  <Select value={seats[0]} onValueChange={seats[1]}>
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
                <div className="flex justify-between"><span className="text-muted-foreground">Workspace fee</span><span>${workspace.price_per_day}</span></div>
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
