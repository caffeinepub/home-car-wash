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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AppointmentStatus,
  type WashAppointment,
  WashType,
  useCancelAppointment,
  useMyPastAppointments,
  useMyUpcomingAppointments,
  useMyVehicles,
} from "@/hooks/useQueries";
import {
  Calendar,
  CalendarCheck,
  Car,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Sparkles,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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

interface AppointmentCardProps {
  appointment: WashAppointment;
  index: number;
  vehicleLabel: string;
  showCancel?: boolean;
}

function AppointmentCard({
  appointment,
  index,
  vehicleLabel,
  showCancel,
}: AppointmentCardProps) {
  const cancelAppointment = useCancelAppointment();

  const handleCancel = async () => {
    try {
      await cancelAppointment.mutateAsync(appointment.id);
      toast.success("Appointment cancelled.");
    } catch {
      toast.error("Failed to cancel. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      data-ocid={`appointments.item.${index}`}
      className="glass-card rounded-xl p-5 hover:border-primary/20 transition-all shadow-card"
    >
      {/* Top Row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Car className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-foreground truncate">
              {vehicleLabel}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium text-muted-foreground bg-muted/30 px-2 py-0.5 rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {washTypeLabel[appointment.washType]} •{" "}
                {washTypePrices[appointment.washType]}
              </span>
            </div>
          </div>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary/70 shrink-0" />
          <span>{appointment.scheduledDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-primary/70 shrink-0" />
          <span>{appointment.scheduledTime}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground sm:col-span-2">
          <MapPin className="w-4 h-4 text-primary/70 shrink-0" />
          <span className="truncate">{appointment.address}</span>
        </div>
      </div>

      {/* Cancel Button */}
      {showCancel && appointment.status === AppointmentStatus.pending && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              data-ocid={`appointments.cancel.open_modal_button.${index}`}
              className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-all"
              disabled={cancelAppointment.isPending}
            >
              {cancelAppointment.isPending ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <XCircle className="w-3.5 h-3.5 mr-1.5" />
              )}
              Cancel Appointment
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent
            className="bg-popover border-border/60"
            data-ocid={`appointments.cancel.dialog.${index}`}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display">
                Cancel Appointment?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Cancel your{" "}
                <strong className="text-foreground">
                  {washTypeLabel[appointment.washType]}
                </strong>{" "}
                wash scheduled for{" "}
                <strong className="text-foreground">
                  {appointment.scheduledDate} at {appointment.scheduledTime}
                </strong>
                ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="border-border/60 hover:bg-muted/30"
                data-ocid={`appointments.cancel.cancel_button.${index}`}
              >
                Keep Appointment
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancel}
                className="bg-destructive text-destructive-foreground hover:opacity-90"
                data-ocid={`appointments.cancel.confirm_button.${index}`}
              >
                Cancel Appointment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {appointment.status === AppointmentStatus.completed && (
        <div className="flex items-center gap-1.5 text-xs text-wash-success">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Service completed</span>
        </div>
      )}
    </motion.div>
  );
}

interface AppointmentsPageProps {
  onNavigate: (page: string) => void;
}

export function AppointmentsPage({ onNavigate }: AppointmentsPageProps) {
  const { data: upcoming, isLoading: upcomingLoading } =
    useMyUpcomingAppointments();
  const { data: past, isLoading: pastLoading } = useMyPastAppointments();
  const { data: vehicles } = useMyVehicles();

  const getVehicleLabel = (vehicleId: bigint) => {
    const v = vehicles?.find((v) => v.id === vehicleId);
    return v
      ? `${v.make} ${v.model} • ${v.licensePlate}`
      : `Vehicle #${vehicleId}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                <CalendarCheck className="w-4 h-4" />
                <span>Appointments</span>
              </div>
              <h1 className="font-display text-3xl font-bold">
                My Appointments
              </h1>
              <p className="text-muted-foreground mt-1">
                Track all your car wash bookings.
              </p>
            </div>
            <Button
              onClick={() => onNavigate("book")}
              data-ocid="appointments.book.primary_button"
              className="bg-primary text-primary-foreground hover:opacity-90 glow-cyan-sm shrink-0"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Book Wash
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="w-full bg-muted/20 border border-border/40 mb-6 p-1 h-auto rounded-xl">
              <TabsTrigger
                value="upcoming"
                data-ocid="appointments.upcoming.tab"
                className="flex-1 py-2.5 rounded-lg data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-none text-muted-foreground transition-all"
              >
                <CalendarCheck className="w-4 h-4 mr-2" />
                Upcoming
                {!upcomingLoading && upcoming && upcoming.length > 0 && (
                  <span className="ml-2 bg-primary/20 text-primary text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {upcoming.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="past"
                data-ocid="appointments.past.tab"
                className="flex-1 py-2.5 rounded-lg data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-none text-muted-foreground transition-all"
              >
                <Clock className="w-4 h-4 mr-2" />
                Past
                {!pastLoading && past && past.length > 0 && (
                  <span className="ml-2 bg-muted/40 text-muted-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {past.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Upcoming */}
            <TabsContent value="upcoming">
              {upcomingLoading ? (
                <div
                  className="space-y-4"
                  data-ocid="appointments.upcoming.loading_state"
                >
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-40 rounded-xl bg-muted/30" />
                  ))}
                </div>
              ) : upcoming && upcoming.length > 0 ? (
                <AnimatePresence>
                  <div className="space-y-4">
                    {upcoming.map((appt, i) => (
                      <AppointmentCard
                        key={appt.id.toString()}
                        appointment={appt}
                        index={i + 1}
                        vehicleLabel={getVehicleLabel(appt.vehicleId)}
                        showCancel
                      />
                    ))}
                  </div>
                </AnimatePresence>
              ) : (
                <div
                  className="text-center py-16 glass-card rounded-2xl"
                  data-ocid="appointments.upcoming.empty_state"
                >
                  <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                    <CalendarCheck className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                    Ready for a freshly washed car? Book your next service now.
                  </p>
                  <Button
                    onClick={() => onNavigate("book")}
                    data-ocid="appointments.empty.book.button"
                    className="bg-primary text-primary-foreground hover:opacity-90"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Book a Wash
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Past */}
            <TabsContent value="past">
              {pastLoading ? (
                <div
                  className="space-y-4"
                  data-ocid="appointments.past.loading_state"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-36 rounded-xl bg-muted/30" />
                  ))}
                </div>
              ) : past && past.length > 0 ? (
                <AnimatePresence>
                  <div className="space-y-4">
                    {past.map((appt, i) => (
                      <AppointmentCard
                        key={appt.id.toString()}
                        appointment={appt}
                        index={i + 1}
                        vehicleLabel={getVehicleLabel(appt.vehicleId)}
                        showCancel={false}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              ) : (
                <div
                  className="text-center py-16 glass-card rounded-2xl"
                  data-ocid="appointments.past.empty_state"
                >
                  <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    No past appointments
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Your completed and cancelled appointments will appear here.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
