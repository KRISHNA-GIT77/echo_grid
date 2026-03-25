import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Edit3,
  Loader2,
  MapPin,
  Phone,
  Save,
  Trash2,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Profile } from "../backend";
import {
  IncidentType,
  Severity,
  useDeleteReport,
  useGetAllReports,
  useSaveProfile,
} from "../hooks/useQueries";

const TYPE_COLOR: Record<IncidentType, string> = {
  [IncidentType.flood]: "text-eg-cyan",
  [IncidentType.earthquake]: "text-eg-red",
  [IncidentType.fire]: "text-eg-fire",
  [IncidentType.lightning]: "text-eg-yellow",
};

interface UserProfileProps {
  profile: Profile | null;
  identity: any;
  isSetup?: boolean;
  onProfileSaved?: () => void;
}

export function UserProfile({
  profile,
  identity,
  isSetup,
  onProfileSaved,
}: UserProfileProps) {
  const [editing, setEditing] = useState(isSetup || !profile);
  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phoneNumber || "");
  const [city, setCity] = useState(profile?.city || "");
  const saveProfile = useSaveProfile();
  const deleteReport = useDeleteReport();
  const { data: allReports } = useGetAllReports();

  const principalStr = identity?.getPrincipal().toString();
  const myReports =
    allReports?.filter((r) => r.userId.toString() === principalStr) ?? [];

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPhone(profile.phoneNumber);
      setCity(profile.city);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await saveProfile.mutateAsync({ name, phoneNumber: phone, city });
      toast.success("Profile saved!");
      setEditing(false);
      onProfileSaved?.();
    } catch {
      toast.error("Failed to save profile");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteReport.mutateAsync(id);
      toast.success("Report deleted");
    } catch {
      toast.error("Failed to delete report");
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {isSetup && (
          <div className="card-surface rounded-xl border-l-4 border-eg-orange/60 p-4">
            <h2 className="font-bold text-eg-orange mb-1">
              Complete Your Profile
            </h2>
            <p className="text-sm text-muted-foreground">
              Set up your profile to start reporting incidents.
            </p>
          </div>
        )}

        {/* Profile Card */}
        <div className="card-surface rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-display font-bold text-xl">Your Profile</h2>
            {!editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                data-ocid="profile.edit_button"
                className="border-border"
              >
                <Edit3 className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
          </div>

          <div className="p-5">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Full Name *
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="mt-1 bg-input border-border"
                    data-ocid="profile.name.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Phone Number
                  </Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1 bg-input border-border"
                    data-ocid="profile.phone.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    City
                  </Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Delhi / Noida / Gurgaon"
                    className="mt-1 bg-input border-border"
                    data-ocid="profile.city.input"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={saveProfile.isPending}
                    data-ocid="profile.save_button"
                    className="bg-eg-orange hover:bg-eg-orange/90 text-white font-semibold"
                  >
                    {saveProfile.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Profile
                  </Button>
                  {!isSetup && (
                    <Button
                      variant="outline"
                      onClick={() => setEditing(false)}
                      className="border-border"
                      data-ocid="profile.cancel_button"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-eg-purple/20 border border-eg-purple/40 flex items-center justify-center">
                    <User className="w-5 h-5 text-eg-purple" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-semibold">{profile?.name || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-eg-cyan/10 border border-eg-cyan/30 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-eg-cyan" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-semibold">
                      {profile?.phoneNumber || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-eg-fire/10 border border-eg-fire/30 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-eg-fire" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">City</p>
                    <p className="font-semibold">{profile?.city || "—"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User's Reports */}
        <div className="card-surface rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-bold text-lg">My Reports</h3>
            <Badge className="bg-secondary text-foreground">
              {myReports.length}
            </Badge>
          </div>
          {myReports.length === 0 ? (
            <div
              className="p-8 text-center text-muted-foreground"
              data-ocid="profile.reports.empty_state"
            >
              <p className="text-sm">
                You haven't submitted any incident reports yet.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-80">
              <div className="p-4 space-y-2">
                {myReports.map((r, i) => (
                  <div
                    key={r.id.toString()}
                    data-ocid={`profile.report.item.${i + 1}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold uppercase ${TYPE_COLOR[r.incidentType]}`}
                        >
                          {r.incidentType}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {r.severity}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {r.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(r.id)}
                      data-ocid={`profile.report.delete_button.${i + 1}`}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </motion.div>
    </main>
  );
}
