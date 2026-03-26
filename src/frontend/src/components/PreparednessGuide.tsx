import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle2,
  Flame,
  Waves,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const ASSET_BASE = import.meta.env.BASE_URL || "/";

const GUIDES = [
  {
    id: "earthquake",
    label: "Earthquake",
    Icon: AlertTriangle,
    color: "text-eg-red",
    border: "border-eg-red/40",
    bg: "bg-eg-red/10",
    image: `${ASSET_BASE}assets/generated/earthquake-safety.dim_600x400.jpg`,
    fallbackImage: `${ASSET_BASE}assets/generated/earthquake-safety.svg`,
    dos: [
      "Drop, Cover, and Hold On immediately",
      "Stay away from windows and glass",
      "Move to open areas if you're outside",
      "Turn off gas supply if it's safe to do so",
      "Keep calm and assist others around you",
    ],
    donts: [
      "Don't run outside during active shaking",
      "Don't use elevators during or after quake",
      "Don't stand under doorframes (outdated advice)",
      "Don't light matches after tremors — gas leaks!",
      "Don't use phone unless it's an emergency",
    ],
  },
  {
    id: "flood",
    label: "Flood",
    Icon: Waves,
    color: "text-eg-cyan",
    border: "border-eg-cyan/40",
    bg: "bg-eg-cyan/10",
    image: `${ASSET_BASE}assets/generated/flood-safety.dim_600x400.jpg`,
    fallbackImage: `${ASSET_BASE}assets/generated/flood-safety.svg`,
    dos: [
      "Move to higher ground immediately",
      "Listen to emergency broadcast channels",
      "Turn off utilities at the main switch",
      "Disconnect all electrical appliances",
      "Follow designated evacuation routes",
    ],
    donts: [
      "Don't walk through flowing water — even 6 inches can knock you down",
      "Don't drive into flooded roads — turn around, don't drown",
      "Don't touch electrical equipment in wet areas",
      "Don't return home until authorities declare it safe",
      "Don't use tap water — it may be contaminated",
    ],
  },
  {
    id: "lightning",
    label: "Lightning",
    Icon: Zap,
    color: "text-eg-yellow",
    border: "border-eg-yellow/40",
    bg: "bg-eg-yellow/10",
    image: `${ASSET_BASE}assets/generated/lightning-safety.dim_600x400.jpg`,
    fallbackImage: `${ASSET_BASE}assets/generated/lightning-safety.svg`,
    dos: [
      "Seek shelter in a building or hard-topped vehicle",
      "Stay away from tall isolated trees",
      "Crouch low with feet together if caught outside",
      "Count seconds between lightning and thunder",
      "Wait 30 min after last thunder before going outside",
    ],
    donts: [
      "Don't stand under isolated trees in open areas",
      "Don't hold metal objects like umbrellas or golf clubs",
      "Don't stand in open fields, hilltops, or near water",
      "Don't use corded phones during a storm",
      "Don't shower or bathe — plumbing conducts electricity",
    ],
  },
  {
    id: "fire",
    label: "Fire",
    Icon: Flame,
    color: "text-eg-fire",
    border: "border-eg-fire/40",
    bg: "bg-eg-fire/10",
    image: `${ASSET_BASE}assets/generated/fire-safety.dim_600x400.jpg`,
    fallbackImage: `${ASSET_BASE}assets/generated/fire-safety.svg`,
    dos: [
      "Get out immediately — don't collect belongings",
      "Crawl low under smoke to breathe cleaner air",
      "Close doors behind you to slow fire spread",
      "Call 101 (Fire) once you're safely outside",
      "Meet at the designated assembly point",
    ],
    donts: [
      "Don't use elevators — use stairs only",
      "Don't open hot doors — fire may be on the other side",
      "Don't go back inside for any reason",
      "Don't hide in closets or under beds",
      "Don't use water on electrical fires — use CO₂ extinguisher",
    ],
  },
];

export function PreparednessGuide() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Essential Knowledge
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">
          Preparedness Guide
        </h1>
        <p className="text-muted-foreground mt-2">
          Do's &amp; Don'ts for major urban disasters. Know before disaster
          strikes.
        </p>
      </motion.div>

      <Tabs defaultValue="earthquake">
        <TabsList className="mb-8 bg-muted h-auto flex flex-wrap gap-1 p-1">
          {GUIDES.map(({ id, label, Icon, color }) => (
            <TabsTrigger
              key={id}
              value={id}
              data-ocid={`preparedness.${id}.tab`}
              className={`flex items-center gap-2 px-4 py-2 data-[state=active]:${color}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {GUIDES.map(
          ({ id, label, Icon, color, border, bg, image, fallbackImage, dos, donts }) => (
            <TabsContent key={id} value={id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`card-surface rounded-xl border-l-4 ${border} p-5 mb-6 flex items-center gap-4`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <div>
                    <h2 className={`font-display text-2xl font-bold ${color}`}>
                      {label} Safety
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Critical actions to protect yourself and others
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden mb-6 aspect-video relative">
                  <img
                    src={image}
                    onError={(e) => {
                      // If the "original" JPG isn't present, fall back to the SVG placeholder.
                      if (e.currentTarget.src.endsWith(fallbackImage)) return;
                      e.currentTarget.src = fallbackImage;
                    }}
                    alt={`${label} safety guide`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <Badge
                      className={`${bg} ${color} border ${border} font-bold uppercase tracking-wider text-xs`}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {label} Protocol
                    </Badge>
                  </div>
                </div>

                <div className="card-surface rounded-xl p-4 mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Quick Info
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    These steps are for immediate safety in the first minutes of an event.
                    Follow local authorities and official alerts whenever possible.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md border border-border bg-muted/30">
                      Police: 100
                    </span>
                    <span className="px-2 py-1 rounded-md border border-border bg-muted/30">
                      Fire: 101
                    </span>
                    <span className="px-2 py-1 rounded-md border border-border bg-muted/30">
                      Ambulance: 102
                    </span>
                    <span className="px-2 py-1 rounded-md border border-border bg-muted/30">
                      Emergency: 112
                    </span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="card-surface rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3 bg-green-500/10 border-b border-green-500/20">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <h3 className="font-bold text-green-400 uppercase tracking-wider text-sm">
                        Do's
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {dos.map((item, i) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          data-ocid={`preparedness.${id}.do.item.${i + 1}`}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground leading-relaxed">
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="card-surface rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3 bg-eg-red/10 border-b border-eg-red/20">
                      <XCircle className="w-5 h-5 text-eg-red" />
                      <h3 className="font-bold text-eg-red uppercase tracking-wider text-sm">
                        Don'ts
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {donts.map((item, i) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          data-ocid={`preparedness.${id}.dont.item.${i + 1}`}
                          className="flex items-start gap-3"
                        >
                          <XCircle className="w-4 h-4 text-eg-red flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          ),
        )}
      </Tabs>
    </main>
  );
}
