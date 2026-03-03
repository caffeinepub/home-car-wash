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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddVehicle,
  useDeleteVehicle,
  useMyVehicles,
} from "@/hooks/useQueries";
import type { Vehicle } from "@/hooks/useQueries";
import { Car, ChevronRight, Hash, Loader2, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function VehicleCard({
  vehicle,
  index,
  onDelete,
}: {
  vehicle: Vehicle;
  index: number;
  onDelete: (id: bigint) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      data-ocid={`vehicles.item.${index}`}
      className="glass-card rounded-xl p-5 flex items-center gap-4 group hover:border-primary/20 transition-all shadow-card"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
        <Car className="w-6 h-6 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display font-semibold text-foreground truncate">
            {vehicle.make} {vehicle.model}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Hash className="w-3.5 h-3.5" />
          <span className="font-mono tracking-wider text-xs bg-muted/30 px-2 py-0.5 rounded">
            {vehicle.licensePlate}
          </span>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            data-ocid={`vehicles.delete_button.${index}`}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          className="bg-popover border-border/60"
          data-ocid="vehicles.delete.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Vehicle?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Remove{" "}
              <strong className="text-foreground">
                {vehicle.make} {vehicle.model}
              </strong>{" "}
              ({vehicle.licensePlate}) from your garage? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border/60 hover:bg-muted/30"
              data-ocid="vehicles.delete.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(vehicle.id)}
              className="bg-destructive text-destructive-foreground hover:opacity-90"
              data-ocid="vehicles.delete.confirm_button"
            >
              Delete Vehicle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

export function VehiclesPage() {
  const { data: vehicles, isLoading } = useMyVehicles();
  const addVehicle = useAddVehicle();
  const deleteVehicle = useDeleteVehicle();

  const [open, setOpen] = useState(false);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [errors, setErrors] = useState<{
    make?: string;
    model?: string;
    licensePlate?: string;
  }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!make.trim()) e.make = "Make is required";
    if (!model.trim()) e.model = "Model is required";
    if (!licensePlate.trim()) e.licensePlate = "License plate is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    try {
      await addVehicle.mutateAsync({
        make: make.trim(),
        model: model.trim(),
        licensePlate: licensePlate.trim().toUpperCase(),
      });
      toast.success("Vehicle added successfully!");
      setOpen(false);
      setMake("");
      setModel("");
      setLicensePlate("");
      setErrors({});
    } catch {
      toast.error("Failed to add vehicle. Please try again.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteVehicle.mutateAsync(id);
      toast.success("Vehicle removed.");
    } catch {
      toast.error("Failed to remove vehicle.");
    }
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
                <Car className="w-4 h-4" />
                <span>My Vehicles</span>
              </div>
              <h1 className="font-display text-3xl font-bold">Your Garage</h1>
              <p className="text-muted-foreground mt-1">
                Manage the vehicles you wash with ShineDrop.
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  data-ocid="vehicles.add.open_modal_button"
                  className="bg-primary text-primary-foreground hover:opacity-90 glow-cyan-sm shrink-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent
                className="bg-popover border-border/60 sm:max-w-md"
                data-ocid="vehicles.add.modal"
              >
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">
                    Add New Vehicle
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Enter your vehicle details to add it to your garage.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="make" className="text-sm font-medium">
                      Make
                    </Label>
                    <Input
                      id="make"
                      placeholder="e.g., Toyota"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      data-ocid="vehicles.make.input"
                      className="bg-background/50 border-border/60 focus:border-primary/50"
                    />
                    {errors.make && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="vehicles.make.error_state"
                      >
                        {errors.make}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="model" className="text-sm font-medium">
                      Model
                    </Label>
                    <Input
                      id="model"
                      placeholder="e.g., Camry"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      data-ocid="vehicles.model.input"
                      className="bg-background/50 border-border/60 focus:border-primary/50"
                    />
                    {errors.model && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="vehicles.model.error_state"
                      >
                        {errors.model}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="plate" className="text-sm font-medium">
                      License Plate
                    </Label>
                    <Input
                      id="plate"
                      placeholder="e.g., ABC-1234"
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value)}
                      data-ocid="vehicles.plate.input"
                      className="bg-background/50 border-border/60 focus:border-primary/50 font-mono uppercase"
                    />
                    {errors.licensePlate && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="vehicles.plate.error_state"
                      >
                        {errors.licensePlate}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    data-ocid="vehicles.add.cancel_button"
                    className="border-border/60 hover:bg-muted/30"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAdd}
                    disabled={addVehicle.isPending}
                    data-ocid="vehicles.add.submit_button"
                    className="bg-primary text-primary-foreground hover:opacity-90"
                  >
                    {addVehicle.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Vehicle
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Vehicle List */}
          {isLoading ? (
            <div className="space-y-3" data-ocid="vehicles.list.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl bg-muted/30" />
              ))}
            </div>
          ) : vehicles && vehicles.length > 0 ? (
            <AnimatePresence>
              <div className="space-y-3" data-ocid="vehicles.list">
                {vehicles.map((vehicle, i) => (
                  <VehicleCard
                    key={vehicle.id.toString()}
                    vehicle={vehicle}
                    index={i + 1}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 glass-card rounded-2xl"
              data-ocid="vehicles.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                No vehicles yet
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                Add your first vehicle to start booking home wash appointments.
              </p>
              <Button
                onClick={() => setOpen(true)}
                data-ocid="vehicles.empty.add.button"
                className="bg-primary text-primary-foreground hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Vehicle
              </Button>
            </motion.div>
          )}

          {/* Stats footer */}
          {vehicles && vehicles.length > 0 && (
            <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Car className="w-4 h-4" />
                <span>
                  {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} in
                  your garage
                </span>
              </div>
              <div className="flex items-center gap-1 text-primary text-xs">
                <span>Hover a card to delete</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
