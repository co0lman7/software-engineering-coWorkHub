import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import { Building2, Menu, User, Zap } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(20px)', borderColor: 'rgba(148,163,184,0.12)' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg blur-sm opacity-60 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, #3B82F6, #10B981)' }} />
              <div className="relative text-white p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #3B82F6, #10B981)' }}>
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <span className="font-semibold text-xl text-white tracking-tight">CoWork<span style={{ color: '#3B82F6' }}>Hub</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/workspaces"
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={{ color: isActive('/workspaces') ? '#3B82F6' : '#94A3B8', background: isActive('/workspaces') ? 'rgba(59,130,246,0.1)' : 'transparent' }}
            >
              Browse Spaces
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={{ color: isActive('/dashboard') ? '#3B82F6' : '#94A3B8', background: isActive('/dashboard') ? 'rgba(59,130,246,0.1)' : 'transparent' }}
            >
              My Bookings
            </Link>
            <Link
              to="/admin"
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={{ color: isActive('/admin') ? '#3B82F6' : '#94A3B8', background: isActive('/admin') ? 'rgba(59,130,246,0.1)' : 'transparent' }}
            >
              Admin
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-white">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button className="gap-2" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', border: 'none' }}>
                <Zap className="h-4 w-4" />
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="border-border" style={{ background: '#1E293B' }}>
              <div className="flex flex-col gap-4 mt-8">
                <Link to="/workspaces" className="text-lg text-foreground hover:text-primary transition-colors">
                  Browse Spaces
                </Link>
                <Link to="/dashboard" className="text-lg text-foreground hover:text-primary transition-colors">
                  My Bookings
                </Link>
                <Link to="/admin" className="text-lg text-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
                <div className="flex flex-col gap-2 mt-4">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button className="w-full" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
