import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Search, MapPin, Calendar, Wifi, Coffee, Users, Shield, Clock, Star } from 'lucide-react';
import { workspaces, testimonials } from '../data/mockData';
import { WorkspaceCard } from '../components/WorkspaceCard';
import { useState } from 'react';

export function LandingPage() {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    window.location.href = `/workspaces?location=${location}&date=${date}`;
  };

  const benefits = [
    {
      icon: <Wifi className="h-8 w-8 text-primary" />,
      title: 'High-Speed WiFi',
      description: 'Reliable and fast internet connection in all our workspaces'
    },
    {
      icon: <Coffee className="h-8 w-8 text-primary" />,
      title: 'Free Amenities',
      description: 'Complimentary coffee, tea, and access to kitchen facilities'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Community',
      description: 'Network with professionals and grow your business'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Secure Access',
      description: '24/7 secure access with modern security systems'
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: 'Flexible Booking',
      description: 'Book by the hour, day, or month - whatever suits you'
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: 'Prime Locations',
      description: 'Workspaces in the best locations across major cities'
    }
  ];

  const featuredWorkspaces = workspaces.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
              Find and Book Your Perfect Workspace
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover flexible coworking spaces, meeting rooms, and private offices in prime locations. Book instantly and work your way.
            </p>
          </div>

          {/* Search Bar */}
          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter location..."
                    className="pl-10"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <Button size="lg" className="w-full" onClick={handleSearch}>
                  <Search className="h-5 w-5 mr-2" />
                  Search Workspaces
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Workspaces */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Featured Workspaces</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our handpicked selection of premium coworking spaces and meeting rooms
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredWorkspaces.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
          </div>
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/workspaces">View All Workspaces</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Why Choose CoWorkHub?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for a productive and comfortable work experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">What Our Members Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied professionals who trust CoWorkHub
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/90 text-xl mb-8">
            Join CoWorkHub today and find your perfect workspace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/login">Create Free Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white hover:bg-white/90" asChild>
              <Link to="/workspaces">Browse Workspaces</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
