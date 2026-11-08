"use client";

import * as React from "react";
import { Compass, Clock, MapPin, Car, Sparkles, Check, ChevronRight } from "lucide-react";

interface ItineraryOption {
  days: number;
  label: string;
  sublabel: string;
  summary: string;
  schedule: Array<{ time: string; activity: string; location: string }>;
}

const ITINERARIES: ItineraryOption[] = [
  {
    days: 1,
    label: "1 NGÀY TINH HOA",
    sublabel: "Khởi hành từ Hà Nội sáng sớm",
    summary: "Dành trọn vẹn một ngày chiêm ngưỡng hai thắng cảnh biểu tượng của Ninh Bình.",
    schedule: [
      { time: "06:00 – 07:30", activity: "Di chuyển từ Hà Nội đi Ninh Bình (90 phút cao tốc)", location: "Cao tốc Hà Nội – Ninh Bình" },
      { time: "08:00 – 10:15", activity: "Chèo thuyền nan thưởng ngoạn sông Ngô Đồng qua ba hang", location: "Khu du lịch Tam Cốc" },
      { time: "11:30 – 13:00", activity: "Thưởng thức ẩm thực địa phương (cơm cháy, thịt dê truyền thống)", location: "Khu vực cố đô Hoa Lư" },
      { time: "14:00 – 16:30", activity: "Viếng thăm Cố đô Hoa Lư & Chùa Bích Động cổ kính", location: "Chùa Bích Động" },
      { time: "17:00 – 18:30", activity: "Khởi hành về lại Hà Nội trong ánh hoàng hôn", location: "Trở về Hà Nội" },
    ],
  },
  {
    days: 2,
    label: "2 NGÀY THƯ GIÃN (KHUYÊN DÙNG)",
    sublabel: "Trọn vẹn nhịp sống làng quê",
    summary: "Lựa chọn lý tưởng nhất để đón bình minh sớm tại Tam Cốc và khám phá Tràng An sâu sắc.",
    schedule: [
      { time: "Ngày 1 · Sáng", activity: "Hải trình thuyền nan Tràng An (Tuyến 2 hoặc Tuyến 3 xuyên hang)", location: "Quần thể danh thắng Tràng An" },
      { time: "Ngày 1 · Chiều", activity: "Đón hoàng hôn trên đỉnh Hang Múa nhìn toàn cảnh thung lũng", location: "Hang Múa" },
      { time: "Ngày 2 · Sớm mai", activity: "Thuyền chuyến sớm Tam Cốc lúc 06:00 ngắm sương sớm trên sông", location: "Sông Ngô Đồng" },
      { time: "Ngày 2 · Trưa", activity: "Đạp xe qua làng thêu Văn Lâm và viếng Chùa Bích Động", location: "Bích Động" },
    ],
  },
  {
    days: 3,
    label: "3 NGÀY CHIỀU SÂU",
    sublabel: "Hành trình di sản toàn diện",
    summary: "Khám phá cả di sản thiên nhiên, văn hóa lịch sử tâm linh và rừng nguyên sinh Cúc Phương.",
    schedule: [
      { time: "Ngày 1", activity: "Tràng An – Cố đô Hoa Lư – Đền vua Đinh, vua Lê", location: "Hoa Lư" },
      { time: "Ngày 2", activity: "Tam Cốc thung lũng vàng – Bích Động – Đầm sen", location: "Tam Cốc" },
      { time: "Ngày 3", activity: "Vườn quốc gia Cúc Phương – Cây chò ngàn năm & Động Người Xưa", location: "Vườn Quốc gia Cúc Phương" },
    ],
  },
];

export function JourneyCTA() {
  const [selectedDays, setSelectedDays] = React.useState<number>(2);

  const currentItinerary =
    ITINERARIES.find((it) => it.days === selectedDays) || ITINERARIES[1];

  return (
    <section
      id="hanh-trinh"
      className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 py-24 border-t border-white/[0.08]"
    >
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-950/80 via-zinc-900/50 to-zinc-950/90 backdrop-blur-2xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
        {/* Glow ambient accent */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-mono text-xs mb-4">
            <Compass className="h-3.5 w-3.5" />
            <span>LẬP KẾ HOẠCH HÀNH TRÌNH</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.05]">
            YOUR JOURNEY
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">
              BEGINS HERE.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-300 font-serif leading-relaxed">
            Khám phá vẻ đẹp Ninh Bình theo cách của riêng bạn.
          </p>

          <p className="mt-2 text-sm text-zinc-400 font-sans leading-relaxed">
            Khoảng cách từ Hà Nội: 95 km (chỉ khoảng 90 phút di chuyển bằng ô tô hoặc xe limousine qua đường cao tốc Cầu Giẽ – Ninh Bình).
          </p>
        </div>

        {/* Days Selector Tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {ITINERARIES.map((item) => (
            <button
              key={item.days}
              type="button"
              onClick={() => setSelectedDays(item.days)}
              className={`h-11 px-6 rounded-full font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 ${
                selectedDays === item.days
                  ? "bg-amber-400 text-zinc-950 shadow-lg"
                  : "bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Interactive Itinerary Box */}
        <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <div className="text-xs font-mono text-amber-300 uppercase tracking-widest font-semibold">
                GỢI Ý LỘ TRÌNH TỐI ƯU
              </div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                {currentItinerary.sublabel}
              </div>
            </div>
            <div className="text-xs font-mono text-zinc-400">
              {currentItinerary.summary}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4 font-sans text-sm">
            {currentItinerary.schedule.map((slot, sIdx) => (
              <div
                key={sIdx}
                className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
              >
                <div className="sm:w-36 shrink-0 font-mono text-xs text-amber-300/90 font-semibold flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>{slot.time}</span>
                </div>
                <div className="flex-1 text-zinc-200">
                  {slot.activity}
                </div>
                <div className="sm:w-48 shrink-0 font-mono text-xs text-zinc-400 flex items-center gap-1.5 sm:justify-end">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{slot.location}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Helpful practical transportation note */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Phương tiện khuyên dùng: Xe Limousine đón tận nơi tại Hà Nội hoặc tàu hỏa ga Ninh Bình.</span>
            </div>

            <div className="text-zinc-500 text-[11px]">
              Tự do tùy biến theo lịch trình cá nhân
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
