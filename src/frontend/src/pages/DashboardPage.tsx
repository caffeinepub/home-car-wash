import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AppointmentStatus,
  WashType,
  useMyUpcomingAppointments,
  useMyVehicles,
  useWashStats,
} from "@/hooks/useQueries";
import {
  ArrowRight,
  CalendarCheck,
  Car,
  CheckCircle2,
  Clock,
  Droplets,
  LayoutDashboard,
  MapPin,
  Sparkles,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

const washTypeLabel: Record<WashType, string> = {
  [WashType.basic]: "Basic",
  [WashType.standard]: "Standard",
  [WashType.premium]: "Premium",
};

const washTypeColors: Record<WashType, string> = {
  [WashType.basic]: "text-muted-foreground border-border/40 bg-muted/20",
  [WashType.standard]: "text-primary border-primary/30 bg-primary/10",
  [WashType.premium]:
    "text-wash-warning border-wash-warning/30 bg-wash-warning/10",
};

function StatusBadge({ status }: { status: AppointmentStatus }) {
  if (status === AppointmentStatus.pending) {
    return (
      <span className="badge-pending text-xs font-medium px-2 py-0.5 rounded-full">
        Pending
      </span>
    );
  }
  if (status === AppointmentStatus.completed) {
    return (
      <span className="badge-completed text-xs font-medium px-2 py-0.5 rounded-full">
        Completed
      </span>
    );
  }
  return (
    <span className="badge-cancelled text-xs font-medium px-2 py-0.5 rounded-full">
      Cancelled
    </span>
  );
}

const statConfig = [
  {
    label: "Total Washes",
    key: "totalWashes" as const,
    icon: Droplets,
    color: "text-primary bg-primary/10",
    desc: "All time",
  },
  {
    label: "Upcoming",
    key: "upcomingWashes" as const,
    icon: CalendarCheck,
    color: "text-accent bg-accent/10",
    desc: "Scheduled",
  },
  {
    label: "Completed",
    key: "completedWashes" as const,
    icon: CheckCircle2,
    color: "text-wash-success bg-wash-success/10",
    desc: "Done",
  },
  {
    label: "Cancelled",
    key: "cancelledWashes" as const,
    icon: XCircle,
    color: "text-destructive bg-destructive/10",
    desc: "Cancelled",
  },
];

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { data: stats, isLoading: statsLoading } = useWashStats();
  const { data: upcoming, isLoading: upcomingLoading } =
    useMyUpcomingAppointments();
  const { data: vehicles } = useMyVehicles();

  const nextAppointment = upcoming?.[0];

  const getVehicleLabel = (vehicleId: bigint) => {
    const v = vehicles?.find((v) => v.id === vehicleId);
    return v
      ? `${v.make} ${v.model} • ${v.licensePlate}`
      : `Vehicle #${vehicleId}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">Welcome back!</h1>
              <p className="text-muted-foreground mt-1">
                Here's an overview of your car wash activity.
              </p>
            </div>
            <Button
              onClick={() => onNavigate("book")}
              data-ocid="dashboard.book.primary_button"
              className="bg-primary text-primary-foreground hover:opacity-90 glow-cyan-sm shrink-0"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Book a Wash
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statConfig.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="stat-card-gradient border-border/40 shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}
                    >
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {stat.desc}
                    </span>
                  </div>
                  {statsLoading ? (
                    <Skeleton
                      className="h-8 w-12 bg-muted/40"
                      data-ocid="dashboard.stats.loading_state"
                    />
                  ) : (
                    <div className="font-display text-3xl font-bold text-foreground">
                      {Number(stats?.[stat.key] ?? 0)}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Next Appointment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="stat-card-gradient border-border/40 shadow-card h-full">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-primary" />
                  Next Appointment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingLoading ? (
                  <div
                    className="space-y-3"
                    data-ocid="dashboard.upcoming.loading_state"
                  >
                    <Skeleton className="h-4 w-full bg-muted/40" />
                    <Skeleton className="h-4 w-3/4 bg-muted/40" />
                    <Skeleton className="h-4 w-1/2 bg-muted/40" />
                  </div>
                ) : nextAppointment ? (
                  <div className="bg-primary/5 border border-primary/15 rounded-xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <StatusBadge status={nextAppointment.status} />
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${washTypeColors[nextAppointment.washType]}`}
                          >
                            {washTypeLabel[nextAppointment.washType]}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground">
                          {getVehicleLabel(nextAppointment.vehicleId)}
                        </h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>
                          {nextAppointment.scheduledDate} at{" "}
                          {nextAppointment.scheduledTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="truncate">
                          {nextAppointment.address}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 border-border/60 hover:bg-muted/30"
                      onClick={() => onNavigate("appointments")}
                      data-ocid="dashboard.view_appointments.button"
                    >
                      View All Appointments
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="text-center py-8"
                    data-ocid="dashboard.upcoming.empty_state"
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mx-auto mb-3">
                      <CalendarCheck className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      No upcoming appointments
                    </p>
                    <Button
                      size="sm"
                      onClick={() => onNavigate("book")}
                      data-ocid="dashboard.empty.book.button"
                      className="bg-primary text-primary-foreground hover:opacity-90"
                    >
                      Book Your First Wash
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="stat-card-gradient border-border/40 shadow-card h-full">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  type="button"
                  onClick={() => onNavigate("book")}
                  data-ocid="dashboard.quickaction.book.button"
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 hover:border-primary/30 transition-all text-left group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Book a Wash
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Schedule service
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate("vehicles")}
                  data-ocid="dashboard.quickaction.vehicles.button"
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-muted/20 border border-border/40 hover:bg-muted/30 hover:border-border/60 transition-all text-left group"
                >
                  <div className="w-9 h-9 rounded-lg bg-muted/30 flex items-center justify-center group-hover:bg-muted/50 transition-colors shrink-0">
                    <Car className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      My Vehicles
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {vehicles?.length ?? 0} vehicle
                      {vehicles?.length !== 1 ? "s" : ""} saved
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate("appointments")}
                  data-ocid="dashboard.quickaction.appointments.button"
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-muted/20 border border-border/40 hover:bg-muted/30 hover:border-border/60 transition-all text-left group"
                >
                  <div className="w-9 h-9 rounded-lg bg-muted/30 flex items-center justify-center group-hover:bg-muted/50 transition-colors shrink-0">
                    <CalendarCheck className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Appointments
                    </div>
                    <div className="text-xs text-muted-foreground">
                      View all history
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
