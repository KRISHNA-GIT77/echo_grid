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
import { CheckCircle, Loader2, MapPin, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { IncidentType, Severity, useCreateReport } from "../hooks/useQueries";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReportModal({ open, onClose }: ReportModalProps) {
  const [incidentType, setIncidentType] = useState<IncidentType>(
    IncidentType.flood,
  );
  const [severity, setSeverity] = useState<Severity>(Severity.medium);
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const createReport = useCreateReport();

  const handleGetLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocating(false);
        toast.success("Location captured");
      },
      () => {
        setLocating(false);
        setLat(28.6139);
        setLng(77.209);
        toast.error("Could not get location. Using Delhi center.");
      },
    );
  };

  const handleSubmit = async () => {
    if (!lat || !lng) {
      toast.error("Please capture your location first");
      return;
    }
    if (!description.trim()) {
      toast.error("Please add a description");
      return;
    }
    try {
      await createReport.mutateAsync({
        incidentType,
        severity,
        description,
        latitude: lat,
        longitude: lng,
      });
      toast.success("Incident reported successfully!");
      onClose();
      setDescription("");
      setLat(null);
      setLng(null);
    } catch {
      toast.error("Failed to submit report. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-lg mx-4"
            data-ocid="report.modal"
          >
            <div className="card-surface rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="font-display font-bold text-lg">
                  Report Incident
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  data-ocid="report.close_button"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                      Incident Type
                    </Label>
                    <Select
                      value={incidentType}
                      onValueChange={(v) => setIncidentType(v as IncidentType)}
                    >
                      <SelectTrigger
                        className="bg-input border-border"
                        data-ocid="report.type.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value={IncidentType.flood}>
                          <span className="text-eg-cyan font-medium">
                            Flood
                          </span>
                        </SelectItem>
                        <SelectItem value={IncidentType.earthquake}>
                          <span className="text-eg-red font-medium">
                            Earthquake
                          </span>
                        </SelectItem>
                        <SelectItem value={IncidentType.fire}>
                          <span className="text-eg-fire font-medium">Fire</span>
                        </SelectItem>
                        <SelectItem value={IncidentType.lightning}>
                          <span className="text-eg-yellow font-medium">
                            Lightning
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                      Severity
                    </Label>
                    <Select
                      value={severity}
                      onValueChange={(v) => setSeverity(v as Severity)}
                    >
                      <SelectTrigger
                        className="bg-input border-border"
                        data-ocid="report.severity.select"
                      >
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
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                    Description
                  </Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the situation: location details, number of people affected, immediate risks..."
                    rows={3}
                    className="bg-input border-border resize-none"
                    data-ocid="report.description.textarea"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                    Location
                  </Label>
                  <Button
                    variant="outline"
                    onClick={handleGetLocation}
                    disabled={locating}
                    data-ocid="report.location.button"
                    className="w-full border-border hover:bg-secondary"
                  >
                    {locating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Getting Location...
                      </>
                    ) : lat ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-eg-cyan" />{" "}
                        {lat.toFixed(4)}, {lng?.toFixed(4)}
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 mr-2" /> Use My Location
                      </>
                    )}
                  </Button>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={createReport.isPending || !lat}
                  data-ocid="report.submit_button"
                  className="w-full bg-eg-orange hover:bg-eg-orange/90 text-white font-bold uppercase tracking-wider glow"
                >
                  {createReport.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
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
