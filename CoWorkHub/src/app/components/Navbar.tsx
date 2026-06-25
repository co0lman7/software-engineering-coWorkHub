import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Building2, Menu, User, LogOut, LayoutDashboard } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "../../hooks/useAuth";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = profile?.role === "admin";
  const displayName = profile?.name || user?.email?.split("@")[0] || "Account";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className="px-4 py-2 rounded-lg text-sm transition-all"
      style={{ color: isActive(to) ? '#3B82F6' : '#94A3B8', background: isActive(to) ? 'rgba(59,130,246,0.1)' : 'transparent' }}
    >
      {label}
    </Link>
  );

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
            {navLink("/workspaces", "Browse Spaces")}
            {user && navLink("/dashboard", "My Bookings")}
            {isAdmin && navLink("/admin", "Admin")}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? null : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors outline-none hover:bg-white/5">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url ?? undefined} />
                      <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-white max-w-[140px] truncate">{displayName}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate">{profile?.name ?? "Signed in"}</span>
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="h-4 w-4 mr-2" /> My Bookings
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Building2 className="h-4 w-4 mr-2" /> Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                    <LogOut className="h-4 w-4 mr-2" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-white">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
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
                {user && (
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url ?? undefined} />
                      <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{profile?.name ?? "Account"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                )}
                <Link to="/workspaces" className="text-lg text-foreground hover:text-primary transition-colors">
                  Browse Spaces
                </Link>
                {user && (
                  <Link to="/dashboard" className="text-lg text-foreground hover:text-primary transition-colors">
                    My Bookings
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="text-lg text-foreground hover:text-primary transition-colors">
                    Admin
                  </Link>
                )}
                <div className="flex flex-col gap-2 mt-4">
                  {user ? (
                    <Button variant="outline" className="w-full" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </Button>
                  ) : (
                    <Link to="/login">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
