"use client";

import * as React from "react";
import { Calendar, Sun, Cloud, Eye, Compass, Info, CheckCircle2 } from "lucide-react";

interface SeasonInfo {
  id: string;
  name: string;
  period: string;
  badge: string;
  landscapeDescription: string;
  riceHarvestStatus: string;
  recommendedActivities: string[];
  climateExpectation: string;
  practicalTips: string[];
}

const SEASONS: SeasonInfo[] = [
  {
    id: "golden-harvest",
    name: "Mùa Lúa Chín Vàng",
    period: "Tháng 5 – Đầu Tháng 6",
    badge: "MÙA ĐẸP NHẤT TRONG NĂM",
    landscapeDescription:
      "Cả thung lũng Tam Cốc bừng sáng trong sắc vàng óng ả của cánh đồng lúa chiêm trĩu hạt. Dòng sông Ngô Đồng như một dải lụa mềm vắt qua thảm vàng rực rỡ, phản chiếu các vách núi đá vôi sừng sững.",
    riceHarvestStatus: "Gặt rộ vào khoảng cuối tháng 5 đến ngày 10 tháng 6",
    recommendedActivities: [
      "Đi thuyền nan Tam Cốc chuyến sớm lúc 05:45 – 07:00",
      "Săn ảnh toàn cảnh từ đỉnh Hang Múa nhìn xuống thung lũng lúa",
      "Đạp xe trên đường đê làng giữa hai thảm lúa vàng thoảng hương cốm mới",
    ],
    climateExpectation: "Nắng nhiều, trời trong xanh, nhiệt độ ban ngày dao động 28°C – 34°C.",
    practicalTips: [
      "Nên mang theo mũ cói, nón lá, kem chống nắng và nước uống đầy đủ.",
      "Thời điểm lúa vàng kéo dài khoảng 2-3 tuần, nên theo dõi sát lịch gặt thực tế của địa phương.",
    ],
  },
  {
    id: "lotus-summer",
    name: "Mùa Sen Nở & Non Nước",
    period: "Tháng 7 – Tháng 8",
    badge: "SẮC HỒNG DƯỚI CHÂN NÚI",
    landscapeDescription:
      "Sau mùa gặt, các thửa ruộng trở thành đầm nước trong vắt phẳng lặng. Dưới chân vòm núi Hang Múa và Bích Động, hàng ngàn búp sen hồng, sen trắng đồng loạt bung nở tỏa hương thơm mát lành giữa đất trời cố đô.",
    riceHarvestStatus: "Ruộng ngập nước nghỉ vụ, chờ chuẩn bị mùa vụ mới",
    recommendedActivities: [
      "Thưởng ngoạn đầm sen chân núi Bích Động lúc sáng sớm trước 07:30",
      "Chèo thuyền thám hiểm các hang ngập nước Tràng An tránh nắng hè",
      "Thưởng thức trà sen và hạt sen tươi ướp sương ban mai",
    ],
    climateExpectation: "Mùa hè nhiệt đới, có những cơn mưa rào ngắn làm dịu không khí, nhiệt độ 29°C – 35°C.",
    practicalTips: [
      "Chuẩn bị áo mưa mỏng nhẹ hoặc ô dù chống nắng mưa.",
      "Nên ghé thăm vào sáng sớm để đón lúc hoa sen thơm ngát và bung nở trọn vẹn nhất.",
    ],
  },
  {
    id: "autumn-mist",
    name: "Mùa Thu Sương Mây",
    period: "Tháng 9 – Tháng 11",
    badge: "THANH TỊNH & VẮNG KHÁCH",
    landscapeDescription:
      "Mùa thu đem đến làn gió heo may mát mẻ và những dải sương mỏng manh quấn quanh đỉnh các vách tháp karst vào sáng sớm. Cảnh vật chìm trong sự tĩnh lặng thanh tịnh, nước sông trong đến độ nhìn thấy từng nhánh rong đuôi chồn.",
    riceHarvestStatus: "Mùa thu hoạch vụ mùa (cuối tháng 9 – tháng 10 ở một số thung lũng)",
    recommendedActivities: [
      "Hành trình thuyền tĩnh tâm Tràng An trong không gian vắng khách yên bình",
      "Viếng thăm Chùa Bích Động tĩnh mịch đón tiếng chuông chùa chiều buông",
      "Đi bộ dạo bước qua các lối mòn làng cổ không gian lộng gió",
    ],
    climateExpectation: "Thời tiết dịu mát, độ ẩm dễ chịu, ít mưa, nhiệt độ lý tưởng 22°C – 27°C.",
    practicalTips: [
      "Mang theo một chiếc áo khoác gió mỏng cho buổi sáng sớm và chiều muộn.",
      "Mùa lý tưởng nhất cho những ai yêu thích sự yên tĩnh và trải nghiệm chiều sâu.",
    ],
  },
  {
    id: "spring-festival",
    name: "Mùa Xuân Trẩy Hội",
    period: "Tháng 1 – Tháng 3",
    badge: "KHÍ XUÂN & CỐ ĐÔ TÂM LINH",
    landscapeDescription:
      "Cây cối đâm chồi nảy lộc mơn mởn trên các triền đá vôi cổ kính. Cả vùng đất Tràng An – Hoa Lư rộn ràng với các nghi thức rước nước truyền thống trên sông và lễ hội đền Thái Vi linh thiêng.",
    riceHarvestStatus: "Mùa mạ non mới cấy xanh mướt trải dài thung lũng",
    recommendedActivities: [
      "Tham gia lễ hội văn hóa truyền thống đền Thái Vi và đền Vua Đinh – Vua Lê",
      "Du xuân vãn cảnh sông nước cầu may mắn đầu năm",
      "Ngắm nhìn bức tranh mạ non xanh ngắt dưới làn mưa xuân phơi phới",
    ],
    climateExpectation: "Mát mẻ, có lúc se lạnh và lất phất mưa phùn mùa xuân, nhiệt độ 16°C – 22°C.",
    practicalTips: [
      "Mùa cao điểm lễ hội đầu năm, nên khởi hành thật sớm để có chuyến đò thanh thản.",
      "Mặc trang phục lịch sự, trang trọng khi viếng thăm các đền chùa cổ kính.",
    ],
  },
];

