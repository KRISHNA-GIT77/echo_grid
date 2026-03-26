import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Flame,
  Loader2,
  Plus,
  RefreshCw,
  Waves,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { type IncidentReport, IncidentType, Severity } from "../backend";
import { SAMPLE_REPORTS } from "../data/sampleReports";
import { useGetAllReports } from "../hooks/useQueries";
import { MapView } from "./MapView";
import { ReportModal } from "./ReportModal";
import { SosModal } from "./SosModal";
import type { SosRequest } from "../sos";

const FILTERS = [
  {
    type: IncidentType.earthquake,
    label: "Earthquake",
    Icon: AlertTriangle,
    color: "text-eg-red",
    bg: "bg-eg-red/15 border-eg-red/40",
  },
  {
    type: IncidentType.flood,
    label: "Flood",
    Icon: Waves,
    color: "text-eg-cyan",
    bg: "bg-eg-cyan/15 border-eg-cyan/40",
  },
  {
    type: IncidentType.lightning,
    label: "Lightning",
    Icon: Zap,
    color: "text-eg-yellow",
    bg: "bg-eg-yellow/15 border-eg-yellow/40",
  },
  {
    type: IncidentType.fire,
    label: "Fire",
    Icon: Flame,
    color: "text-eg-fire",
    bg: "bg-eg-fire/15 border-eg-fire/40",
  },
];

const SEVERITY_BADGE: Record<Severity, string> = {
  [Severity.low]: "bg-muted text-muted-foreground",
  [Severity.medium]: "bg-eg-yellow/15 text-eg-yellow border-eg-yellow/30",
  [Severity.high]: "bg-eg-fire/15 text-eg-fire border-eg-fire/30",
  [Severity.critical]: "bg-eg-red/15 text-eg-red border-eg-red/30",
};

const TYPE_COLOR: Record<IncidentType, string> = {
  [IncidentType.flood]: "text-eg-cyan",
  [IncidentType.earthquake]: "text-eg-red",
  [IncidentType.fire]: "text-eg-fire",
  [IncidentType.lightning]: "text-eg-yellow",
};

function timeAgo(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface DashboardProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

export function Dashboard({ isLoggedIn, onLoginClick }: DashboardProps) {
  const [activeFilters, setActiveFilters] = useState<Set<IncidentType>>(
    new Set(Object.values(IncidentType)),
  );
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(
    null,
  );
  const [sosOpen, setSosOpen] = useState(false);
  const [sosRequests, setSosRequests] = useState<SosRequest[]>([]);
  const { data: backendReports, isLoading, refetch } = useGetAllReports();

  const allReports = useMemo(() => {
    if (backendReports && backendReports.length > 0) return backendReports;
    return SAMPLE_REPORTS;
  }, [backendReports]);

  const filteredReports = useMemo(
    () => allReports.filter((r) => activeFilters.has(r.incidentType)),
    [allReports, activeFilters],
  );

  const toggleFilter = (type: IncidentType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const criticalCount = filteredReports.filter(
    (r) => r.severity === Severity.critical,
  ).length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">
            Command Center
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Live Disaster Map
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {criticalCount > 0 && (
            <Badge className="bg-eg-red/15 text-eg-red border-eg-red/40 font-bold animate-pulse-slow">
              {criticalCount} Critical
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-border"
            data-ocid="dashboard.refresh.button"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          {isLoggedIn ? (
            <Button
              size="sm"
              onClick={() => setReportOpen(true)}
              data-ocid="dashboard.report.button"
              className="bg-eg-orange hover:bg-eg-orange/90 text-white font-semibold glow"
            >
              <Plus className="w-4 h-4 mr-1" /> Report Incident
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={onLoginClick}
              data-ocid="dashboard.login_to_report.button"
              className="bg-eg-orange hover:bg-eg-orange/90 text-white font-semibold glow"
            >
              <Plus className="w-4 h-4 mr-1" /> Report Incident
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <div className="space-y-4">
          <div className="card-surface rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Disaster Type
            </h3>
            <div className="space-y-2">
              {FILTERS.map(({ type, label, Icon, color, bg }) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => toggleFilter(type)}
                  data-ocid={`filter.${type}.toggle`}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                    activeFilters.has(type)
                      ? `${bg} ${color}`
                      : "border-transparent bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <span className="text-xs font-bold">
                    {allReports.filter((r) => r.incidentType === type).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="card-surface rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Urgent Alerts
              </h3>
              {isLoading && (
                <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
              )}
            </div>
            <ScrollArea className="h-[340px]">
              <div className="p-2 space-y-1.5">
                {filteredReports.length === 0 ? (
                  <div
                    className="text-center py-8 text-muted-foreground text-sm"
                    data-ocid="alerts.empty_state"
                  >
                    No active incidents
                  </div>
                ) : (
                  filteredReports
                    .sort((a, b) => {
                      const order = [
                        Severity.critical,
                        Severity.high,
                        Severity.medium,
                        Severity.low,
                      ];
                      return (
                        order.indexOf(a.severity) - order.indexOf(b.severity)
                      );
                    })
                    .map((r, i) => (
                      <motion.button
                        type="button"
                        key={r.id.toString()}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => setSelectedReport(r)}
                        data-ocid={`alerts.item.${i + 1}`}
                        className={`w-full text-left p-3 rounded-lg hover:bg-secondary/50 transition-colors ${
                          selectedReport?.id === r.id ? "bg-secondary" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className={`text-[10px] font-bold uppercase ${TYPE_COLOR[r.incidentType]}`}
                              >
                                {r.incidentType}
                              </span>
                              <span
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${SEVERITY_BADGE[r.severity]}`}
                              >
                                {r.severity}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {r.description}
                            </p>
                          </div>
                          <span className="text-[9px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                            {timeAgo(r.timestamp)}
                          </span>
                        </div>
                      </motion.button>
                    ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div
          className="relative card-surface rounded-xl overflow-hidden"
          style={{ height: "620px" }}
        >
          <MapView
            reports={allReports}
            activeFilters={activeFilters}
            onMarkerClick={setSelectedReport}
            sosRequests={sosRequests}
          />

          <button
            type="button"
            onClick={() => setSosOpen(true)}
            data-ocid="dashboard.sos.fab"
            className="absolute bottom-6 right-6 z-[1100] w-14 h-14 rounded-full bg-eg-red hover:bg-eg-red/90 text-white shadow-lg shadow-eg-red/20 flex items-center justify-center glow transition-transform active:scale-[0.98]"
            aria-label="SOS Emergency"
            title="SOS Emergency"
          >
            <AlertTriangle className="w-6 h-6" />
          </button>
        </div>
      </div>

      {selectedReport && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 card-surface rounded-xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-4"
          data-ocid="dashboard.report_detail.card"
        >
          <div>
            <p className="text-xs text-muted-foreground mb-1">Type</p>
            <p
              className={`font-bold uppercase text-sm ${TYPE_COLOR[selectedReport.incidentType]}`}
            >
              {selectedReport.incidentType}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Severity</p>
            <p className="font-semibold text-sm capitalize">
              {selectedReport.severity}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Reported By</p>
            <p className="font-semibold text-sm">{selectedReport.userName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Description</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {selectedReport.description}
            </p>
          </div>
        </motion.div>
      )}

      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} />
      <SosModal
        open={sosOpen}
        onClose={() => setSosOpen(false)}
        onDispatch={(req) => {
          setSosRequests((prev) => [req, ...prev].slice(0, 50));
        }}
      />
    </main>
  );
}
