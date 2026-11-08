"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUp, ArrowLeft, ShieldCheck, ExternalLink } from "lucide-react";

export function TravelFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-20 w-full border-t border-white/[0.08] bg-[#050806] px-4 sm:px-8 py-16 text-xs font-mono text-zinc-400">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Grid: Brand & Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Purpose */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold tracking-widest text-lg uppercase text-white">
                TRÀNG AN
              </span>
              <span className="text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded border border-amber-400/40 bg-amber-400/10">
                THE SOUL OF VIETNAM
              </span>
            </div>

            <p className="text-zinc-300 font-sans text-sm max-w-md leading-relaxed">
              Dự án giới thiệu phi thương mại nhằm tôn vinh giá trị cảnh quan, địa chất và chiều sâu văn hóa truyền thống của Quần thể Danh thắng Tràng An – Ninh Bình.
            </p>

            <div className="flex items-center gap-2 text-emerald-400 text-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>Cam kết 100% du lịch bền vững và bảo tồn thiên nhiên vùng lõi di sản.</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-white font-bold tracking-wider uppercase text-[11px]">
              KHÁM PHÁ
            </div>
            <ul className="space-y-2 text-zinc-400 font-mono">
              <li>
                <a href="#gioi-thieu" className="hover:text-amber-300 transition-colors">
                  Di Sản Tràng An (UNESCO)
                </a>
              </li>
              <li>
                <a href="#goc-nhin" className="hover:text-amber-300 transition-colors">
                  Ba Góc Nhìn Gắn Kết
                </a>
              </li>
              <li>
                <a href="#trai-nghiem" className="hover:text-amber-300 transition-colors">
                  Trải Nghiệm Tuyển Chọn
                </a>
              </li>
              <li>
                <a href="#mua-vang" className="hover:text-amber-300 transition-colors">
                  Nhịp Điệu Bốn Mùa
                </a>
              </li>
              <li>
                <a href="#hanh-trinh" className="hover:text-amber-300 transition-colors">
                  Gợi Ý Lộ Trình Du Lịch
                </a>
              </li>
            </ul>
          </div>

          {/* Sources & Citations */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-white font-bold tracking-wider uppercase text-[11px]">
              NGUỒN TƯ LIỆU XÁC THỰC
            </div>
            <ul className="space-y-2 text-zinc-400 font-mono text-[11px]">
              <li>
                <a
                  href="https://whc.unesco.org/en/list/1438"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span>UNESCO World Heritage Centre</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>Ban Quản lý Quần thể Danh thắng Tràng An</li>
              <li>Viện Khoa học Địa chất và Khoáng sản Việt Nam</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Trang An Landscape Complex. Tuyệt tác Di sản Non Nước Việt Nam.
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Về ProfileForge Studio</span>
            </Link>

            <button
              type="button"
              onClick={scrollToTop}
              className="text-zinc-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>LÊN ĐẦU TRANG</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
