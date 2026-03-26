import L from "leaflet";
import { useEffect, useRef } from "react";
import type { IncidentReport } from "../backend";
import { IncidentType, Severity } from "../backend";
import type { SosRequest } from "../sos";

// Fix default marker icons without delete operator
(L.Icon.Default.prototype as any)._getIconUrl = undefined;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TYPE_CONFIG = {
  [IncidentType.flood]: { color: "#2DA8FF", label: "Flood" },
  [IncidentType.earthquake]: { color: "#FF4B3A", label: "Earthquake" },
  [IncidentType.fire]: { color: "#FF8A2A", label: "Fire" },
  [IncidentType.lightning]: { color: "#FFD34A", label: "Lightning" },
};

const SEVERITY_INTENSITY: Record<Severity, number> = {
  [Severity.low]: 0.3,
  [Severity.medium]: 0.5,
  [Severity.high]: 0.8,
  [Severity.critical]: 1.0,
};

function escapeHtml(unsafe: string): string {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createCustomIcon(type: IncidentType): L.DivIcon {
  const cfg = TYPE_CONFIG[type];
  return L.divIcon({
    html: `<div style="width:24px;height:24px;background:${cfg.color}22;border:2px solid ${cfg.color};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 10px ${cfg.color}88;"><div style="width:8px;height:8px;background:${cfg.color};border-radius:50%;"></div></div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

interface MapViewProps {
  reports: IncidentReport[];
  activeFilters: Set<IncidentType>;
  onMarkerClick?: (report: IncidentReport) => void;
  sosRequests?: SosRequest[];
}

export function MapView({
  reports,
  activeFilters,
  onMarkerClick,
  sosRequests = [],
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const heatLayerRef = useRef<any>(null);
  const heatmapLoadedRef = useRef(false);
  const heatmapLoadingRef = useRef(false);

  const SOS_SEVERITY_CONFIG: Record<
    Severity,
    { color: string; label: string }
  > = {
    [Severity.low]: { color: "#7aa2ff", label: "Low" },
    [Severity.medium]: { color: "#ffd34a", label: "Medium" },
    [Severity.high]: { color: "#ff8a2a", label: "High" },
    [Severity.critical]: { color: "#ff4b3a", label: "Critical" },
  };

  function createSosIcon(severity: Severity): L.DivIcon {
    const cfg = SOS_SEVERITY_CONFIG[severity];
    return L.divIcon({
      className: "",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      html: `
        <div style="
          width:30px;height:30px;border-radius:999px;
          background:${cfg.color}22;border:2px solid ${cfg.color};
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 16px ${cfg.color}55;
        ">
          <div style="
            width:14px;height:14px;position:relative;
          ">
            <div style="
              position:absolute;top:6px;left:0;right:0;height:2px;
              background:${cfg.color};border-radius:2px;
            "></div>
            <div style="
              position:absolute;top:0;bottom:0;left:6px;width:2px;
              background:${cfg.color};border-radius:2px;
            "></div>
          </div>
        </div>
      `,
    });
  }

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [28.6139, 77.209],
      zoom: 11,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    if (!heatmapLoadingRef.current) {
      heatmapLoadingRef.current = true;
      import("leaflet.heat")
        .then(() => {
          heatmapLoadedRef.current = true;
        })
        .catch(() => {
          heatmapLoadedRef.current = true;
        });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const m of markersRef.current) m.remove();
    markersRef.current = [];
    if (heatLayerRef.current) {
      heatLayerRef.current.remove();
      heatLayerRef.current = null;
    }

    const filtered = reports.filter((r) => activeFilters.has(r.incidentType));

    for (const report of filtered) {
      const icon = createCustomIcon(report.incidentType);
      const cfg = TYPE_CONFIG[report.incidentType];
      const marker = L.marker(
        [report.location.latitude, report.location.longitude],
        { icon },
      )
        .addTo(map)
        .bindPopup(
          `<div style="background:#161D28;border:1px solid #242C38;border-radius:8px;padding:12px;min-width:200px;color:#F2F5F8;font-family:sans-serif">
            <div style="font-weight:700;color:${cfg.color};text-transform:uppercase;font-size:11px;letter-spacing:0.1em;margin-bottom:6px">${cfg.label}</div>
            <div style="font-weight:600;margin-bottom:4px;font-size:13px">${report.userName}</div>
            <div style="font-size:12px;color:#A3ADB9;line-height:1.5">${report.description}</div>
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid #242C38;font-size:11px;color:#7F8A97">
              Severity: <span style="color:${report.severity === "critical" ? "#FF4B3A" : "#FFD34A"};font-weight:600;text-transform:capitalize">${report.severity}</span>
            </div>
          </div>`,
          { className: "custom-popup" },
        );

      marker.on("click", () => {
        onMarkerClick?.(report);
      });
      markersRef.current.push(marker);
    }

    for (const sos of sosRequests) {
      const sosCfg = SOS_SEVERITY_CONFIG[sos.severity];
      const marker = L.marker([sos.latitude, sos.longitude], {
        icon: createSosIcon(sos.severity),
      })
        .addTo(map)
        .bindPopup(
          `<div style="background:#161D28;border:1px solid #242C38;border-radius:8px;padding:12px;min-width:200px;color:#F2F5F8;font-family:sans-serif">
            <div style="font-weight:800;color:${sosCfg.color};text-transform:uppercase;font-size:11px;letter-spacing:0.1em;margin-bottom:6px">SOS Emergency</div>
            <div style="font-size:12px;color:#A3ADB9;line-height:1.5;margin-bottom:8px">${escapeHtml(
              sos.description,
            )}</div>
            <div style="font-size:11px;color:#7F8A97">
              Severity: <span style="color:${sosCfg.color};font-weight:700;text-transform:capitalize">${sosCfg.label}</span>
            </div>
          </div>`,
          { className: "custom-popup" },
        );
      markersRef.current.push(marker);
    }

    if (
      heatmapLoadedRef.current &&
      (L as any).heatLayer &&
      filtered.length > 0
    ) {
      const heatPoints = filtered.map((r) => [
        r.location.latitude,
        r.location.longitude,
        SEVERITY_INTENSITY[r.severity],
      ]);
      heatLayerRef.current = (L as any)
        .heatLayer(heatPoints, {
          radius: 35,
          blur: 20,
          maxZoom: 17,
          gradient: {
            0.3: "#4E6BFF",
            0.6: "#7A5CFF",
            0.8: "#FF5A3C",
            1.0: "#FF3D2E",
          },
        })
        .addTo(map);
    }
  }, [reports, activeFilters, onMarkerClick, sosRequests]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />

      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-none">
        <div className="flex items-center gap-2 bg-background/90 border border-eg-orange/40 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-eg-orange animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-eg-orange">
            Live Heatmap
          </span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-[1000] card-surface rounded-xl p-3 space-y-1.5">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: cfg.color }}
            />
            <span className="text-[11px] text-muted-foreground">
              {cfg.label}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .leaflet-popup-content { margin: 0 !important; }
      `}</style>
    </div>
  );
}
