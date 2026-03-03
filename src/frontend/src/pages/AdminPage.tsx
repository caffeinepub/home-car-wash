import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AppointmentStatus,
  type WashAppointment,
  WashType,
  useAllAppointments,
  useUpdateAppointmentStatus,
} from "@/hooks/useQueries";
import {
  AlertTriangle,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const washTypeLabel: Record<WashType, string> = {
  [WashType.basic]: "Basic",
  [WashType.standard]: "Standard",
  [WashType.premium]: "Premium",
};

const washTypePrices: Record<WashType, string> = {
  [WashType.basic]: "$15",
  [WashType.standard]: "$30",
  [WashType.premium]: "$55",
};

function StatusBadge({ status }: { status: AppointmentStatus }) {
  if (status === AppointmentStatus.pending) {
    return (
      <span className="badge-pending text-xs font-semibold px-2.5 py-1 rounded-full">
        Pending
      </span>
    );
  }
  if (status === AppointmentStatus.completed) {
    return (
      <span className="badge-completed text-xs font-semibold px-2.5 py-1 rounded-full">
        Completed
      </span>
    );
  }
  return (
    <span className="badge-cancelled text-xs font-semibold px-2.5 py-1 rounded-full">
      Cancelled
    </span>
  );
}

function AdminAppointmentRow({
  appointment,
  index,
}: {
  appointment: WashAppointment;
  index: number;
}) {
  const updateStatus = useUpdateAppointmentStatus();

  const handleMarkComplete = async () => {
    try {
      await updateStatus.mutateAsync({
        id: appointment.id,
        status: AppointmentStatus.completed,
      });
      toast.success("Appointment marked as completed.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid={`admin.appointments.item.${index}`}
      className="border-b border-border/30 hover:bg-muted/10 transition-colors group"
    >
      {/* ID */}
      <td className="px-4 py-3.5 text-sm">
        <span className="font-mono text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
          #{appointment.id.toString()}
        </span>
      </td>

      {/* Vehicle / Owner */}
      <td className="px-4 py-3.5">
        <div className="text-sm font-medium text-foreground">
          Vehicle #{appointment.vehicleId.toString()}
        </div>
        <div className="text-xs text-muted-foreground truncate max-w-[120px]">
          {appointment.owner.toString().slice(0, 12)}...
        </div>
      </td>

      {/* Wash Type */}
      <td className="px-4 py-3.5">
        <span className="text-sm">
          <span className="font-medium">
            {washTypeLabel[appointment.washType]}
          </span>
          <span className="text-muted-foreground ml-1">
            {washTypePrices[appointment.washType]}
          </span>
        </span>
      </td>

      {/* Date / Time */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {appointment.scheduledDate}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
          <Clock className="w-3 h-3" />
          {appointment.scheduledTime}
        </div>
      </td>

      {/* Address */}
      <td className="px-4 py-3.5 max-w-[160px]">
        <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span className="truncate">{appointment.address}</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <StatusBadge status={appointment.status} />
      </td>

      {/* Action */}
      <td className="px-4 py-3.5">
        {appointment.status === AppointmentStatus.pending && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkComplete}
            disabled={updateStatus.isPending}
            data-ocid={`admin.appointments.complete.button.${index}`}
            className="border-wash-success/30 text-wash-success hover:bg-wash-success/10 hover:border-wash-success/50 text-xs h-8 opacity-0 group-hover:opacity-100 transition-all"
          >
            {updateStatus.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Complete
              </>
            )}
          </Button>
        )}
      </td>
    </motion.tr>
  );
}

export function AdminPage() {
  const { data: appointments, isLoading } = useAllAppointments();

  const totalCount = appointments?.length ?? 0;
  const pendingCount =
    appointments?.filter((a) => a.status === AppointmentStatus.pending)
      .length ?? 0;
  const completedCount =
    appointments?.filter((a) => a.status === AppointmentStatus.completed)
      .length ?? 0;
  const cancelledCount =
    appointments?.filter((a) => a.status === AppointmentStatus.cancelled)
      .length ?? 0;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Panel</span>
            </div>
            <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage all customer appointments and service status.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total",
                value: totalCount,
                icon: Car,
                color: "text-primary bg-primary/10",
              },
              {
                label: "Pending",
                value: pendingCount,
                icon: Clock,
                color: "text-wash-warning bg-wash-warning/10",
              },
              {
                label: "Completed",
                value: completedCount,
                icon: CheckCircle2,
                color: "text-wash-success bg-wash-success/10",
              },
              {
                label: "Cancelled",
                value: cancelledCount,
                icon: AlertTriangle,
                color: "text-destructive bg-destructive/10",
              },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="stat-card-gradient border-border/40 shadow-card">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}
                      >
                        <s.icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="font-display text-3xl font-bold">
                      {s.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {s.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* All Appointments Table */}
          <Card className="stat-card-gradient border-border/40 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                All Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div
                  className="p-6 space-y-3"
                  data-ocid="admin.appointments.loading_state"
                >
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 rounded-lg bg-muted/30" />
                  ))}
                </div>
              ) : appointments && appointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30 bg-muted/10">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Vehicle / Owner
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Service
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Scheduled
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Address
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt, i) => (
                        <AdminAppointmentRow
                          key={appt.id.toString()}
                          appointment={appt}
                          index={i + 1}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div
                  className="text-center py-16"
                  data-ocid="admin.appointments.empty_state"
                >
                  <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                    <Car className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    No appointments yet
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    All customer bookings will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
