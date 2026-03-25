import { Grid3X3, Heart } from "lucide-react";
import { SiGithub, SiX } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);

  return (
    <footer className="border-t border-border bg-sidebar mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-eg-purple/20 border border-eg-purple/40 flex items-center justify-center">
              <Grid3X3 className="w-3.5 h-3.5 text-eg-purple" />
            </div>
            <span className="font-display font-bold text-base">
              Echo<span className="text-eg-orange">-Grid</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">
              About
            </span>
            <span className="hover:text-foreground transition-colors cursor-pointer">
              Contact
            </span>
            <span className="hover:text-foreground transition-colors cursor-pointer">
              Privacy
            </span>
            <span className="hover:text-foreground transition-colors cursor-pointer">
              Map Data
            </span>
            <span className="hidden sm:block text-border">|</span>
            <span className="font-medium text-muted-foreground">
              Partners: NDMA · IMD · SDRF
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <SiGithub size={16} />
            </span>
            <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <SiX size={14} />
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {year} Echo-Grid. All rights reserved.</span>
          <span>
            Built with <Heart className="w-3 h-3 inline text-eg-orange" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
