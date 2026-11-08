"use client";

import * as React from "react";
import { Waves, Mountain, Landmark, ArrowRight } from "lucide-react";

interface Perspective {
  number: string;
  category: string;
  title: string;
  subtitle: string;
  narrative: string[];
  keyHighlight: string;
  icon: React.ElementType;
}

const PERSPECTIVES: Perspective[] = [
  {
    number: "01",
    category: "DÒNG CHẢY SINH MỆNH",
    title: "DÒNG SÔNG NGÔ ĐỒNG",
    subtitle: "Mạch nguồn thung lũng lúa vàng",
    narrative: [
      "Không giống như những dòng sông thông thường, Ngô Đồng là một dải lụa nước ngọc bích êm ả lượn mình qua lòng thung lũng hẹp, hai bên là những thửa ruộng lúa nước của cư dân Tam Cốc.",
      "Vào mùa chiêm (tháng 5 và tháng 6), sắc xanh non tơ chuyển dần sang thảm vàng óng ả trĩu hạt. Trên mặt nước phẳng lặng, những chiếc thuyền nan mộc mạc do người bản địa dùng đôi chân chèo nhẹ nhàng rẽ sóng, chở theo nhịp sống thanh bình ngàn đời.",
    ],
    keyHighlight: "Hải trình 2 giờ bằng thuyền nan truyền thống, không khói bụi cơ giới",
    icon: Waves,
  },
  {
    number: "02",
    category: "KIẾN TẠO TRIỆU NĂM",
    title: "VÁCH ĐÁ & VÒM HANG",
    subtitle: "Chứng tích địa mạo Karst nhiệt đới",
    narrative: [
      "Hệ thống tháp đá vôi tại Tam Cốc và Tràng An là kết quả của hơn 250 triệu năm kiến tạo địa chất. Dưới tác động bào mòn của nước mưa và các đợt biển tràn kỷ Đệ Tứ, các vách núi dựng đứng sừng sững ôm trọn lấy những thung lũng biệt lập.",
      "Xuyên qua Hang Cả dài 127m, Hang Hai dài 60m và Hang Ba dài 50m, du khách sẽ cảm nhận bầu không khí mát lạnh tự nhiên, nơi những nhũ đá buông rủ rêu phong vẫn đang tiếp tục hình thành giọt nước qua từng thế kỷ.",
    ],
    keyHighlight: "Hiện tượng tháp Karst ngập nước độc nhất vô nhị trên thế giới",
    icon: Mountain,
  },
  {
    number: "03",
    category: "VĂN HÓA CỐ ĐÔ",
    title: "CHÙA BÍCH ĐỘNG & NẾP LÀNG CỔ",
    subtitle: "Nam thiên đệ nhị động",
    narrative: [
      "Được xây dựng từ thời Hậu Lê (1428), Chùa Bích Động là công trình kiến trúc Phật giáo cổ tựa lưng hoàn toàn vào lòng vòm núi đá với ba tầng Hạ, Trung và Thượng uy nghiêm ẩn hiện giữa tán cây xanh cổ thụ.",
      "Bao bọc quanh di tích là nếp sống thuần nông chân chất của các làng nghề thêu ren Văn Lâm, nơi con người chung sống hòa thuận với thiên nhiên, gìn giữ tôn nghiêm cho từng tấc đất di sản.",
    ],
    keyHighlight: "Kiến trúc chùa gỗ ba tầng độc đáo xây dựng nương theo địa hình hang núi",
    icon: Landmark,
  },
];

export function HeritagePerspectives() {
  const [activeTab, setActiveTab] = React.useState<number>(0);

  const active = PERSPECTIVES[activeTab];
  const Icon = active.icon;

  return (
    <section
      id="goc-nhin"
      className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 py-24 border-t border-white/[0.08]"
    >
      {/* Section Header */}
      <div className="mb-14 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-mono text-xs mb-3">
          <span>BA GÓC NHÌN GẮN KẾT</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          CẢNH SẮC · ĐỊA CHẤT · DI SẢN
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
          Ninh Bình không chỉ là một điểm dừng chân ngắm cảnh, mà là sự đan cài bền chặt giữa con người, dòng chảy và những vách núi cổ đại.
        </p>
      </div>

      {/* 3 Perspectives Tabs */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Tab Selectors */}
        <div className="w-full lg:w-5/12 flex flex-col gap-3">
          {PERSPECTIVES.map((item, idx) => {
            const ItemIcon = item.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={item.number}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`p-6 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? "border-amber-400/40 bg-zinc-900/90 shadow-xl"
                    : "border-white/10 bg-zinc-950/40 hover:border-white/25 hover:bg-zinc-900/40"
                }`}
              >
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />
                )}
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span
                    className={`font-mono text-xs font-bold tracking-widest ${
                      isSelected ? "text-amber-300" : "text-zinc-500"
                    }`}
                  >
                    {item.number} · {item.category}
                  </span>
                  <ItemIcon
                    className={`h-4 w-4 ${
                      isSelected ? "text-amber-400" : "text-zinc-500"
                    }`}
                  />
                </div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {item.title}
                </div>
                <div className="text-xs font-mono text-zinc-400 mt-1">
                  {item.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: In-Depth Editorial Narrative Card */}
        <div className="w-full lg:w-7/12 rounded-3xl border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-8 sm:p-12 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[460px]">
          {/* Subtle Ambient Watermark */}
          <div className="absolute right-6 -bottom-6 font-serif text-[120px] font-black text-white/[0.03] select-none pointer-events-none">
            {active.number}
          </div>

          <div>
            <div className="flex items-center gap-2.5 font-mono text-xs text-amber-300 mb-4 tracking-wider">
              <Icon className="h-4 w-4" />
              <span>{active.category}</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
              {active.title}
            </h3>
            <div className="text-xs font-mono text-zinc-400 mb-6 pb-6 border-b border-white/10">
              {active.subtitle}
            </div>

            <div className="space-y-4 text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
              {active.narrative.map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4 text-xs font-mono text-amber-300/90">
            <span className="line-clamp-2">⭐ {active.keyHighlight}</span>
            <span className="shrink-0 text-zinc-400">TRÀNG AN HERITAGE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
