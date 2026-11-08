"use client";

import * as React from "react";
import { Sunrise, Waves, Mountain, Utensils, ArrowUpRight, ShieldCheck, Clock } from "lucide-react";

interface BentoItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  timeEstimate: string;
  conservationNote: string;
  icon: React.ElementType;
  span: string; // Tailwind grid span
}

const EXPERIENCES: BentoItem[] = [
  {
    id: "sunset-river",
    badge: "01 · ĐẶC QUYỀN BAN MAI",
    title: "Bình Minh Trên Sông Ngô Đồng",
    subtitle: "Thung lũng Tam Cốc lúc 05:45",
    description:
      "Lướt nhẹ trên mặt nước phẳng lặng như gương khi tia nắng đầu ngày rọi xiên qua làn sương núi, nhuộm vàng các dải lúa chín đôi bờ trước khi đoàn khách đông đổ về.",
    timeEstimate: "120 phút",
    conservationNote: "Hành trình 0 phát thải, bảo tồn độ tĩnh lặng sinh quyển",
    icon: Sunrise,
    span: "lg:col-span-8",
  },
  {
    id: "traditional-rowing",
    badge: "02 · DI SẢN BẢN ĐỊA",
    title: "Kỹ Thuật Chèo Đò Bằng Chân",
    subtitle: "Tinh hoa làng nghề truyền thống",
    description:
      "Tập tục điều khiển mái chèo bằng đôi chân điêu luyện của người chèo đò bản địa — nét văn hóa sinh hoạt sông nước độc nhất vô nhị vùng đồng bằng Bắc Bộ.",
    timeEstimate: "Suốt hải trình",
    conservationNote: "100% người chèo đò là cư dân bản địa được bảo hộ sinh kế",
    icon: Waves,
    span: "lg:col-span-4",
  },
  {
    id: "geological-caves",
    badge: "03 · KIẾN TẠO TRIỆU NĂM",
    title: "Vòm Hang Địa Chất Cổ",
    subtitle: "Hang Cả, Hang Hai, Hang Ba",
    description:
      "Xuyên qua các vòm hang đá vôi karst chìm ngập nước hàng triệu năm với luồng gió mát lạnh tự nhiên và các tầng nhũ đá buông rủ rêu phong kỳ vĩ.",
    timeEstimate: "45 phút xuyên hang",
    conservationNote: "Giữ nguyên trạng nhũ đá tự nhiên, không gắn đèn màu nhân tạo",
    icon: Mountain,
    span: "lg:col-span-4",
  },
  {
    id: "harvest-cuisine",
    badge: "04 · ẨM THỰC DI SẢN",
    title: "Hương Vị Mùa Gặt Đồng Chiêm",
    subtitle: "Nông sản hữu cơ thung lũng",
    description:
      "Thưởng thức mâm cơm niêu gạo mới dẻo thơm, cá rô đồng nướng than hoa cùng tách trà hoa sen ướp sớm trên bờ đê làng lộng gió.",
    timeEstimate: "Trải nghiệm ẩm thực",
    conservationNote: "Nguyên liệu canh tác tự nhiên không hóa chất vùng đệm",
    icon: Utensils,
    span: "lg:col-span-8",
  },
];

export function ExperienceBento() {
  return (
    <section className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-mono text-xs mb-3">
            <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span>TRẢI NGHIỆM ĐỘC BẢN TAM CỐC</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            CHẠM VÀO TINH HOA
            <br />
            <span className="text-amber-300">NON NƯỚC NINH BÌNH</span>
          </h2>
        </div>
        <p className="max-w-md text-sm text-zinc-300 font-sans leading-relaxed">
          Không tour đại trà xô bồ. Mỗi hành trình được thiết kế chậm rãi, tôn trọng nhịp sống tự nhiên và văn hóa bản địa lâu đời.
        </p>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {EXPERIENCES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`group relative rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-amber-400/40 hover:bg-zinc-900/70 shadow-lg ${item.span}`}
            >
              {/* Top Accent & Icon */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="font-mono text-xs text-amber-300 tracking-wider">
                    {item.badge}
                  </span>
                  <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-300 group-hover:border-amber-400/40 group-hover:bg-amber-400/10 transition-all">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h3>
                <div className="text-xs font-mono text-zinc-400 mb-4">
                  {item.subtitle}
                </div>

                <p className="text-sm text-zinc-300 font-sans leading-relaxed [text-wrap:pretty]">
                  {item.description}
                </p>
              </div>

              {/* Bottom Meta & Conservation Seal */}
              <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>{item.timeEstimate}</span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">{item.conservationNote}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

