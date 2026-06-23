export interface Workspace {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerDay: number;
  capacity: number;
  rating: number;
  reviews: number;
  type: 'desk' | 'meeting-room' | 'private-office' | 'coworking';
  image: string;
  images: string[];
  amenities: string[];
  available: boolean;
}

export interface Booking {
  id: string;
  workspaceId: string;
  workspaceName: string;
  workspaceImage: string;
  date: string;
  startTime: string;
  endTime: string;
  seats: number;
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
}

export const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'Downtown Tech Hub',
    location: 'San Francisco, CA',
    description: 'Modern coworking space in the heart of downtown. Features high-speed internet, ergonomic furniture, and a vibrant community of professionals.',
    pricePerDay: 45,
    capacity: 50,
    rating: 4.8,
    reviews: 127,
    type: 'coworking',
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGludGVyaW9yfGVufDF8fHx8MTc4MTE4ODk5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGludGVyaW9yfGVufDF8fHx8MTc4MTE4ODk5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBvZmZpY2UlMjB3b3Jrc3BhY2UlMjBkZXNrfGVufDF8fHx8MTc4MTM4NDY4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMHN0YXJ0dXAlMjBvZmZpY2V8ZW58MXx8fHwxNzgxMzg0NjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    amenities: ['High-Speed WiFi', 'Coffee & Tea', 'Phone Booths', 'Printing', 'Meeting Rooms', '24/7 Access'],
    available: true,
  },
  {
    id: '2',
    name: 'Executive Meeting Room',
    location: 'New York, NY',
    description: 'Professional meeting room with state-of-the-art video conferencing equipment. Perfect for client presentations and team meetings.',
    pricePerDay: 120,
    capacity: 12,
    rating: 4.9,
    reviews: 89,
    type: 'meeting-room',
    image: 'https://images.unsplash.com/photo-1628062699790-7c45262b82b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWV0aW5nJTIwcm9vbSUyMGNvbmZlcmVuY2UlMjB0YWJsZXxlbnwxfHx8fDE3ODEzODQ2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1628062699790-7c45262b82b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWV0aW5nJTIwcm9vbSUyMGNvbmZlcmVuY2UlMjB0YWJsZXxlbnwxfHx8fDE3ODEzODQ2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    amenities: ['Video Conferencing', 'Whiteboard', 'Projector', 'High-Speed WiFi', 'Coffee & Tea', 'Catering Available'],
    available: true,
  },
  {
    id: '3',
    name: 'Creative Studio Office',
    location: 'Austin, TX',
    description: 'Bright and inspiring workspace designed for creative teams. Features natural light, flexible layouts, and collaborative areas.',
    pricePerDay: 75,
    capacity: 8,
    rating: 4.7,
    reviews: 64,
    type: 'private-office',
    image: 'https://images.unsplash.com/photo-1715593949273-09009558300a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwb2ZmaWNlJTIwY29udGVtcG9yYXJ5JTIwZGVzaWdufGVufDF8fHx8MTc4MTM4NDY4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1715593949273-09009558300a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwb2ZmaWNlJTIwY29udGVtcG9yYXJ5JTIwZGVzaWdufGVufDF8fHx8MTc4MTM4NDY4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMHN0YXJ0dXAlMjBvZmZpY2V8ZW58MXx8fHwxNzgxMzg0NjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    amenities: ['Private Space', 'High-Speed WiFi', 'Kitchen Access', 'Meeting Room', 'Storage', 'Parking'],
    available: true,
  },
  {
    id: '4',
    name: 'Minimalist Desk Space',
    location: 'Seattle, WA',
    description: 'Clean and simple dedicated desk in a quiet professional environment. Ideal for focused work and productivity.',
    pricePerDay: 35,
    capacity: 1,
    rating: 4.6,
    reviews: 52,
    type: 'desk',
    image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZGVzayUyMHNldHVwJTIwd29ya3NwYWNlfGVufDF8fHx8MTc4MTM4NDY4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZGVzayUyMHNldHVwJTIwd29ya3NwYWNlfGVufDF8fHx8MTc4MTM4NDY4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    amenities: ['Dedicated Desk', 'High-Speed WiFi', 'Coffee & Tea', 'Locker', 'Quiet Zone'],
    available: true,
  },
  {
    id: '5',
    name: 'Startup Innovation Lab',
    location: 'Boston, MA',
    description: 'Dynamic workspace designed for growing startups. Includes collaboration areas, private offices, and networking opportunities.',
    pricePerDay: 55,
    capacity: 30,
    rating: 4.8,
    reviews: 98,
    type: 'coworking',
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBvZmZpY2UlMjB3b3Jrc3BhY2UlMjBkZXNrfGVufDF8fHx8MTc4MTM4NDY4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBvZmZpY2UlMjB3b3Jrc3BhY2UlMjBkZXNrfGVufDF8fHx8MTc4MTM4NDY4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    amenities: ['High-Speed WiFi', 'Event Space', 'Mentorship Programs', 'Networking Events', 'Kitchen', 'Showers'],
    available: true,
  },
  {
    id: '6',
    name: 'Luxury Private Suite',
    location: 'Los Angeles, CA',
    description: 'Premium private office suite with modern amenities and stunning city views. Perfect for established businesses.',
    pricePerDay: 150,
    capacity: 6,
    rating: 5.0,
    reviews: 45,
    type: 'private-office',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMHN0YXJ0dXAlMjBvZmZpY2V8ZW58MXx8fHwxNzgxMzg0NjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMHN0YXJ0dXAlMjBvZmZpY2V8ZW58MXx8fHwxNzgxMzg0NjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    amenities: ['Private Suite', 'Concierge Service', 'Premium Furniture', 'City Views', 'Kitchen', 'Parking', '24/7 Access'],
    available: true,
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    workspaceId: '1',
    workspaceName: 'Downtown Tech Hub',
    workspaceImage: mockWorkspaces[0].image,
    date: '2026-06-18',
    startTime: '09:00',
    endTime: '17:00',
    seats: 1,
    totalPrice: 45,
    status: 'upcoming',
  },
  {
    id: 'b2',
    workspaceId: '2',
    workspaceName: 'Executive Meeting Room',
    workspaceImage: mockWorkspaces[1].image,
    date: '2026-06-20',
    startTime: '14:00',
    endTime: '16:00',
    seats: 8,
    totalPrice: 120,
    status: 'upcoming',
  },
  {
    id: 'b3',
    workspaceId: '3',
    workspaceName: 'Creative Studio Office',
    workspaceImage: mockWorkspaces[2].image,
    date: '2026-06-05',
    startTime: '09:00',
    endTime: '17:00',
    seats: 5,
    totalPrice: 75,
    status: 'completed',
  },
];

export const mockUser: User = {
  id: 'u1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  memberSince: 'January 2025',
};

export const adminStats = {
  totalBookings: 1247,
  activeUsers: 532,
  totalWorkspaces: 48,
  revenue: 89450,
  bookingTrend: [
    { month: 'Jan', bookings: 145 },
    { month: 'Feb', bookings: 178 },
    { month: 'Mar', bookings: 203 },
    { month: 'Apr', bookings: 234 },
    { month: 'May', bookings: 267 },
    { month: 'Jun', bookings: 220 },
  ],
  workspaceTypes: [
    { name: 'Coworking', value: 45 },
    { name: 'Meeting Rooms', value: 25 },
    { name: 'Private Offices', value: 20 },
    { name: 'Desks', value: 10 },
  ],
};
