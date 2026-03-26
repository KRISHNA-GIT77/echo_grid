import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Loader2,
  MapPin,
  AlertTriangle,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IncidentType, Severity, useCreateReport } from "../hooks/useQueries";
import type { SosRequest } from "../sos";

interface SosModalProps {
  open: boolean;
  onClose: () => void;
  onDispatch: (request: SosRequest) => void;
}

export function SosModal({ open, onClose, onDispatch }: SosModalProps) {
  const [severity, setSeverity] = useState<Severity>(Severity.high);
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const createReport = useCreateReport();

  useEffect(() => {
    if (!open) return;

    // Reset per-open state
    setDescription("");
    setLat(null);
    setLng(null);
    setSeverity(Severity.high);

    setLocating(true);
    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return;
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocating(false);
        toast.success("Location captured");
      },
      () => {
        if (cancelled) return;
        setLocating(false);
        // Fallback location (Delhi center) if location permission fails.
        setLat(28.6139);
        setLng(77.209);
        toast.error("Could not get location. Using Delhi center.");
      },
      {
        enableHighAccuracy: true,
        timeout: 12_000,
        maximumAge: 10_000,
      },
    );

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleSubmit = async () => {
    if (!lat || !lng) {
      toast.error("Location is not ready yet.");
      return;
    }

    if (!description.trim()) {
      toast.error("Please describe your emergency.");
      return;
    }

    const request: SosRequest = {
      id: `${Date.now()}`,
      latitude: lat,
      longitude: lng,
      severity,
      description: description.trim(),
      timestamp: Date.now(),
    };

    // Always show the success UX immediately on submit.
    onDispatch(request);
    onClose();
    toast.success("Help has been dispatched.");

    // Best-effort backend dispatch (if the user is logged in).
    try {
      await createReport.mutateAsync({
        incidentType: IncidentType.fire,
        severity,
        // Backend does not know about SOS; keep the SOS text for later identification.
        description: `SOS: ${request.description}`,
        latitude: request.latitude,
        longitude: request.longitude,
      });
    } catch {
      // In demo/anonymous mode the mock or permissions might fail; marker is already shown locally.
      toast.error("SOS could not be delivered to the backend (saved locally).");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative z-[10000] w-full max-w-lg mx-4"
            data-ocid="sos.modal"
          >
            <div className="card-surface rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-eg-red" />
                  SOS Emergency
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                    Severity
                  </Label>
                  <Select
                    value={severity}
                    onValueChange={(v) => setSeverity(v as Severity)}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value={Severity.low}>Low</SelectItem>
                      <SelectItem value={Severity.medium}>Medium</SelectItem>
                      <SelectItem value={Severity.high}>High</SelectItem>
                      <SelectItem value={Severity.critical}>
                        <span className="text-destructive font-bold">
                          Critical
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                    Location
                  </Label>
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled
                      className="w-full border-border hover:bg-secondary opacity-100"
                    >
                      {locating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Capturing...
                        </>
                      ) : lat ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2 text-eg-cyan" />{" "}
                          {lat.toFixed(4)}, {lng?.toFixed(4)}
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 mr-2" /> Capturing location...
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                    Describe the situation
                  </Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Example: I'm trapped in my building. There is smoke and I can't get out. I'm near the staircase on the 2nd floor."
                    rows={4}
                    className="bg-input border-border resize-none"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={createReport.isPending || !lat}
                  className="w-full bg-eg-red hover:bg-eg-red/90 text-white font-bold uppercase tracking-wider glow"
                >
                  {createReport.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send SOS"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

