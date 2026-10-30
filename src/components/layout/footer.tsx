import * as React from "react";
import Link from "next/link";
import { Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-6 text-xs text-muted-foreground">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-1.5">
          <span>Crafted with</span>
          <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
          <span>for developers worldwide. Open source on GitHub.</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/builder"
            className="hover:text-foreground transition-colors"
          >
            Builder
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
