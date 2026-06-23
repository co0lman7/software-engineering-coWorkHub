import { Link } from "react-router";
import { Building2, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Footer() {
  return (
    <footer style={{ background: '#070E1A', borderTop: '1px solid rgba(148,163,184,0.1)' }}>
      {/* Newsletter strip */}
      <div className="border-b" style={{ borderColor: 'rgba(148,163,184,0.1)' }}>
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div>
              <h3 className="text-white mb-1" style={{ fontWeight: 600 }}>Stay in the loop</h3>
              <p className="text-sm" style={{ color: '#64748B' }}>New spaces, exclusive deals, and productivity tips — delivered weekly.</p>
            </div>
            <div className="flex gap-2 flex-1 max-w-sm">
              <Input
                type="email"
                placeholder="your@email.com"
                className="rounded-xl"
                style={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.15)', color: 'white' }}
              />
              <Button className="rounded-xl gap-1.5 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', border: 'none' }}>
                Subscribe <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg blur-sm opacity-60" style={{ background: 'linear-gradient(135deg, #3B82F6, #10B981)' }} />
                <div className="relative text-white p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #3B82F6, #10B981)' }}>
                  <Building2 className="h-5 w-5" />
                </div>
              </div>
              <span className="font-semibold text-xl text-white">CoWork<span style={{ color: '#3B82F6' }}>Hub</span></span>
            </Link>
            <p className="text-sm" style={{ color: '#475569', lineHeight: '1.7' }}>
              The world's most trusted platform for finding and booking premium coworking spaces.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(148,163,184,0.08)', color: '#475569' }}>
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white mb-5 text-sm uppercase tracking-widest" style={{ fontWeight: 600, letterSpacing: '0.1em' }}>Company</h4>
            <ul className="space-y-3 text-sm">
              {['About Us', 'Careers', 'Press', 'Blog'].map((item) => (
                <li key={item}>
                  <Link to="/" className="transition-colors hover:text-white" style={{ color: '#475569' }}>{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white mb-5 text-sm uppercase tracking-widest" style={{ fontWeight: 600, letterSpacing: '0.1em' }}>Support</h4>
            <ul className="space-y-3 text-sm">
              {['Help Center', 'Contact Us', 'FAQs', 'Accessibility'].map((item) => (
                <li key={item}>
                  <Link to="/" className="transition-colors hover:text-white" style={{ color: '#475569' }}>{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white mb-5 text-sm uppercase tracking-widest" style={{ fontWeight: 600, letterSpacing: '0.1em' }}>Legal</h4>
            <ul className="space-y-3 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Cancellation'].map((item) => (
                <li key={item}>
                  <Link to="/" className="transition-colors hover:text-white" style={{ color: '#475569' }}>{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm" style={{ borderTop: '1px solid rgba(148,163,184,0.1)', color: '#334155' }}>
          <p>© 2026 CoWorkHub. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
