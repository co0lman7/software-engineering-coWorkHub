import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Calendar as CalendarIcon, Clock, Users, MapPin, Check } from 'lucide-react';
import { workspaces } from '../data/mockData';
import { toast } from 'sonner';

export function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const workspace = workspaces.find(w => w.id === id);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState('full-day');
  const [seats, setSeats] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const timeSlots = [
    { value: 'morning', label: 'Morning (9:00 AM - 1:00 PM)', multiplier: 0.5 },
    { value: 'afternoon', label: 'Afternoon (1:00 PM - 5:00 PM)', multiplier: 0.5 },
    { value: 'full-day', label: 'Full Day (9:00 AM - 5:00 PM)', multiplier: 1 },
    { value: 'extended', label: 'Extended (9:00 AM - 9:00 PM)', multiplier: 1.5 },
  ];

  const selectedTimeSlot = timeSlots.find(slot => slot.value === timeSlot) || timeSlots[2];
  const numberOfSeats = parseInt(seats);
  const subtotal = workspace.pricePerDay * selectedTimeSlot.multiplier * numberOfSeats;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  const handleConfirmBooking = () => {
    setIsProcessing(true);
    
    // Simulate booking process
    setTimeout(() => {
      toast.success('Booking confirmed successfully!', {
        description: 'You will receive a confirmation email shortly.'
      });
      setIsProcessing(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 text-sm text-muted-foreground">
            <Link to="/workspaces" className="hover:text-primary">Workspaces</Link>
            {' '}/{' '}
            <Link to={`/workspace/${workspace.id}`} className="hover:text-primary">{workspace.name}</Link>
            {' '}/{' '}
            <span className="text-foreground">Booking</span>
          </div>
          <h1>Complete Your Booking</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workspace Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Workspace Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <img
                    src={workspace.imageUrl}
                    alt={workspace.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="mb-1">{workspace.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{workspace.location}</span>
                    </div>
                    <Badge variant="secondary">
                      {workspace.type.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                  disabled={(date) => date < new Date()}
                />
              </CardContent>
            </Card>

            {/* Time Slot Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Select Time Slot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Time Slot</Label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Number of Seats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Number of Seats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Seats Required</Label>
                  <Select value={seats} onValueChange={setSeats}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(Math.min(workspace.capacity, 20))].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1} {i === 0 ? 'seat' : 'seats'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Maximum capacity: {workspace.capacity} people
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{selectedDate?.toLocaleDateString() || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="text-right">{selectedTimeSlot.label.split('(')[1].replace(')', '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seats:</span>
                    <span>{seats}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      ${workspace.pricePerDay} × {selectedTimeSlot.multiplier} × {seats}
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee (10%)</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-semibold text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleConfirmBooking}
                  disabled={!selectedDate || isProcessing}
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>

                <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                  <p className="text-xs text-center text-muted-foreground">
                    ✓ Free cancellation up to 24 hours before
                  </p>
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    ✓ Instant confirmation
                  </p>
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    ✓ Secure payment
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
