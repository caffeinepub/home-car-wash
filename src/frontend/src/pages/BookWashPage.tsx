import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { WashType, useBookWash, useMyVehicles } from "@/hooks/useQueries";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface BookWashPageProps {
  onNavigate: (page: string) => void;
}

type StepId = "vehicle" | "washtype" | "schedule" | "confirm";

const STEPS: { id: StepId; label: string }[] = [
  { id: "vehicle", label: "Vehicle" },
  { id: "washtype", label: "Wash Type" },
  { id: "schedule", label: "Schedule" },
  { id: "confirm", label: "Confirm" },
];

const WASH_PACKAGES = [
  {
    type: WashType.basic,
    name: "Basic",
    price: "$15",
    desc: "Exterior rinse & dry",
    features: ["Exterior pre-rinse", "Hand wash", "Wheel clean", "Hand dry"],
    duration: "45 min",
    color: "border-border/40 hover:border-primary/30",
    selectedColor: "border-primary bg-primary/10",
    badge: null,
  },
  {
    type: WashType.standard,
    name: "Standard",
    price: "$30",
    desc: "Exterior wash + interior vacuum",
    features: [
      "Everything in Basic",
      "Interior vacuum",
      "Dashboard wipe-down",
      "Window clean",
    ],
    duration: "1.5 hrs",
    color: "border-border/40 hover:border-primary/30",
    selectedColor: "border-primary bg-primary/10",
    badge: "Most Popular",
  },
  {
    type: WashType.premium,
    name: "Premium",
    price: "$55",
    desc: "Full detail, wax & deep clean",
    features: [
      "Everything in Standard",
      "Hand wax & polish",
      "Leather conditioning",
      "Engine bay clean",
    ],
    duration: "3 hrs",
    color: "border-border/40 hover:border-wash-warning/30",
    selectedColor: "border-wash-warning bg-wash-warning/10",
    badge: "Best Value",
  },
];

const TODAY = new Date().toISOString().split("T")[0];

