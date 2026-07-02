import { useMemo, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  Users,
  Building2,
  DollarSign,
  Calendar,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";
import { useAdminData } from "../../hooks/useAdminData";
import type { AdminBooking } from "../../hooks/useAdminData";
import type { Workspace } from "../../lib/database.types";
import { AddWorkspaceDialog } from "../components/AddWorkspaceDialog";
import { EditWorkspaceDialog } from "../components/EditWorkspaceDialog";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "../components/ui/sidebar";

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444'];
const TYPE_LABELS: Record<string, string> = {
  coworking: "Coworking", "meeting-room": "Meeting Rooms",
  "private-office": "Private Offices", desk: "Desks",
};

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [bookingFilter, setBookingFilter] = useState<"all" | "upcoming" | "completed">("all");
  const {
    workspaces, bookings, profiles, loading,
    createWorkspace, updateWorkspace, deleteWorkspace, updateBookingStatus,
  } = useAdminData();
  const filteredBookings = bookingFilter === "all" ? bookings : bookings.filter(b => b.status === bookingFilter);

  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [viewingBooking, setViewingBooking] = useState<AdminBooking | null>(null);

  const handleDeleteWorkspace = async (workspace: Workspace) => {
    const { error } = await deleteWorkspace(workspace.id);
    if (error) toast.error("Failed to delete workspace", { description: error });
    else toast.success("Workspace deleted");
  };

  const handleCancelBooking = async (booking: AdminBooking) => {
    const { error } = await updateBookingStatus(booking.id, "cancelled");
    if (error) toast.error("Failed to cancel booking", { description: error });
    else toast.success("Booking cancelled");
  };

  const handleContactUser = (booking: AdminBooking) => {
    if (!booking.user?.email) {
      toast.error("No email on file for this user");
      return;
    }
    const subject = encodeURIComponent(`Regarding your booking at ${booking.workspace?.name ?? "CoWorkHub"}`);
    window.location.href = `mailto:${booking.user.email}?subject=${subject}`;
  };

  const stats = useMemo(() => {
    const activeUserIds = new Set(bookings.map(b => b.user_id));
    const revenue = bookings
      .filter(b => b.status !== "cancelled")
      .reduce((sum, b) => sum + Number(b.total_price), 0);

    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleDateString("en-US", { month: "short" }) };
    });
    const bookingTrend = months.map(({ year, month, label }) => ({
      month: label,
      bookings: bookings.filter(b => { const bd = new Date(b.date); return bd.getFullYear() === year && bd.getMonth() === month; }).length,
      revenue: bookings.filter(b => { const bd = new Date(b.date); return bd.getFullYear() === year && bd.getMonth() === month && b.status !== "cancelled"; })
        .reduce((sum, b) => sum + Number(b.total_price), 0),
    }));

    const typeCounts = workspaces.reduce<Record<string, number>>((acc, w) => { acc[w.type] = (acc[w.type] ?? 0) + 1; return acc; }, {});
    const workspaceTypes = Object.entries(typeCounts).map(([type, value]) => ({ name: TYPE_LABELS[type] ?? type, value }));

    const pctChange = (curr: number, prev: number) => prev === 0 ? null : ((curr - prev) / prev) * 100;
    const bookingsDelta = pctChange(bookingTrend[5].bookings, bookingTrend[4].bookings);
    const revenueDelta  = pctChange(bookingTrend[5].revenue,  bookingTrend[4].revenue);

    const newWorkspacesThisMonth = workspaces.filter(w => {
      const c = new Date(w.created_at);
      return c.getFullYear() === now.getFullYear() && c.getMonth() === now.getMonth();
    }).length;
    const newUsersThisMonth = profiles.filter(p => {
      const c = new Date(p.created_at);
      return c.getFullYear() === now.getFullYear() && c.getMonth() === now.getMonth();
    }).length;

    const bookingCountByUser = bookings.reduce<Record<string, number>>((acc, b) => { acc[b.user_id] = (acc[b.user_id] ?? 0) + 1; return acc; }, {});

    return {
      totalBookings: bookings.length,
      totalWorkspaces: workspaces.length,
      totalUsers: profiles.length,
      activeUsers: activeUserIds.size,
      revenue,
      bookingTrend,
      workspaceTypes,
      bookingsDelta,
      revenueDelta,
      newWorkspacesThisMonth,
      newUsersThisMonth,
      bookingCountByUser,
    };
  }, [workspaces, bookings, profiles]);

  const fmtDelta = (v: number | null) => v === null ? "so far" : `${v >= 0 ? "+" : ""}${v.toFixed(1)}% from last month`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <SidebarProvider>
        <div className="flex flex-1">
          {/* Admin Sidebar */}
          <Sidebar>
            <SidebarHeader className="border-b p-4">
              <h3>Admin Panel</h3>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("overview")}
                    isActive={activeTab === "overview"}
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("workspaces")}
                    isActive={activeTab === "workspaces"}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Workspaces</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("bookings")}
                    isActive={activeTab === "bookings"}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Bookings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("users")}
                    isActive={activeTab === "users"}
                  >
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          {/* Main Content */}
          <SidebarInset className="flex-1">
            <div className="p-8">
              <div className="mb-8">
                <h1 className="mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Monitor and manage your coworking platform</p>
              </div>

              {activeTab === "overview" && (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm">Total Bookings</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-semibold">{stats.totalBookings}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-secondary">{fmtDelta(stats.bookingsDelta)}</span>
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-semibold">{stats.activeUsers}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-secondary">{stats.totalUsers}</span> total registered
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm">Total Workspaces</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-semibold">{stats.totalWorkspaces}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-secondary">+{stats.newWorkspacesThisMonth}</span> new this month
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm">Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-semibold">${stats.revenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-secondary">{fmtDelta(stats.revenueDelta)}</span>
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Booking Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={stats.bookingTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="bookings"
                              stroke="#2563EB"
                              strokeWidth={2}
                              name="Bookings"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Workspace Types</CardTitle>
                      </CardHeader>
                      <CardContent className="flex justify-center">
                        {stats.workspaceTypes.length === 0 ? (
                          <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">No workspaces yet</div>
                        ) : (
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={stats.workspaceTypes}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {stats.workspaceTypes.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Monthly Revenue Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.bookingTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="bookings" fill="#10B981" name="Total Bookings" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              )}

              {activeTab === "workspaces" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Workspace Management</CardTitle>
                    <AddWorkspaceDialog onCreate={createWorkspace} />
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Price/Day</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workspaces.length === 0 && !loading && (
                          <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No workspaces yet</TableCell></TableRow>
                        )}
                        {workspaces.map((workspace) => (
                          <TableRow key={workspace.id}>
                            <TableCell className="font-medium">{workspace.name}</TableCell>
                            <TableCell>{workspace.location}</TableCell>
                            <TableCell className="capitalize">
                              {workspace.type.replace('-', ' ')}
                            </TableCell>
                            <TableCell>{workspace.capacity}</TableCell>
                            <TableCell>${workspace.price_per_day}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <span>{workspace.rating}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({workspace.reviews})
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={workspace.available ? "default" : "secondary"}>
                                {workspace.available ? "Available" : "Unavailable"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setEditingWorkspace(workspace)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        className="text-destructive"
                                        onSelect={(e) => e.preventDefault()}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently remove "{workspace.name}". This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteWorkspace(workspace)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {activeTab === "bookings" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Booking Management</CardTitle>
                    <Tabs value={bookingFilter} onValueChange={v => setBookingFilter(v as typeof bookingFilter)}>
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Workspace</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Seats</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.length === 0 && !loading && (
                          <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No bookings</TableCell></TableRow>
                        )}
                        {filteredBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.id.slice(0, 8)}</TableCell>
                            <TableCell>{booking.workspace?.name ?? "—"}</TableCell>
                            <TableCell>{booking.user?.name || booking.user?.email || "—"}</TableCell>
                            <TableCell>
                              {new Date(booking.date).toLocaleDateString()}
                              {booking.end_date && booking.end_date !== booking.date && ` – ${new Date(booking.end_date).toLocaleDateString()}`}
                            </TableCell>
                            <TableCell>{booking.start_time} - {booking.end_time}</TableCell>
                            <TableCell>{booking.seats}</TableCell>
                            <TableCell>${booking.total_price}</TableCell>
                            <TableCell>
                              <Badge variant={
                                booking.status === 'upcoming' ? 'default' :
                                booking.status === 'completed' ? 'secondary' :
                                'outline'
                              }>
                                {booking.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setViewingBooking(booking)}>
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleContactUser(booking)}>
                                      Contact User
                                    </DropdownMenuItem>
                                    {booking.status === 'upcoming' && (
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                          className="text-destructive"
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          Cancel Booking
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will mark the booking as cancelled. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Back</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleCancelBooking(booking)}>
                                      Cancel Booking
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {activeTab === "users" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>User Management</CardTitle>
                    <Badge variant="outline">{stats.totalUsers} total</Badge>
                  </CardHeader>
                  <CardContent>
                    {profiles.length === 0 && !loading ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4" />
                        <p>No users yet</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Bookings</TableHead>
                            <TableHead>Joined</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {profiles.map((p) => (
                            <TableRow key={p.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-7 w-7">
                                    <AvatarImage src={p.avatar_url ?? undefined} />
                                    <AvatarFallback>{p.name?.charAt(0)?.toUpperCase() ?? "?"}</AvatarFallback>
                                  </Avatar>
                                  {p.name || "—"}
                                </div>
                              </TableCell>
                              <TableCell>{p.email ?? "—"}</TableCell>
                              <TableCell>
                                <Badge variant={p.role === "admin" ? "default" : "secondary"} className="capitalize">{p.role}</Badge>
                              </TableCell>
                              <TableCell>{stats.bookingCountByUser[p.id] ?? 0}</TableCell>
                              <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <EditWorkspaceDialog
        workspace={editingWorkspace}
        open={!!editingWorkspace}
        onOpenChange={(o) => !o && setEditingWorkspace(null)}
        onSave={updateWorkspace}
      />

      <Dialog open={!!viewingBooking} onOpenChange={(o) => !o && setViewingBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>{viewingBooking?.id}</DialogDescription>
          </DialogHeader>
          {viewingBooking && (
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Workspace:</span> {viewingBooking.workspace?.name ?? "—"}</div>
              <div><span className="text-muted-foreground">Customer:</span> {viewingBooking.user?.name || viewingBooking.user?.email || "—"}</div>
              <div><span className="text-muted-foreground">Email:</span> {viewingBooking.user?.email ?? "—"}</div>
              <div>
                <span className="text-muted-foreground">Date:</span> {new Date(viewingBooking.date).toLocaleDateString()}
                {viewingBooking.end_date && viewingBooking.end_date !== viewingBooking.date && ` – ${new Date(viewingBooking.end_date).toLocaleDateString()}`}
              </div>
              <div><span className="text-muted-foreground">Time:</span> {viewingBooking.start_time} - {viewingBooking.end_time}</div>
              <div><span className="text-muted-foreground">Seats:</span> {viewingBooking.seats}</div>
              <div><span className="text-muted-foreground">Total:</span> ${viewingBooking.total_price}</div>
              <div><span className="text-muted-foreground">Status:</span> {viewingBooking.status}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}