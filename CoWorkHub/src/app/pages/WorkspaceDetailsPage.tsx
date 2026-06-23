import { Link, useParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { MapPin, Users, Star, Wifi, Coffee, Printer, Calendar as CalendarIcon, Check } from 'lucide-react';
import { workspaces } from '../data/mockData';
import { useState } from 'react';

export function WorkspaceDetailsPage() {
  const { id } = useParams();
  const workspace = workspaces.find(w => w.id === id);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  if (!workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Workspace Not Found</h2>
          <Button asChild>
            <Link to="/workspaces">Back to Workspaces</Link>
          </Button>
        </div>
      </div>
    );
  }

  const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Coffee': Coffee,
    'Printer': Printer,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-muted-foreground">
          <Link to="/workspaces" className="hover:text-primary">Workspaces</Link>
          {' '}/{' '}
          <span className="text-foreground">{workspace.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative h-96">
                <img
                  src={workspace.imageUrl}
                  alt={workspace.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-white text-foreground hover:bg-white">
                  {workspace.type.replace('-', ' ')}
                </Badge>
              </div>
            </Card>

            {/* Details */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h1 className="mb-2">{workspace.name}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-5 w-5" />
                      <span>{workspace.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-5 w-5" />
                      <span>Capacity: {workspace.capacity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(workspace.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {workspace.rating} ({workspace.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="mb-3">About This Workspace</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {workspace.description}
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {workspace.amenities.map((amenity, index) => {
                      const Icon = amenityIcons[amenity] || Check;
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Map Placeholder */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4">Location</h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">{workspace.location}</p>
                    <p className="text-sm text-muted-foreground mt-1">Map view coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-semibold text-primary">
                      ${workspace.pricePerDay}
                    </span>
                    <span className="text-muted-foreground">/ day</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <h4>Select Date</h4>
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link to={`/booking/${workspace.id}`}>Book This Workspace</Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Free cancellation up to 24 hours before booking
                  </p>
                </div>

                <div className="border-t pt-6 space-y-3">
                  <h4>Quick Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{workspace.type.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span>{workspace.capacity} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City:</span>
                      <span>{workspace.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Availability:</span>
                      <span className="text-secondary">Available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
