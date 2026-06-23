import { useState } from 'react';
import { WorkspaceCard } from '../components/WorkspaceCard';
import { workspaces } from '../data/mockData';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Card, CardContent } from '../components/ui/card';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';

export function WorkspaceListingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [capacity, setCapacity] = useState([1, 50]);

  // Extract unique cities from workspaces
  const cities = ['all', ...Array.from(new Set(workspaces.map(w => w.city)))];

  // Filter workspaces based on all criteria
  const filteredWorkspaces = workspaces.filter(workspace => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workspace.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || workspace.type === selectedType;
    const matchesCity = selectedCity === 'all' || workspace.city === selectedCity;
    const matchesPrice = workspace.pricePerDay >= priceRange[0] && workspace.pricePerDay <= priceRange[1];
    const matchesCapacity = workspace.capacity >= capacity[0] && workspace.capacity <= capacity[1];
    
    return matchesSearch && matchesType && matchesCity && matchesPrice && matchesCapacity;
  });

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label>Workspace Type</Label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="desk">Hot Desk</SelectItem>
            <SelectItem value="private-office">Private Office</SelectItem>
            <SelectItem value="meeting-room">Meeting Room</SelectItem>
            <SelectItem value="coworking-space">Coworking Space</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>City</Label>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent>
            {cities.map(city => (
              <SelectItem key={city} value={city}>
                {city === 'all' ? 'All Cities' : city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Price Range (per day)</Label>
          <span className="text-sm text-muted-foreground">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <Slider
          min={0}
          max={200}
          step={5}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mt-2"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Capacity</Label>
          <span className="text-sm text-muted-foreground">
            {capacity[0]} - {capacity[1]} people
          </span>
        </div>
        <Slider
          min={1}
          max={50}
          step={1}
          value={capacity}
          onValueChange={setCapacity}
          className="mt-2"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Browse Workspaces</h1>
          <p className="text-muted-foreground">
            Find the perfect workspace for your needs
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="h-5 w-5" />
                  <h3>Filters</h3>
                </div>
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          {/* Workspace Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredWorkspaces.length} workspace{filteredWorkspaces.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filteredWorkspaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredWorkspaces.map((workspace) => (
                  <WorkspaceCard key={workspace.id} workspace={workspace} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">
                    No workspaces found matching your criteria. Try adjusting your filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
