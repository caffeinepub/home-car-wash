import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AppointmentStatus,
  type Vehicle,
  type WashAppointment,
  type WashStats,
  WashType,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const queryKeys = {
  vehicles: ["vehicles"] as const,
  appointments: ["appointments"] as const,
  upcomingAppointments: ["upcomingAppointments"] as const,
  pastAppointments: ["pastAppointments"] as const,
  allAppointments: ["allAppointments"] as const,
  washStats: ["washStats"] as const,
  isAdmin: ["isAdmin"] as const,
  userRole: ["userRole"] as const,
};

// ─── Vehicles ─────────────────────────────────────────────────────────────────
export function useMyVehicles() {
  const { actor, isFetching } = useActor();
  return useQuery<Vehicle[]>({
    queryKey: queryKeys.vehicles,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyVehicles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      make,
      model,
      licensePlate,
    }: {
      make: string;
      model: string;
      licensePlate: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addVehicle(make, model, licensePlate);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
    },
  });
}

export function useDeleteVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteVehicle(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
    },
  });
}

// ─── Appointments ─────────────────────────────────────────────────────────────
export function useMyUpcomingAppointments() {
  const { actor, isFetching } = useActor();
  return useQuery<WashAppointment[]>({
    queryKey: queryKeys.upcomingAppointments,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyUpcomingAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyPastAppointments() {
  const { actor, isFetching } = useActor();
  return useQuery<WashAppointment[]>({
    queryKey: queryKeys.pastAppointments,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyPastAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllAppointments() {
  const { actor, isFetching } = useActor();
  return useQuery<WashAppointment[]>({
    queryKey: queryKeys.allAppointments,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookWash() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      vehicleId,
      washType,
      scheduledDate,
      scheduledTime,
      address,
    }: {
      vehicleId: bigint;
      washType: WashType;
      scheduledDate: string;
      scheduledTime: string;
      address: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.bookWash(
        vehicleId,
        washType,
        scheduledDate,
        scheduledTime,
        address,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.upcomingAppointments,
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.washStats });
      void queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
    },
  });
}

export function useCancelAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.cancelAppointment(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.upcomingAppointments,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.pastAppointments,
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.washStats });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.allAppointments,
      });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: AppointmentStatus }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateAppointmentStatus(id, status);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.allAppointments,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.upcomingAppointments,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.pastAppointments,
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.washStats });
    },
  });
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export function useWashStats() {
  const { actor, isFetching } = useActor();
  return useQuery<WashStats>({
    queryKey: queryKeys.washStats,
    queryFn: async () => {
      if (!actor)
        return {
          completedWashes: 0n,
          upcomingWashes: 0n,
          cancelledWashes: 0n,
          totalWashes: 0n,
        };
      return actor.getMyWashStats();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: queryKeys.isAdmin,
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Re-export types for convenience
export { AppointmentStatus, WashType };
export type { Vehicle, WashAppointment, WashStats };
