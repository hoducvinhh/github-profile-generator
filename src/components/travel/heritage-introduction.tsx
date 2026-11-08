"use client";

import * as React from "react";
import { Landmark, Compass, Award, Globe } from "lucide-react";

export function HeritageIntroduction() {
  return (
    <section
      id="gioi-thieu"
      className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 py-24 border-t border-white/[0.08]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Editorial Lead & Authoritative Inscription */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-mono text-xs">
            <Landmark className="h-3.5 w-3.5" />
            <span>QUẦN THỂ DI SẢN THẾ GIỚI</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            NƠI GIAO HÒA
            <br />
            <span className="text-amber-300">VĂN HÓA &amp; THIÊN NHIÊN</span>
          </h2>

          <p className="text-base text-zinc-300 font-sans leading-relaxed [text-wrap:pretty]">
            Nằm ở rìa phía nam của đồng bằng châu thổ sông Hồng, Quần thể danh thắng Tràng An là một cảnh quan tháp karst nhiệt đới kỳ vĩ bị chia cắt bởi các thung lũng nông và mạng lưới hang động ngập nước liên kết chằng chịt.
          </p>

          <div className="p-5 rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-md space-y-3 font-mono text-xs text-zinc-300">
            <div className="text-amber-300 font-bold tracking-wider uppercase text-[11px]">
              ĐẶC TÍNH ĐỊA LÝ &amp; BẢO TỒN (UNESCO 2014)
            </div>
            <p className="text-zinc-400 leading-relaxed font-sans text-xs">
              Tam Cốc – Bích Động là một bộ phận cấu thành trọng yếu của Quần thể Tràng An, nơi dòng sông Ngô Đồng tự nhiên tạo nên trục kết nối sinh thái giữa hệ thống núi đá vôi và vùng đất nông nghiệp ngập nước truyền thống.
            </p>
          </div>
        </div>

        {/* Right Column: In-Depth Narrative & Verified Metrics Grid */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4 text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
            <p>
              Được UNESCO chính thức ghi danh vào Danh mục Di sản Thế giới năm 2014, Tràng An là <strong className="text-white font-semibold">Di sản Hỗn hợp (Mixed Heritage) đầu tiên và duy nhất của Việt Nam và toàn khu vực Đông Nam Á</strong> đáp ứng cả hai nhóm tiêu chuẩn khắt khe về Văn hóa (Tiêu chí v) và Thiên nhiên (Tiêu chí vii, viii).
            </p>
            <p>
              Các cuộc khai quật khảo cổ trong nhiều thập kỷ qua đã khẳng định dấu vết sinh sống liên tục của các cộng đồng người tiền sử từ hơn 30.000 năm trước. Họ đã kiên cường thích ứng với các biến động môi trường khắc nghiệt, đặc biệt là giai đoạn biển tiến và biển thoái cuối cùng trong kỷ Đệ Tứ.
            </p>
          </div>

          {/* Editorial Metric Quadrant (Verified UNESCO Data Only) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 font-mono">
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="text-xs text-zinc-400">NĂM GHI DANH</div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-300 mt-1">
                2014
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">UNESCO Criterion v, vii, viii</div>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="text-xs text-zinc-400">VÙNG LÕI BẢO VỆ</div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                6,226 <span className="text-xs font-mono text-zinc-400 font-normal">ha</span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Khu bảo tồn nguyên vẹn</div>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] col-span-2 sm:col-span-1">
              <div className="text-xs text-zinc-400">VÙNG ĐỆM SINH THÁI</div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-300 mt-1">
                6,026 <span className="text-xs font-mono text-zinc-400 font-normal">ha</span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Hài hòa sinh kế bản địa</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
