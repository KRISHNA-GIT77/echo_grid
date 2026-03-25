import { type IncidentReport, IncidentType, Severity } from "../backend";

// Sample reports near Delhi/Noida for demo mode
export const SAMPLE_REPORTS: IncidentReport[] = [
  {
    id: BigInt(1),
    userName: "Priya Sharma",
    userId: { _arr: new Uint8Array(), _isPrincipal: true } as any,
    description:
      "Heavy flooding on NH-9 near Sector 18. Water level waist high. Multiple vehicles stranded.",
    timestamp: BigInt(Date.now() * 1_000_000 - 1_800_000_000_000),
    severity: Severity.critical,
    location: { latitude: 28.5355, longitude: 77.391 },
    incidentType: IncidentType.flood,
  },
  {
    id: BigInt(2),
    userName: "Rahul Verma",
    userId: { _arr: new Uint8Array(), _isPrincipal: true } as any,
    description:
      "Power outage across Dwarka Sector 10-22. Transformers down due to lightning strike.",
    timestamp: BigInt(Date.now() * 1_000_000 - 3_600_000_000_000),
    severity: Severity.high,
    location: { latitude: 28.5921, longitude: 77.046 },
    incidentType: IncidentType.lightning,
  },
  {
    id: BigInt(3),
    userName: "Ankit Gupta",
    userId: { _arr: new Uint8Array(), _isPrincipal: true } as any,
    description:
      "Building fire in Lajpat Nagar market. Fire brigade called. Evacuate surrounding area.",
    timestamp: BigInt(Date.now() * 1_000_000 - 7_200_000_000_000),
    severity: Severity.critical,
    location: { latitude: 28.5665, longitude: 77.2431 },
    incidentType: IncidentType.fire,
  },
  {
    id: BigInt(4),
    userName: "Meera Patel",
    userId: { _arr: new Uint8Array(), _isPrincipal: true } as any,
    description:
      "Minor tremors felt in Noida Sector 62. Residents asked to move to open spaces.",
    timestamp: BigInt(Date.now() * 1_000_000 - 10_800_000_000_000),
    severity: Severity.medium,
    location: { latitude: 28.62, longitude: 77.37 },
    incidentType: IncidentType.earthquake,
  },
  {
    id: BigInt(5),
    userName: "Deepak Singh",
    userId: { _arr: new Uint8Array(), _isPrincipal: true } as any,
    description:
      "Yamuna flooding near ITO bridge. Low-lying areas being evacuated. Stay away.",
    timestamp: BigInt(Date.now() * 1_000_000 - 14_400_000_000_000),
    severity: Severity.high,
    location: { latitude: 28.6271, longitude: 77.2428 },
    incidentType: IncidentType.flood,
  },
  {
    id: BigInt(6),
    userName: "Sunita Rao",
    userId: { _arr: new Uint8Array(), _isPrincipal: true } as any,
    description:
      "Flooded underpass at Minto Road. Cars submerged. Do not attempt to cross.",
    timestamp: BigInt(Date.now() * 1_000_000 - 900_000_000_000),
    severity: Severity.high,
    location: { latitude: 28.6348, longitude: 77.2226 },
    incidentType: IncidentType.flood,
  },
  {
    id: BigInt(7),
    userName: "Vikram Nair",
    userId: { _arr: new Uint8Array(), _isPrincipal: true } as any,
    description:
      "Lightning strike near Qutub Minar complex. Avoid open areas in South Delhi.",
    timestamp: BigInt(Date.now() * 1_000_000 - 2_700_000_000_000),
    severity: Severity.medium,
    location: { latitude: 28.5244, longitude: 77.1855 },
    incidentType: IncidentType.lightning,
  },
  {
    id: BigInt(8),
    userName: "Kavya Reddy",
    userId: { _arr: new Uint8Array(), _isPrincipal: true } as any,
    description:
      "Kitchen fire in apartment complex at Rohini Sector 3. Two floors affected.",
    timestamp: BigInt(Date.now() * 1_000_000 - 5_400_000_000_000),
    severity: Severity.medium,
    location: { latitude: 28.7041, longitude: 77.1025 },
    incidentType: IncidentType.fire,
  },
];
