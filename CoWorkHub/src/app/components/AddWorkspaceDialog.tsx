import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "./ui/dialog";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import type { NewWorkspace } from "../../hooks/useAdminData";
import type { Workspace } from "../../lib/database.types";

const EMPTY_FORM = {
  name: "", location: "", description: "",
  price_per_day: "", capacity: "", type: "coworking" as Workspace["type"],
  image: "", amenities: "", available: true,
};

export function AddWorkspaceDialog({ onCreate }: { onCreate: (w: NewWorkspace) => Promise<{ error: string | null }> }) {
  const [open, setOpen]   = useState(false);
  const [busy, setBusy]   = useState(false);
  const [form, setForm]   = useState(EMPTY_FORM);

  const set = <K extends keyof typeof EMPTY_FORM>(key: K, value: typeof EMPTY_FORM[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price_per_day);
    const capacity = Number(form.capacity);
    if (!form.name.trim() || !form.location.trim() || !price || !capacity) {
      toast.error("Please fill in name, location, price and capacity");
      return;
    }
    setBusy(true);
    const image = form.image.trim() || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1080";
    const { error } = await onCreate({
      name: form.name.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      price_per_day: price,
      capacity,
      type: form.type,
      image,
      images: [image],
      amenities: form.amenities.split(",").map(a => a.trim()).filter(Boolean),
      available: form.available,
    });
    setBusy(false);
    if (error) {
      toast.error("Failed to add workspace", { description: error });
    } else {
      toast.success("Workspace added");
      setForm(EMPTY_FORM);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Building2 className="h-4 w-4 mr-2" />
          Add Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Workspace</DialogTitle>
          <DialogDescription>Create a new listing for the platform.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Downtown Tech Hub" required />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={form.location} onChange={e => set("location", e.target.value)} placeholder="San Francisco, CA" required />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Modern coworking space in the heart of downtown." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price / Day ($)</Label>
              <Input type="number" min="0" step="0.01" value={form.price_per_day} onChange={e => set("price_per_day", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input type="number" min="1" step="1" value={form.capacity} onChange={e => set("capacity", e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={v => set("type", v as Workspace["type"])}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="coworking">Coworking</SelectItem>
                <SelectItem value="meeting-room">Meeting Room</SelectItem>
                <SelectItem value="private-office">Private Office</SelectItem>
                <SelectItem value="desk">Desk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://…" />
          </div>
          <div className="space-y-2">
            <Label>Amenities (comma separated)</Label>
            <Input value={form.amenities} onChange={e => set("amenities", e.target.value)} placeholder="High-Speed WiFi, Coffee & Tea, 24/7 Access" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Available for booking</Label>
            <Switch checked={form.available} onCheckedChange={v => set("available", v)} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>{busy ? "Adding…" : "Add Workspace"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
