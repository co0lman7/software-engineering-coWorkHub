import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { WorkspaceCard } from "../components/WorkspaceCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Card, CardContent } from "../components/ui/card";
import { Search, SlidersHorizontal } from "lucide-react";
import { mockWorkspaces } from "../data/mockData";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";

export function WorkspaceListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [capacityFilter, setCapacityFilter] = useState<string>("all");

  const filteredWorkspaces = mockWorkspaces.filter((workspace) => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workspace.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || workspace.type === typeFilter;
    const matchesPrice = workspace.pricePerDay >= priceRange[0] && workspace.pricePerDay <= priceRange[1];
    const matchesCapacity = capacityFilter === "all" ||
                           (capacityFilter === "small" && workspace.capacity <= 5) ||
                           (capacityFilter === "medium" && workspace.capacity > 5 && workspace.capacity <= 20) ||
                           (capacityFilter === "large" && workspace.capacity > 20);
    
    return matchesSearch && matchesType && matchesPrice && matchesCapacity;
  });

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Workspace Type</Label>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="coworking">Coworking Space</SelectItem>
            <SelectItem value="meeting-room">Meeting Room</SelectItem>
            <SelectItem value="private-office">Private Office</SelectItem>
            <SelectItem value="desk">Desk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Price Range (per day)</Label>
        <div className="pt-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={200}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Capacity</Label>
        <Select value={capacityFilter} onValueChange={setCapacityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Any capacity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Capacity</SelectItem>
            <SelectItem value="small">1-5 people</SelectItem>
            <SelectItem value="medium">6-20 people</SelectItem>
            <SelectItem value="large">20+ people</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setTypeFilter("all");
          setPriceRange([0, 200]);
          setCapacityFilter("all");
        }}
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0F172A' }}>
      <Navbar />
      
      <div className="py-14" style={{ background: 'linear-gradient(135deg, #0A1120 0%, #0F172A 100%)', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: '#3B82F6' }}>Discover</p>
          <h1 className="text-white mb-2" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Browse Workspaces</h1>
          <p style={{ color: '#64748B' }}>Find the perfect premium workspace for your needs</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1" style={{ background: '#0F172A' }}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-20" style={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.1)' }}>
              <CardContent className="p-6">
                <h3 className="mb-4 text-white">Filters</h3>
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Mobile Filter */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-5 w-5 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Refine your workspace search
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredWorkspaces.length} {filteredWorkspaces.length === 1 ? 'workspace' : 'workspaces'} found
              </p>
            </div>

            {/* Workspace Grid */}
            {filteredWorkspaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredWorkspaces.map((workspace) => (
                  <WorkspaceCard key={workspace.id} workspace={workspace} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No workspaces found matching your criteria</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("all");
                    setPriceRange([0, 200]);
                    setCapacityFilter("all");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
