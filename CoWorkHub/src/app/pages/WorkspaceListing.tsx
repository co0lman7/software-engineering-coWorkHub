import { useState } from "react";
import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { WorkspaceCard } from "../components/WorkspaceCard";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search } from "lucide-react";
import { useWorkspaces } from "../../hooks/useWorkspaces";
import type { Workspace } from "../../lib/database.types";

export function WorkspaceListing() {
  const [search, setSearch]         = useState("");
  const [typeFilter, setTypeFilter] = useState<Workspace["type"] | "all">("all");
  const { workspaces, loading }     = useWorkspaces(typeFilter !== "all" ? { type: typeFilter } : {});
  const filtered = workspaces.filter(w => w.name.toLowerCase().includes(search.toLowerCase()) || w.location.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary/5 py-10 px-4">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">Browse Workspaces</h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search by name or location…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={typeFilter} onValueChange={v => setTypeFilter(v as typeof typeFilter)}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="coworking">Coworking</SelectItem>
                  <SelectItem value="meeting-room">Meeting Room</SelectItem>
                  <SelectItem value="private-office">Private Office</SelectItem>
                  <SelectItem value="desk">Desk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="container mx-auto max-w-5xl px-4 py-8">
          {loading && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({length:6}).map((_,i)=><div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />)}</div>}
          {!loading && filtered.length === 0 && <p className="text-center text-muted-foreground py-20">No workspaces found.</p>}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(w => <Link key={w.id} to={`/workspace/${w.id}`}><WorkspaceCard workspace={{...w, pricePerDay: w.price_per_day}} /></Link>)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
