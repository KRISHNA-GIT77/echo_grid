import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type IncidentReport,
  IncidentType,
  type Profile,
  Severity,
} from "../backend";
import { useActor } from "./useActor";

export function useGetAllReports() {
  const { actor, isFetching } = useActor();
  return useQuery<IncidentReport[]>({
    queryKey: ["reports"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const reports = await actor.getAllReports();
        return reports;
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useGetCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<Profile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      incidentType: IncidentType;
      severity: Severity;
      description: string;
      latitude: number;
      longitude: number;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createReport(
        data.incidentType,
        data.severity,
        data.description,
        data.latitude,
        data.longitude,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reports"] }),
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: Profile) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useDeleteReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteReport(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reports"] }),
  });
}

export { IncidentType, Severity };
