import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { toast } from "sonner";
import type { NewWorkspace } from "../../hooks/useAdminData";
import type { Workspace } from "../../lib/database.types";

const EMPTY_FORM = {
  name: "", location: "", description: "",
  price_per_day: "", capacity: "", type: "coworking" as Workspace["type"],
  image: "", amenities: "", available: true,
};

export function EditWorkspaceDialog({
  workspace,
  open,
  onOpenChange,
  onSave,
}: {
  workspace: Workspace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, w: Partial<NewWorkspace>) => Promise<{ error: string | null }>;
}) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (workspace) {
      setForm({
        name: workspace.name,
        location: workspace.location,
        description: workspace.description ?? "",
        price_per_day: String(workspace.price_per_day),
        capacity: String(workspace.capacity),
        type: workspace.type,
        image: workspace.image ?? "",
        amenities: (workspace.amenities ?? []).join(", "),
        available: workspace.available,
      });
    }
  }, [workspace]);

  const set = <K extends keyof typeof EMPTY_FORM>(key: K, value: typeof EMPTY_FORM[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace) return;
    const price = Number(form.price_per_day);
    const capacity = Number(form.capacity);
    if (!form.name.trim() || !form.location.trim() || !price || !capacity) {
      toast.error("Please fill in name, location, price and capacity");
      return;
    }
    setBusy(true);
    const image = form.image.trim() || workspace.image;
    const { error } = await onSave(workspace.id, {
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
      toast.error("Failed to update workspace", { description: error });
    } else {
      toast.success("Workspace updated");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
          <DialogDescription>Update this listing's details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={e => set("name", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={form.location} onChange={e => set("location", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => set("description", e.target.value)} />
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
            <Input value={form.image} onChange={e => set("image", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Amenities (comma separated)</Label>
            <Input value={form.amenities} onChange={e => set("amenities", e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Available for booking</Label>
            <Switch checked={form.available} onCheckedChange={v => set("available", v)} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}