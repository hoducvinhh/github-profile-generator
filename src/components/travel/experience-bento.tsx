"use client";

import * as React from "react";
import { Sunrise, Mountain, Landmark, Clock, ShieldCheck, Compass } from "lucide-react";

export function ExperienceBento() {
  return (
    <section
      id="trai-nghiem"
      className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 py-24 border-t border-white/[0.08]"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-mono text-xs mb-3">
            <Compass className="h-3.5 w-3.5" />
            <span>HÀNH TRÌNH TUYỂN CHỌN</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            BA TRẢI NGHIỆM ĐỘC BẢN
          </h2>
        </div>
        <p className="max-w-md text-sm text-zinc-300 font-sans leading-relaxed">
          Được thiết kế tinh tế theo nhịp điệu sinh hoạt bản địa, tôn trọng tối đa sự thanh tịnh và tính nguyên bản của khu di sản.
        </p>
      </div>

      {/* Asymmetric Bento Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Experience 01: A Journey Through the Golden Valley (Hero Large Visual, 8 Cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:border-amber-400/40 hover:bg-zinc-900/80 shadow-2xl relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <span className="font-mono text-xs font-bold text-amber-300 tracking-widest">
                01 · HÀI HÒA NON NƯỚC
              </span>
              <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-300 group-hover:bg-amber-400/10 transition-colors">
                <Sunrise className="h-4.5 w-4.5" />
              </div>
            </div>

            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-2 leading-tight">
              Hành Trình Thung Lũng Vàng
            </h3>
            <div className="text-xs font-mono text-zinc-400 mb-6">
              Thuyền nan sớm mai trên dòng Ngô Đồng (05:45 – 07:45)
            </div>

            <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed max-w-2xl [text-wrap:pretty]">
              Xuôi mái chèo nhẹ nhàng trên dòng nước tĩnh lặng khi nắng sớm vừa rọi xiên qua màn sương thung lũng, phản chiếu sắc vàng rực của mùa lúa chiêm đôi bờ. Bạn sẽ cảm nhận trọn vẹn sự giao hòa giữa lao động của người nông dân và thiên nhiên hùng vĩ trước khi các đoàn thuyền đông đúc bắt đầu xuất bến.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2 text-zinc-300">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>Thời lượng: 120 phút</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% Thuyền chèo thủ công, 0 khói bụi cơ giới</span>
            </div>
          </div>
        </div>

        {/* Experience 02: Ancient Limestone (Compact Column, 4 Cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-amber-400/40 hover:bg-zinc-900/80 shadow-2xl relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <span className="font-mono text-xs font-bold text-amber-300 tracking-widest">
                02 · ĐỊA CHẤT
              </span>
              <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-300 group-hover:bg-amber-400/10 transition-colors">
                <Mountain className="h-4.5 w-4.5" />
              </div>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
              Kỳ Quan Đá Vôi Cổ Đại
            </h3>
            <div className="text-xs font-mono text-zinc-400 mb-4">
              Xuyên lòng Hang Cả, Hang Hai, Hang Ba
            </div>

            <p className="text-sm text-zinc-300 font-sans leading-relaxed [text-wrap:pretty]">
              Len lỏi dưới những vòm hang ngập nước rêu phong mát rượi, chiêm ngưỡng các nhũ đá karst buông rủ kỳ thú và lắng nghe tiếng giọt nước thánh thót rơi từ trần hang triệu năm tuổi.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="text-emerald-400">Không gắn đèn màu nhân tạo</span>
          </div>
        </div>

        {/* Experience 03: A Living Heritage (Full-Width Editorial Ribbon, 12 Cols) */}
        <div className="lg:col-span-12 rounded-3xl border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-8 sm:p-10 transition-all duration-300 hover:border-amber-400/40 hover:bg-zinc-900/80 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 group">
          <div className="lg:max-w-3xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs font-bold text-amber-300 tracking-widest">
                03 · DI SẢN SỐNG
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-600" />
              <span className="font-mono text-xs text-zinc-400">KIẾN TRÚC &amp; VĂN HÓA BẢN ĐỊA</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              Chùa Bích Động &amp; Nếp Làng Cổ Truyền
            </h3>

            <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed [text-wrap:pretty]">
              Khám phá ngôi chùa cổ tam cấp xây dựng từ thế kỷ 15 nương theo vách núi đá vôi u tịch, dạo bước qua cầu đá hoa sen và giao lưu cùng các nghệ nhân làng thêu ren Văn Lâm nằm yên bình nơi cửa ngõ di sản.
            </p>
          </div>

          <div className="shrink-0 p-5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-2 text-xs font-mono">
            <div className="text-amber-300 font-bold">LỜI KHUYÊN DU KHÁCH</div>
            <div className="text-zinc-300">Trang phục kín đáo khi vào chùa</div>
            <div className="text-zinc-400">Thời điểm thích hợp: Buổi chiều tĩnh lặng</div>
          </div>
        </div>
      </div>
    </section>
  );
}