export function BookWashPage({ onNavigate }: BookWashPageProps) {
  const { data: vehicles, isLoading: vehiclesLoading } = useMyVehicles();
  const bookWash = useBookWash();

  const [step, setStep] = useState<StepId>("vehicle");
  const [selectedVehicleId, setSelectedVehicleId] = useState<bigint | null>(
    null,
  );
  const [selectedWashType, setSelectedWashType] = useState<WashType | null>(
    null,
  );
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [address, setAddress] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [success, setSuccess] = useState(false);

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const selectedVehicle = vehicles?.find((v) => v.id === selectedVehicleId);
  const selectedPackage = WASH_PACKAGES.find(
    (p) => p.type === selectedWashType,
  );

  const goNext = () => {
    const idx = STEPS.findIndex((s) => s.id === step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].id);
  };

  const goBack = () => {
    const idx = STEPS.findIndex((s) => s.id === step);
    if (idx > 0) setStep(STEPS[idx - 1].id);
  };

  const validateSchedule = () => {
    let valid = true;
    if (!scheduledDate) {
      setDateError("Please select a date");
      valid = false;
    } else {
      setDateError("");
    }
    if (!scheduledTime) {
      setTimeError("Please select a time");
      valid = false;
    } else {
      setTimeError("");
    }
    if (!address.trim()) {
      setAddressError("Please enter an address");
      valid = false;
    } else {
      setAddressError("");
    }
    return valid;
  };

  const handleConfirm = async () => {
    if (
      !selectedVehicleId ||
      !selectedWashType ||
      !scheduledDate ||
      !scheduledTime ||
      !address
    )
      return;
    try {
      await bookWash.mutateAsync({
        vehicleId: selectedVehicleId,
        washType: selectedWashType,
        scheduledDate,
        scheduledTime,
        address: address.trim(),
      });
      setSuccess(true);
      toast.success("Wash booked successfully! 🚗✨");
    } catch {
      toast.error("Failed to book. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-md mx-auto px-4"
          data-ocid="book.success_state"
        >
          <div className="w-20 h-20 rounded-full bg-wash-success/15 flex items-center justify-center mx-auto mb-6 glow-cyan">
            <CheckCircle2 className="w-10 h-10 text-wash-success" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-3">
            Booking Confirmed!
          </h2>
          <p className="text-muted-foreground mb-2">
            Your{" "}
            <strong className="text-foreground">{selectedPackage?.name}</strong>{" "}
            wash has been scheduled for{" "}
            <strong className="text-foreground">
              {scheduledDate} at {scheduledTime}
            </strong>
            .
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            We'll come to <strong className="text-foreground">{address}</strong>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => onNavigate("appointments")}
              data-ocid="book.success.view_appointments.button"
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              View Appointments
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false);
                setStep("vehicle");
                setSelectedVehicleId(null);
                setSelectedWashType(null);
                setScheduledDate("");
                setScheduledTime("");
                setAddress("");
              }}
              data-ocid="book.success.book_another.button"
              className="border-border/60 hover:bg-muted/30"
            >
              Book Another Wash
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Book a Wash</span>
            </div>
            <h1 className="font-display text-3xl font-bold">
              Schedule Your Wash
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete all steps to book your home car wash service.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-0 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div
                  className={`flex items-center gap-2 ${
                    i <= stepIndex ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i < stepIndex
                        ? "bg-primary text-primary-foreground"
                        : i === stepIndex
                          ? "bg-primary/20 text-primary border-2 border-primary"
                          : "bg-muted/30 text-muted-foreground border border-border/40"
                    }`}
                  >
                    {i < stepIndex ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline">
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 transition-all ${
                      i < stepIndex ? "bg-primary" : "bg-border/40"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Steps */}
          <AnimatePresence mode="wait">
            {/* Step 1: Select Vehicle */}
            {step === "vehicle" && (
              <motion.div
                key="vehicle"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="stat-card-gradient border-border/40 shadow-card">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold mb-1">
                      Select Your Vehicle
                    </h2>
                    <p className="text-muted-foreground text-sm mb-5">
                      Choose the vehicle you want washed.
                    </p>

                    {vehiclesLoading ? (
                      <div
                        className="space-y-3"
                        data-ocid="book.vehicles.loading_state"
                      >
                        {[1, 2].map((i) => (
                          <Skeleton
                            key={i}
                            className="h-16 rounded-xl bg-muted/30"
                          />
                        ))}
                      </div>
                    ) : vehicles && vehicles.length > 0 ? (
                      <div className="space-y-3">
                        {vehicles.map((v, i) => (
                          <button
                            type="button"
                            key={v.id.toString()}
                            onClick={() => setSelectedVehicleId(v.id)}
                            data-ocid={`book.vehicle.item.${i + 1}`}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                              selectedVehicleId === v.id
                                ? "border-primary bg-primary/10"
                                : "border-border/40 hover:border-primary/30 hover:bg-muted/20"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                selectedVehicleId === v.id
                                  ? "bg-primary/20"
                                  : "bg-muted/30"
                              }`}
                            >
                              <Car className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground">
                                {v.make} {v.model}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {v.licensePlate}
                              </div>
                            </div>
                            {selectedVehicleId === v.id && (
                              <Check className="w-5 h-5 text-primary shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="text-center py-8"
                        data-ocid="book.vehicles.empty_state"
                      >
                        <Car className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm mb-4">
                          No vehicles added yet.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigate("vehicles")}
                          data-ocid="book.add_vehicle.button"
                          className="border-border/60"
                        >
                          Add a Vehicle First
                        </Button>
                      </div>
                    )}

                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={goNext}
                        disabled={!selectedVehicleId}
                        data-ocid="book.vehicle.next.button"
                        className="bg-primary text-primary-foreground hover:opacity-90"
                      >
                        Next: Wash Type
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Select Wash Type */}
            {step === "washtype" && (
              <motion.div
                key="washtype"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="stat-card-gradient border-border/40 shadow-card">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold mb-1">
                      Choose Wash Type
                    </h2>
                    <p className="text-muted-foreground text-sm mb-5">
                      Select the service level that works for you.
                    </p>

                    <div className="space-y-3">
                      {WASH_PACKAGES.map((pkg, i) => (
                        <button
                          type="button"
                          key={pkg.type}
                          onClick={() => setSelectedWashType(pkg.type)}
                          data-ocid={`book.washtype.item.${i + 1}`}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left relative ${
                            selectedWashType === pkg.type
                              ? pkg.selectedColor
                              : `glass-card ${pkg.color}`
                          }`}
                        >
                          {pkg.badge && (
                            <span className="absolute -top-2.5 right-4 text-xs font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                              {pkg.badge}
                            </span>
                          )}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-display font-bold text-lg">
                                  {pkg.name}
                                </span>
                                <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                                  ~{pkg.duration}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {pkg.desc}
                              </p>
                              <div className="grid grid-cols-2 gap-1">
                                {pkg.features.map((f) => (
                                  <div
                                    key={f}
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                                    {f}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-display text-2xl font-extrabold text-foreground">
                                {pkg.price}
                              </div>
                              {selectedWashType === pkg.type && (
                                <Check className="w-5 h-5 text-primary ml-auto mt-1" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={goBack}
                        data-ocid="book.washtype.back.button"
                        className="border-border/60 hover:bg-muted/30"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={goNext}
                        disabled={!selectedWashType}
                        data-ocid="book.washtype.next.button"
                        className="bg-primary text-primary-foreground hover:opacity-90"
                      >
                        Next: Schedule
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Schedule */}
            {step === "schedule" && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="stat-card-gradient border-border/40 shadow-card">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold mb-1">
                      Pick Date & Time
                    </h2>
                    <p className="text-muted-foreground text-sm mb-5">
                      When and where should we come?
                    </p>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="date"
                            className="flex items-center gap-1.5 text-sm font-medium"
                          >
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            Date
                          </Label>
                          <Input
                            id="date"
                            type="date"
                            min={TODAY}
                            value={scheduledDate}
                            onChange={(e) => {
                              setScheduledDate(e.target.value);
                              setDateError("");
                            }}
                            data-ocid="book.date.input"
                            className="bg-background/50 border-border/60 focus:border-primary/50"
                          />
                          {dateError && (
                            <p
                              className="text-xs text-destructive"
                              data-ocid="book.date.error_state"
                            >
                              {dateError}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label
                            htmlFor="time"
                            className="flex items-center gap-1.5 text-sm font-medium"
                          >
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            Time
                          </Label>
                          <Input
                            id="time"
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => {
                              setScheduledTime(e.target.value);
                              setTimeError("");
                            }}
                            data-ocid="book.time.input"
                            className="bg-background/50 border-border/60 focus:border-primary/50"
                          />
                          {timeError && (
                            <p
                              className="text-xs text-destructive"
                              data-ocid="book.time.error_state"
                            >
                              {timeError}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="address"
                          className="flex items-center gap-1.5 text-sm font-medium"
                        >
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          Service Address
                        </Label>
                        <Input
                          id="address"
                          placeholder="e.g., 123 Oak Street, Springfield, IL 62701"
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            setAddressError("");
                          }}
                          data-ocid="book.address.input"
                          className="bg-background/50 border-border/60 focus:border-primary/50"
                        />
                        {addressError && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="book.address.error_state"
                          >
                            {addressError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={goBack}
                        data-ocid="book.schedule.back.button"
                        className="border-border/60 hover:bg-muted/30"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={() => {
                          if (validateSchedule()) goNext();
                        }}
                        data-ocid="book.schedule.next.button"
                        className="bg-primary text-primary-foreground hover:opacity-90"
                      >
                        Review Booking
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Confirm */}
            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="stat-card-gradient border-border/40 shadow-card">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold mb-1">
                      Confirm Your Booking
                    </h2>
                    <p className="text-muted-foreground text-sm mb-5">
                      Review the details before submitting.
                    </p>

                    <div className="space-y-3">
                      {[
                        {
                          icon: Car,
                          label: "Vehicle",
                          value: selectedVehicle
                            ? `${selectedVehicle.make} ${selectedVehicle.model} • ${selectedVehicle.licensePlate}`
                            : "—",
                        },
                        {
                          icon: Sparkles,
                          label: "Wash Type",
                          value: selectedPackage
                            ? `${selectedPackage.name} — ${selectedPackage.price}`
                            : "—",
                        },
                        {
                          icon: Calendar,
                          label: "Date",
                          value: scheduledDate || "—",
                        },
                        {
                          icon: Clock,
                          label: "Time",
                          value: scheduledTime || "—",
                        },
                        {
                          icon: MapPin,
                          label: "Address",
                          value: address || "—",
                        },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/10 border border-border/30"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <row.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-0.5">
                              {row.label}
                            </div>
                            <div className="text-sm font-medium text-foreground">
                              {row.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={goBack}
                        data-ocid="book.confirm.back.button"
                        className="border-border/60 hover:bg-muted/30"
                        disabled={bookWash.isPending}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={handleConfirm}
                        disabled={bookWash.isPending}
                        data-ocid="book.confirm.submit_button"
                        className="bg-primary text-primary-foreground hover:opacity-90 glow-cyan-sm"
                      >
                        {bookWash.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Booking...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Confirm Booking
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
