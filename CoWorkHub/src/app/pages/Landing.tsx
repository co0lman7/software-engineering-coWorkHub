import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { WorkspaceCard } from "../components/WorkspaceCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Search, MapPin, Calendar, Wifi, Coffee, Shield, Clock,
  Star, Quote, ArrowRight, Users, TrendingUp, Globe, CheckCircle
} from "lucide-react";
import { mockWorkspaces } from "../data/mockData";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useLocationSuggestions } from "../../hooks/useLocationSuggestions";

const HERO_BG = "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1920&h=1080&fit=crop&auto=format";
const CITY_IMG = "https://images.unsplash.com/photo-1762429648253-b8bc921c8b30?w=800&h=600&fit=crop&auto=format";
const LOUNGE_IMG = "https://images.unsplash.com/photo-1759301495186-d3787210df5b?w=800&h=600&fit=crop&auto=format";

export function Landing() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, loading: suggestionsLoading } = useLocationSuggestions(location);

  const featuredWorkspaces = mockWorkspaces.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    navigate(params.toString() ? `/workspaces?${params.toString()}` : "/workspaces");
  };

  const selectSuggestion = (label: string) => {
    setLocation(label);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0F172A' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={HERO_BG}
            alt="Premium coworking interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.7) 60%, rgba(15,23,42,0.4) 100%)' }} />
          {/* Glowing orbs */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: '#3B82F6' }} />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-15" style={{ background: '#10B981' }} />
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl">
            <Badge className="mb-6 px-4 py-1.5 text-sm border" style={{ background: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.4)', color: '#93C5FD' }}>
              ✦ Trusted by 50,000+ professionals worldwide
            </Badge>

            <h1 className="text-5xl md:text-7xl leading-tight mb-6 text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              Work Anywhere,{" "}
              <span style={{ background: 'linear-gradient(135deg, #3B82F6, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Thrive Everywhere
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-10" style={{ color: '#94A3B8', maxWidth: '640px', lineHeight: '1.6' }}>
              Discover premium coworking spaces, executive suites, and meeting rooms in the world's most inspiring cities.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="rounded-2xl p-2 flex flex-col md:flex-row gap-2 mb-8" style={{ background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(148,163,184,0.15)', backdropFilter: 'blur(20px)' }}>
              <div className="flex-1 flex items-center gap-3 px-4 py-2 relative">
                <MapPin className="h-5 w-5 flex-shrink-0" style={{ color: '#3B82F6' }} />
                <Input
                  type="text"
                  placeholder="City, neighborhood, or address"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  autoComplete="off"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-white placeholder:text-muted-foreground"
                />
                {showSuggestions && location.trim().length >= 2 && (suggestionsLoading || suggestions.length > 0) && (
                  <div
                    className="absolute left-0 right-0 top-full mt-2 rounded-xl overflow-hidden z-20 shadow-xl"
                    style={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.15)' }}
                  >
                    {suggestionsLoading && <div className="px-4 py-3 text-sm" style={{ color: '#94A3B8' }}>Searching…</div>}
                    {!suggestionsLoading && suggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectSuggestion(s.value)}
                        className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/5 flex items-center gap-2"
                      >
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#3B82F6' }} />
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="hidden md:block w-px my-2" style={{ background: 'rgba(148,163,184,0.2)' }} />
              <div className="flex-1 flex items-center gap-3 px-4 py-2">
                <Calendar className="h-5 w-5 flex-shrink-0" style={{ color: '#10B981' }} />
                <Input
                  type="date"
                  placeholder="Select date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-white"
                />
              </div>
              <Button type="submit" size="lg" className="gap-2 px-8 rounded-xl" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', border: 'none', fontWeight: 600 }}>
                <Search className="h-5 w-5" />
                Search
              </Button>
            </form>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: Globe, label: '120+ Cities', color: '#3B82F6' },
                { icon: Users, label: '50K+ Members', color: '#10B981' },
                { icon: TrendingUp, label: '4.9★ Avg Rating', color: '#F59E0B' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color }} />
                  <span className="text-sm" style={{ color: '#94A3B8' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Workspaces ── */}
      <section className="py-24" style={{ background: '#0F172A' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
            <div>
              <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: '#3B82F6' }}>Featured Spaces</p>
              <h2 className="text-4xl text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                Curated for High Performers
              </h2>
            </div>
            <Link to="/workspaces">
              <Button variant="ghost" className="gap-2 mt-4 md:mt-0" style={{ color: '#94A3B8' }}>
                View all spaces <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWorkspaces.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Full-bleed split section ── */}
      <section className="py-24" style={{ background: '#0A1120' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-medium mb-4 uppercase tracking-widest" style={{ color: '#10B981' }}>Why CoWorkHub</p>
              <h2 className="text-4xl text-white mb-6" style={{ fontWeight: 700, letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                Premium Spaces,<br />Zero Compromises
              </h2>
              <p className="mb-10" style={{ color: '#94A3B8', lineHeight: '1.7', fontSize: '1.05rem' }}>
                We partner with the world's finest workspace operators so every booking delivers on its promise — whether you need a quiet desk or a boardroom for 50.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Instant Confirmation', desc: 'No waiting — book and receive confirmation in seconds.' },
                  { title: 'Flexible Cancellation', desc: 'Plans change. Cancel up to 24h before for a full refund.' },
                  { title: 'Vetted Spaces Only', desc: 'Every listing passes our quality and safety standards.' },
                  { title: 'Global Network', desc: 'Access 10,000+ locations in 120 cities worldwide.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="mt-0.5 flex-shrink-0">
                      <CheckCircle className="h-5 w-5" style={{ color: '#10B981' }} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{title}</p>
                      <p className="text-sm" style={{ color: '#64748B' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/workspaces">
                  <Button size="lg" className="gap-2" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', border: 'none' }}>
                    Explore Workspaces <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                <ImageWithFallback src={LOUNGE_IMG} alt="Premium lounge coworking space" className="w-full h-full object-cover" />
                <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 60%)' }} />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl p-5 shadow-2xl" style={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.15)' }}>
                <p className="text-3xl text-white" style={{ fontWeight: 700 }}>98%</p>
                <p className="text-sm" style={{ color: '#94A3B8' }}>member satisfaction</p>
              </div>
              <div className="absolute -top-6 -right-6 rounded-2xl p-5 shadow-2xl" style={{ background: 'linear-gradient(135deg, #3B82F6, #10B981)', border: 'none' }}>
                <p className="text-3xl text-white" style={{ fontWeight: 700 }}>10K+</p>
                <p className="text-sm text-white opacity-90">locations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Amenities grid ── */}
      <section className="py-24" style={{ background: '#0F172A' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: '#3B82F6' }}>Included Everywhere</p>
            <h2 className="text-4xl text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Everything You Need to Do Your Best Work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Wifi, title: 'Gigabit WiFi', desc: 'Dedicated fiber connections for video calls and large uploads.', color: '#3B82F6' },
              { icon: Clock, title: '24/7 Access', desc: 'Your schedule, your way. Night owl or early bird — we\'re open.', color: '#10B981' },
              { icon: Coffee, title: 'Premium Coffee', desc: 'Specialty brews, craft teas, and fresh snacks all day long.', color: '#F59E0B' },
              { icon: Shield, title: 'Secure Booking', desc: 'Bank-level encryption protects every transaction.', color: '#8B5CF6' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="group rounded-2xl p-8 cursor-default transition-all duration-300" style={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.1)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110" style={{ background: `${color}1A` }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <h4 className="text-white mb-2" style={{ fontWeight: 600 }}>{title}</h4>
                <p className="text-sm" style={{ color: '#64748B', lineHeight: '1.6' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── City photo section ── */}
      <section className="relative overflow-hidden" style={{ height: '480px' }}>
        <ImageWithFallback src={CITY_IMG} alt="City skyline at night" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 50%, rgba(15,23,42,0.3) 100%)' }} />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-xl">
              <p className="text-sm font-medium mb-4 uppercase tracking-widest" style={{ color: '#10B981' }}>Global Reach</p>
              <h2 className="text-4xl text-white mb-6" style={{ fontWeight: 700, letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                Your Workspace,<br />Any City in the World
              </h2>
              <p className="mb-8" style={{ color: '#94A3B8' }}>From New York to Tokyo, London to Singapore — CoWorkHub is where the world's professionals come to work.</p>
              <Link to="/workspaces">
                <Button size="lg" style={{ background: 'white', color: '#0F172A', fontWeight: 600, border: 'none' }}>
                  Find a Space Near You
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24" style={{ background: '#0A1120' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: '#3B82F6' }}>Testimonials</p>
            <h2 className="text-4xl text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>What Our Members Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: '"CoWorkHub made it incredibly easy to find the perfect workspace for my team. The booking process is seamless and the spaces are always exactly as described."', name: 'Jessica Davis', role: 'Startup Founder, NYC', initials: 'JD', color: '#3B82F6' },
              { text: '"The variety of spaces is amazing. I travel every month and always find a premium desk or office no matter where I am. Absolute game changer for remote work."', name: 'Michael Chen', role: 'Freelance Designer, SF', initials: 'MC', color: '#10B981' },
              { text: '"Professional spaces with exceptional amenities. The meeting rooms are perfect for client presentations — our clients always notice the quality."', name: 'Sarah Parker', role: 'Business Consultant, LA', initials: 'SP', color: '#8B5CF6' },
            ].map(({ text, name, role, initials, color }) => (
              <div key={name} className="rounded-2xl p-8" style={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.1)' }}>
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="h-8 w-8 mb-4 opacity-30" style={{ color }} />
                <p className="mb-6" style={{ color: '#CBD5E1', lineHeight: '1.7', fontSize: '0.95rem' }}>{text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                    {initials}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{name}</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24" style={{ background: '#0F172A' }}>
        <div className="container mx-auto px-4">
          <div className="rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #1E293B 50%, #0D2137 100%)', border: '1px solid rgba(59,130,246,0.3)' }}>
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: '#3B82F6' }} />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: '#10B981' }} />
            <div className="relative p-16 text-center">
              <h2 className="text-4xl md:text-5xl text-white mb-4" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                Ready to Elevate Your Work?
              </h2>
              <p className="text-xl mb-10 mx-auto max-w-xl" style={{ color: '#94A3B8' }}>
                Join 50,000+ professionals who book smarter with CoWorkHub.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <Button size="lg" className="gap-2 px-10" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', border: 'none', fontWeight: 600 }}>
                    Start for Free <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/workspaces">
                  <Button size="lg" variant="outline" className="px-10" style={{ color: '#94A3B8', borderColor: 'rgba(148,163,184,0.3)', background: 'transparent' }}>
                    Browse Spaces
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
