"use client";

import * as React from "react";
import { Award, Clock, MapPin, Shield, BookOpen } from "lucide-react";

interface FactItem {
  number: string;
  label: string;
  detail: string;
  citation: string;
}

const FACTS: FactItem[] = [
  {
    number: "2014",
    label: "NĂM GHI DANH UNESCO",
    detail:
      "Chính thức được Ủy ban Di sản Thế giới ghi danh tại kỳ họp thứ 38 (Doha, Qatar), trở thành Di sản Hỗn hợp đầu tiên của Việt Nam và Đông Nam Á.",
    citation: "UNESCO World Heritage Convention",
  },
  {
    number: "250 Tr",
    label: "LỊCH SỬ KIẾN TẠO KARST (NĂM)",
    detail:
      "Cảnh quan tháp karst nhiệt đới trải qua hơn 250 triệu năm biến đổi địa mạo phức tạp, là ví dụ nổi bật toàn cầu về giai đoạn cuối của sự tiến hóa karst.",
    citation: "UNESCO Criterion viii (Địa chất)",
  },
  {
    number: "30,000",
    label: "DẤU TÍCH NGƯỜI TIỀN SỬ (NĂM)",
    detail:
      "Các tầng văn hóa khảo cổ phong phú trong các hang đá chứng minh các nhóm cư dân cổ đã thích ứng xuất sắc trước biến động ngập mặn kỷ Đệ Tứ.",
    citation: "UNESCO Criterion v (Văn hóa)",
  },
  {
    number: "6,226",
    label: "VÙNG LÕI BẢO VỆ NGUYÊN VẸN (HA)",
    detail:
      "Bao gồm ba khu vực gắn kết: Khu di tích lịch sử cố đô Hoa Lư, Danh thắng Tam Cốc – Bích Động và Khu du lịch sinh thái Tràng An.",
    citation: "Quyết định phê duyệt ranh giới Di sản",
  },
];

export function HeritageFacts() {
  return (
    <section
      id="thong-so"
      className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 py-24 border-t border-white/[0.08]"
    >
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-mono text-xs mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          <span>SỐ LIỆU XÁC THỰC</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          CHỨNG TÍCH LỊCH SỬ &amp; ĐỊA CHẤT
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-300 font-sans max-w-2xl leading-relaxed">
          Tất cả thông số được trích xuất trực tiếp từ hồ sơ đề cử và quyết định ghi danh của Tổ chức Giáo dục, Khoa học và Văn hóa Liên Hợp Quốc (UNESCO).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FACTS.map((fact) => (
          <div
            key={fact.label}
            className="p-8 rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-xl flex flex-col justify-between hover:border-amber-400/30 transition-all duration-300 shadow-xl"
          >
            <div>
              <div className="font-serif text-4xl sm:text-5xl font-bold text-amber-300 tracking-tight mb-2">
                {fact.number}
              </div>
              <div className="font-mono text-xs font-semibold text-white tracking-wider mb-4 pb-4 border-b border-white/10">
                {fact.label}
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                {fact.detail}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 font-mono text-[11px] text-zinc-500">
              Nguồn: {fact.citation}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
