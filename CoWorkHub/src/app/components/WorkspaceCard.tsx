import { Link } from "react-router";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Users, Star, ArrowRight } from "lucide-react";
import { Workspace } from "../data/mockData";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface WorkspaceCardProps {
  workspace: Workspace;
}

const TYPE_LABELS: Record<string, string> = {
  coworking: 'Coworking',
  'meeting-room': 'Meeting Room',
  'private-office': 'Private Office',
  desk: 'Desk',
};

const TYPE_COLORS: Record<string, string> = {
  coworking: '#3B82F6',
  'meeting-room': '#10B981',
  'private-office': '#8B5CF6',
  desk: '#F59E0B',
};

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const accentColor = TYPE_COLORS[workspace.type] ?? '#3B82F6';

  return (
    <div
      className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.1)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: '220px' }}>
        <ImageWithFallback
          src={workspace.image}
          alt={workspace.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 50%)' }} />

        {/* Type badge */}
        <Badge
          className="absolute top-3 left-3 text-xs px-3 py-1 border-0 font-medium"
          style={{ background: `${accentColor}25`, color: accentColor, backdropFilter: 'blur(8px)' }}
        >
          {TYPE_LABELS[workspace.type]}
        </Badge>

        {/* Available dot */}
        {workspace.available && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: 'rgba(16,185,129,0.15)', backdropFilter: 'blur(8px)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs" style={{ color: '#10B981' }}>Available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white mb-1.5" style={{ fontWeight: 600, fontSize: '1.05rem' }}>{workspace.name}</h3>

        <div className="flex items-center gap-1 text-sm mb-4" style={{ color: '#64748B' }}>
          <MapPin className="h-3.5 w-3.5" />
          {workspace.location}
        </div>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-white">{workspace.rating}</span>
            <span className="text-sm" style={{ color: '#475569' }}>({workspace.reviews})</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm" style={{ color: '#64748B' }}>
            <Users className="h-3.5 w-3.5" />
            Up to {workspace.capacity}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-2xl text-white" style={{ fontWeight: 700, color: accentColor }}>${workspace.pricePerDay}</span>
            <span className="text-sm ml-1" style={{ color: '#64748B' }}>/day</span>
          </div>
          <Link to={`/workspace/${workspace.id}`}>
            <Button
              size="sm"
              className="gap-1.5 rounded-xl"
              style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}35`, fontWeight: 600 }}
            >
              View <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
