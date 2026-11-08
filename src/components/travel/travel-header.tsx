"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Menu, X } from "lucide-react";

export function TravelHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: "#gioi-thieu", label: "DI SẢN TRÀNG AN" },
    { href: "#goc-nhin", label: "BA GÓC NHÌN" },
    { href: "#trai-nghiem", label: "TRẢI NGHIỆM" },
    { href: "#mua-vang", label: "MÙA NON NƯỚC" },
    { href: "#thong-so", label: "SỐ LIỆU UNESCO" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-[#080d0a]/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            title="Quay lại ProfileForge Studio"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">PROFILEFORGE</span>
          </Link>

          <div className="h-4 w-[1px] bg-white/20 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-serif font-bold tracking-widest text-lg uppercase text-white drop-shadow">
              TRÀNG AN
            </span>
            <span className="text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded border border-amber-400/40 bg-amber-400/10 tracking-wider hidden md:inline">
              UNESCO WORLD HERITAGE
            </span>
          </div>
        </div>

        {/* Desktop Navigation Anchors */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden lg:flex items-center gap-6 text-xs font-mono tracking-wider text-zinc-300"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-amber-300 transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Primary Action Button */}
        <div className="flex items-center gap-3">
          <a
            href="#hanh-trinh"
            className="h-9 px-5 rounded-full bg-amber-400 text-zinc-950 font-serif font-bold text-xs uppercase tracking-widest hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>LẬP KẾ HOẠCH</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-9 w-9 rounded-lg border border-white/15 bg-white/5 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu điều hướng"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 mt-3 pt-4 pb-2 px-2 flex flex-col gap-3 font-mono text-xs">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-zinc-300 hover:text-amber-300 hover:bg-white/5 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
