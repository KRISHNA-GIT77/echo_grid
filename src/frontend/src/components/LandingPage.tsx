import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ChevronRight,
  Flame,
  MapPin,
  Radio,
  Waves,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onLoginClick: () => void;
  onNavigateDashboard: () => void;
  onNavigatePreparedness: () => void;
}

const stats = [
  { label: "Active Reports", value: "247", color: "text-eg-red" },
  { label: "Cities Covered", value: "12", color: "text-eg-cyan" },
  { label: "Responders Online", value: "1.8K", color: "text-eg-yellow" },
  { label: "Lives Impacted", value: "50K+", color: "text-eg-orange" },
];

const features = [
  {
    icon: Radio,
    color: "text-eg-cyan",
    bg: "bg-eg-cyan/10 border-eg-cyan/30",
    title: "Real-Time Crowdsourcing",
    desc: "Citizens report incidents via web or SMS. Data flows instantly into the live heatmap.",
  },
  {
    icon: MapPin,
    color: "text-eg-purple",
    bg: "bg-eg-purple/10 border-eg-purple/30",
    title: "Hyper-Local Mapping",
    desc: "GPS-precise incident pins and heat overlays show exactly where help is needed most.",
  },
  {
    icon: AlertTriangle,
    color: "text-eg-orange",
    bg: "bg-eg-orange/10 border-eg-orange/30",
    title: "Priority Alerts",
    desc: "Critical incidents bubble up instantly. Severity scoring guides first-responders.",
  },
  {
    icon: Zap,
    color: "text-eg-yellow",
    bg: "bg-eg-yellow/10 border-eg-yellow/30",
    title: "Multi-Hazard Coverage",
    desc: "Floods, earthquakes, fire, and lightning — unified platform for all urban emergencies.",
  },
];

export function LandingPage({
  onLoginClick,
  onNavigateDashboard,
  onNavigatePreparedness,
}: LandingPageProps) {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-60" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-eg-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-eg-orange/8 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-eg-orange/15 text-eg-orange border-eg-orange/30 font-semibold text-xs uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-eg-orange animate-pulse-slow mr-2" />
              Live Disaster Response Network
            </Badge>

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Stay Informed. Stay Safe.
            </p>

            <h1 className="font-display text-5xl sm:text-7xl font-bold leading-tight mb-6">
              <span className="text-foreground">Echo</span>
              <span className="text-eg-orange">-Grid</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              A crowdsourced hyper-local disaster response platform. Citizens
              report floods, earthquakes, fires, and blackouts in real-time —
              creating a live heatmap that bypasses slow official channels and
              gets help where it's needed most.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onNavigateDashboard}
                data-ocid="hero.primary_button"
                className="bg-eg-orange hover:bg-eg-orange/90 text-white font-semibold px-6 py-2.5 rounded-full glow"
              >
                View Live Map
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={onLoginClick}
                data-ocid="hero.login.button"
                className="border-border hover:bg-secondary text-foreground px-6 rounded-full"
              >
                Report an Incident
              </Button>
              <Button
                variant="ghost"
                onClick={onNavigatePreparedness}
                data-ocid="hero.preparedness.button"
                className="text-muted-foreground hover:text-foreground px-6 rounded-full"
              >
                Preparedness Guide
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="card-surface rounded-xl p-4">
                <div
                  className={`font-display text-3xl font-bold ${s.color} mb-1`}
                >
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Incident type banner */}
      <section className="border-y border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-6">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Monitors:
          </span>
          {[
            { icon: AlertTriangle, color: "text-eg-red", label: "Earthquake" },
            { icon: Waves, color: "text-eg-cyan", label: "Flood" },
            { icon: Zap, color: "text-eg-yellow", label: "Lightning" },
            { icon: Flame, color: "text-eg-fire", label: "Fire" },
          ].map(({ icon: Icon, color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-sm font-medium text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Platform Capabilities
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            How Echo-Grid Works
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, color, bg, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card-surface rounded-xl p-6"
            >
              <div
                className={`w-10 h-10 rounded-lg border ${bg} flex items-center justify-center mb-4`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="relative overflow-hidden card-surface rounded-2xl p-8 sm:p-12 text-center">
          <div className="absolute inset-0 grid-overlay opacity-30" />
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-eg-purple/15 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Ready to Protect Your City?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of citizens making urban disaster response faster,
              smarter, and more effective.
            </p>
            <Button
              onClick={onLoginClick}
              data-ocid="cta.login.button"
              size="lg"
              className="bg-eg-orange hover:bg-eg-orange/90 text-white font-bold uppercase tracking-wider px-8 rounded-full glow"
            >
              Get Started — It's Free
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
