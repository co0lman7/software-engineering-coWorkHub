import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Calendar } from "../components/ui/calendar";
import { MapPin, Users, Star, Wifi, Coffee, Clock, Phone, Printer, CheckCircle2, ArrowLeft } from "lucide-react";
import { useWorkspace } from "../../hooks/useWorkspaces";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function WorkspaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { workspace, loading } = useWorkspace(id ?? "");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4">Workspace not found</h2>
            <Link to="/workspaces">
              <Button>Back to Workspaces</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const amenityIcons: { [key: string]: typeof Wifi } = {
    'High-Speed WiFi': Wifi,
    'Coffee & Tea': Coffee,
    '24/7 Access': Clock,
    'Phone Booths': Phone,
    'Printing': Printer,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={workspace.images[selectedImageIndex]}
                  alt={workspace.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {workspace.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {workspace.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${workspace.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Workspace Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="mb-3">
                    {workspace.type === 'coworking' && 'Coworking Space'}
                    {workspace.type === 'meeting-room' && 'Meeting Room'}
                    {workspace.type === 'private-office' && 'Private Office'}
                    {workspace.type === 'desk' && 'Desk'}
                  </Badge>
                  <h1 className="mb-2">{workspace.name}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{workspace.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Up to {workspace.capacity} people</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{workspace.rating}</span>
                  <span className="text-muted-foreground">({workspace.reviews} reviews)</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">{workspace.description}</p>
            </div>

            {/* Amenities */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4">Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workspace.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || CheckCircle2;
                    return (
                      <div key={amenity} className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-semibold text-primary">
                      ${workspace.price_per_day}
                    </span>
                    <span className="text-muted-foreground">/day</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Best rates guaranteed
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Select Date
                    </label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price per day</span>
                      <span>${workspace.price_per_day}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service fee</span>
                      <span>$5</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold text-primary">
                        ${workspace.price_per_day + 5}
                      </span>
                    </div>
                  </div>

                  <Link to={`/booking/${workspace.id}`} className="block">
                    <Button className="w-full" size="lg">
                      Book Now
                    </Button>
                  </Link>

                  <p className="text-xs text-center text-muted-foreground">
                    You won't be charged yet
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