export function SeasonPlanner() {
  const [selectedSeasonId, setSelectedSeasonId] = React.useState<string>("golden-harvest");

  const currentSeason = SEASONS.find((s) => s.id === selectedSeasonId) || SEASONS[0];

  return (
    <section
      id="mua-vang"
      className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 py-24 border-t border-white/[0.08]"
    >
      <div className="mb-14 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-mono text-xs mb-3">
          <Calendar className="h-3.5 w-3.5" />
          <span>NHỊP ĐIỆU BỐN MÙA</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          NINH BÌNH QUA CÁC MÙA
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
          Mỗi mùa trong năm, Quần thể danh thắng Tràng An lại khoác lên mình một diện mạo thị giác và nhịp điệu sinh thái riêng biệt. Hãy chọn thời điểm phù hợp nhất với mong muốn khám phá của bạn.
        </p>
      </div>

      {/* Season Selection Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {SEASONS.map((season) => {
          const isSelected = selectedSeasonId === season.id;
          return (
            <button
              key={season.id}
              type="button"
              onClick={() => setSelectedSeasonId(season.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[96px] ${
                isSelected
                  ? "border-amber-400/50 bg-amber-400/10 text-white shadow-lg"
                  : "border-white/10 bg-zinc-950/40 text-zinc-400 hover:text-white hover:border-white/25"
              }`}
            >
              <div className="font-mono text-[11px] text-amber-300/90 font-semibold uppercase">
                {season.period}
              </div>
              <div className="font-serif text-base sm:text-lg font-bold text-white mt-1">
                {season.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Season Card */}
      <div className="rounded-3xl border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-8 sm:p-12 shadow-2xl space-y-8">
        {/* Card Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="text-xs font-mono text-amber-300 tracking-widest font-semibold uppercase mb-1">
              {currentSeason.badge} · {currentSeason.period}
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              {currentSeason.name}
            </h3>
          </div>

          <div className="text-xs font-mono text-zinc-400 p-3 rounded-xl bg-white/[0.03] border border-white/10 max-w-sm">
            <div className="text-zinc-300 font-bold mb-0.5">🌾 Tình trạng vụ mùa:</div>
            <div>{currentSeason.riceHarvestStatus}</div>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-sm sm:text-base text-zinc-200 font-sans leading-relaxed [text-wrap:pretty]">
          {currentSeason.landscapeDescription}
        </p>

        {/* Two-Column Grid: Activities & Practical Travel Considerations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {/* Recommended Activities */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Compass className="h-4 w-4" />
              <span>TRẢI NGHIỆM ĐỀ XUẤT</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300 font-sans">
              {currentSeason.recommendedActivities.map((act, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Climate & Practical Considerations */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>THỜI TIẾT THAM KHẢO &amp; LƯU Ý</span>
            </h4>
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-mono text-zinc-300 space-y-2">
              <div>
                <strong className="text-white">Khí hậu:</strong> {currentSeason.climateExpectation}
              </div>
              <div className="text-zinc-400 text-[11px]">
                *(Lưu ý: Thời tiết mang tính chất tham khảo chung theo mùa, không phải dự báo trực tiếp).*
              </div>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-300 font-sans">
              {currentSeason.practicalTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
