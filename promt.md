# PROMPT THIẾT KẾ & TRIỂN KHAI LANDING PAGE: "THE SOUL OF VIETNAM" (/travel)
> **Mục đích tài liệu:** Bản đặc tả chi tiết và prompt mẫu toàn diện để tái lập hoàn hảo 100% giao diện, đồ họa hội họa, hoạt ảnh canvas 60 FPS, âm thanh đồng quê Web Audio API và hệ thống tương tác của route `/travel`.

---

## 1. TỔNG QUAN Ý TƯỞNG & PHONG CÁCH NGHỆ THUẬT (CONCEPT & VISION)
* **Chủ đề chính:** Vẻ đẹp làng quê thanh bình miền Bắc Việt Nam (Tam Cốc, Tràng An - Ninh Bình, Bắc Sơn, Mai Châu) vào buổi sớm bình minh mùa lúa chín.
* **Phong cách thị giác (Visual Style):** Cinematic, Artistic, Immersive mang hơi thở hội họa hoạt hình Studio Ghibli kết hợp tranh thủy mặc và tranh phong cảnh sơn dầu Việt Nam đương đại.
* **Góc nhìn (Camera Perspective):** 2.5D Aerial High-Angle (Góc nhìn từ trên cao chếch nghiêng bao quát toàn cảnh làng quê: sông, ruộng lúa, làng mạc, núi đá vôi, vòm trời).
* **Cảm xúc mang lại (Emotional Resonance):** Bình yên, sâu lắng, tự hào di sản văn hóa và thiên nhiên Việt Nam ("Nơi vẻ đẹp bình dị chạm đến tâm hồn").

---

## 2. QUY CHUẨN KHÔNG GIAN & BỐ CỤC (LAYOUT CONSTRAINTS)
* **Khóa trọn 100vh tuyệt đối (One-Screen, No Scroll):**
  * Giao diện nằm gọn hoàn toàn trong đúng `100vh` (`h-screen w-full overflow-hidden`).
  * Tuyệt đối không xuất hiện thanh cuộn dọc (vertical scrollbar) hay thanh cuộn ngang (horizontal scrollbar) trên mọi độ phân giải màn hình desktop.
* **Bố cục 3 tầng không gian (Three-Tier Vertical Stacking):**
  1. **Top Tier (Header):** Thanh điều hướng bán trong suốt (Glassmorphism) siêu mỏng, tinh tế.
  2. **Middle Tier (Hero Stage):** Khối nội dung nghệ thuật lệch trái (Left-weighted), nhường toàn bộ không gian trung tâm và bên phải cho bức tranh phong cảnh, dòng sông uốn lượn và đàn cò bay.
  3. **Bottom Tier (Destination Strip):** Dải chọn danh thắng di sản ghim sát đáy màn hình.

---

## 3. HỆ THỐNG MÀU SẮC & TYPOGRAPHY (DESIGN TOKENS)

### 3.1. Bảng màu chủ đạo (Color Palette)
* **Màu nền sâu thẳm:** `#0c1410` (Rừng đêm/đất phù sa), `#080d0a` (Bóng râm sớm).
* **Sắc vàng lúa chín & nắng sớm:** `#fcd34d` (Amber 300), `#fbbf24` (Amber 400), `#fef3c7` (Vàng ngà ấm).
* **Sắc xanh ngọc bích & lúa non:** `#10b981` (Emerald đồng lúa), `#6ee7b7` (Xanh ngọc nước sông), `#047857` (Rặng tre già).
* **Màu đất son & kiến trúc cổ:** Ngói đỏ truyền thống `#b45309`, thuyền gỗ nâu sẫm `#451a03`.
* **Màu chữ & viền:** Trắng ngà `#f8fafc`, xám khói `#e2e8f0`, viền kính bán trong suốt `rgba(255, 255, 255, 0.15)`.

### 3.2. Cặp Font chữ chuẩn mực (Typography Pairing)
* **Font Tiêu đề (Serif):** `Playfair Display` (hoặc font Roman Serif cổ điển hỗ trợ tiếng Việt có dấu).
  * Quy tắc Impeccable: Để thẳng trang trọng (`not-italic`), chữ hoa uy nghi, khoảng cách chữ rộng (`tracking-wide` / `tracking-widest`).
* **Font Nội dung (Sans-serif):** `Outfit` / `Inter` (hiện đại, mềm mại, dễ đọc ở kích thước nhỏ).
* **Font Thông số & Kỹ thuật di sản (Monospace):** `JetBrains Mono` (dùng cho tọa độ kinh vĩ độ, mã số di sản, nút âm thanh).

---

## 4. BỨC TRANH NGHỆ THUẬT PHONG CẢNH NỀN (BACKGROUND ARTWORK)
* **Hình ảnh gốc:** Tranh phong cảnh làng quê Việt Nam độ phân giải cao tỉ lệ `16:9` (1376x768px trở lên).
* **Các chi tiết hội họa bắt buộc trong cảnh:**
  1. **Núi đá vôi Tràng An:** Dãy núi đá vôi sừng sững mờ ảo trong làn sương sớm, đón những luồng tia nắng rọi xiên (God rays) từ góc trên.
  2. **Cánh đồng lúa chín:** Các thửa ruộng bậc thang uốn lượn đan xen giữa sắc xanh mướt của mạ non và sắc vàng rực của lúa trĩu hạt.
  3. **Dòng sông Ngô Đồng ngọc bích:** Uốn lượn hình chữ S mềm mại chảy xuyên qua lòng thung lũng, phản chiếu sắc nắng mai lấp lánh.
  4. **Thuyền ba lá và người chèo đò:** Thuyền gỗ mộc nép mình bên khúc sông, người chèo đò đội nón lá truyền thống.
  5. **Xóm làng & lũy tre xanh:** Mái nhà ngói đỏ rêu phong thấp thoáng sau rặng tre cành cong và bụi chuối xanh.
  6. **Đồng quê thanh bình:** Chú trâu gặm cỏ bên bờ sông, hai đứa trẻ chạy trên đường đê làng thả cánh diều no gió.
* **Lớp phủ ánh sáng bảo vệ tương phản (WCAG AA Contrast Overlays):**
  * Gradient chân trời đáy: `bg-gradient-to-t from-[#080d0a]/90 via-transparent to-[#080d0a]/50`.
  * Gradient sườn trái: `bg-gradient-to-r from-[#080d0a]/80 via-transparent to-transparent`.
  * *Tác dụng:* Giúp văn bản đạt độ tương phản chuẩn WCAG AA ($\ge 4.5:1$) mà không làm tối bức tranh thiên nhiên.

---

## 5. HỆ THỐNG HIỆU ỨNG PARALLAX 2.5D ĐA TẦNG (MOUSE PARALLAX)
* **Cơ chế thu nhận chuyển động chuột:**
  * Bắt tọa độ chuột chuẩn hóa theo tâm màn hình từ `-1` đến `+1`.
  * Tính toán vector dịch chuyển: `x = normX * 16px`, `y = normY * 10px`.
* **Phân tầng chiều sâu không gian (Layer Depths):**
  * **Lớp hình nền núi đá & làng quê:** `inset: -14px` (tạo lề an toàn chống hở viền), dịch chuyển ngược hướng chuột tỉ lệ `-0.5x` với `will-change-transform`.
  * **Lớp Canvas động họa:** Dịch chuyển xuôi theo từng hệ số độ sâu của đối tượng (`depth: 0.15` cho mặt nước, `0.25 - 0.45` cho cánh cò và bụi nắng).
* **Thuật toán Lerp mượt mà (Smooth Buttery Lerping):**
  * Không cập nhật giật cục; sử dụng công thức nội suy tuyến tính:
    $$\text{currentPX} \mathrel{+}= (\text{targetX} - \text{currentPX}) \times 0.12$$
    $$\text{currentPY} \mathrel{+}= (\text{targetY} - \text{currentPY}) \times 0.12$$
  * Tách rời State React bằng `useRef` và vòng lặp `requestAnimationFrame` độc lập, triệt tiêu 100% hiện tượng rung giật, đơ hay reset vị trí khi di chuột.

---

## 6. BỘ MÁY ĐỒ HỌA MICRO-ANIMATION 60 FPS CANVAS (CANVAS ENGINE)
Toàn bộ hiệu ứng động được vẽ bằng HTML5 Canvas 2D đặt tuyệt đối phủ trọn màn hình (`pointer-events-none absolute inset-0 z-10`).

### 6.1. Đàn cò trắng nghệ thuật (Aesthetic White Storks)
* **Số lượng:** Đàn từ 6 đến 8 con bay so le tự nhiên (Echelon formation) từ phải sang trái qua bầu trời và đồng lúa.
* **Giải phẫu & Tạo hình thẩm mỹ (Ghibli / Thủy mặc):**
  * **Cánh sải cong hình cánh cung:** Đường cong Bezier đa điểm mô phỏng sống động độ cong khí động học.
  * **Lông cánh sơ cấp đen tuyền (Primary Flight Feathers):** Dải lông vũ màu đen than chì (`rgba(32, 38, 48, 0.95)`) viền dọc mép sau cánh cùng các rãnh răng cưa lông vũ mềm mại, tạo sự tương phản kiêu hãnh trên nền lông trắng muốt.
  * **Viền sáng ban mai (Sunlit Rim Light):** Đường kẻ trắng tinh xảo viền mép trước cánh đón ánh bình minh.
  * **Cổ cong chữ S & đầu kiêu hãnh:** Cổ cò thuôn dài thanh mảnh uốn lượn, mỏ nhọn màu vàng hổ phách dịu mát (`#f2a830`).
  * **Đôi chân dài mảnh mai:** Chân màu nâu đất son (`rgba(165, 125, 75, 0.65)`), duỗi thẳng tự nhiên về sau đuôi theo nhịp bay.
  * **Khối thân đa chiều:** Thân hình thoi thuôn dài với dải gradient đổ bóng 3D dịu nhẹ dưới ức và bụng.
* **Động học bay (Flight Kinematics):**
  * Nhịp vỗ cánh hình sin bất đối xứng: Nhịp đập xuống dứt khoát tạo sức nâng, nhịp thu cánh cong nhẹ.
  * Trạng thái lướt gió (Tranquil Gliding): Tự động luân phiên giữa vỗ cánh và xòe cánh lướt êm theo các luồng khí nhiệt đồng quê.
  * Hiệu ứng nghiêng thân (Banking Tilt): Thân cò nghiêng nhẹ góc $\pm 2^\circ$ đến $3^\circ$ khi lướt gió.
  * Vòng lặp chân trời: Khi bay khuất góc trái màn hình, cò tái sinh mượt mà ngoài khung hình bên phải (`cssWidth + 50px`) với cao độ ngẫu nhiên.

### 6.2. Dòng nước sông chảy uốn lượn (Gentle River Streamlets)
* **Đường dẫn toán học Spline (Catmull-Rom Spline):**
  * Sử dụng hệ tọa độ 11 điểm kiểm soát (Control Points) bám khít từng khúc cua chữ S của con sông trong bức tranh.
  * Bề rộng sông mở rộng dần theo phối cảnh viễn cận: Từ 8px ở thung lũng xa đến 72px tại đầm nước tiền cảnh.
* **Chuyển động dòng chảy (38 Streamlets):**
  * Các tia nước trôi êm ả dọc theo vector tiếp tuyến của đường cong spline.
  * Dao động sóng gợn hình sin mềm mại hai bên bờ sông (`wobbleSpeed`, `lateral wave`).
  * Tự động uốn dòng né con thuyền chèo đò một cách tự nhiên.
  * Màu sắc hòa quyện: Sắc vàng óng ánh nơi sông đón tia nắng chiếu và sắc xanh ngọc bích nơi bóng mát.
* **Ánh nước lấp lánh (River Glints):** Các hình elip phản quang lập lòe nhẹ nhàng theo nhịp thở của ánh bình minh.

### 6.3. Cá quẫy nhảy tung tăng & Sóng nước (Jumping Fish & Ripples)
* **Hành vi sinh thái:** Cứ mỗi 4–8 giây, một chú cá đồng ánh bạc vây vàng bất ngờ bật nhảy tung lên khỏi mặt nước khúc sông vắng.
* **Động học parabol:** Bay lên theo quỹ đạo trọng lực, thân cá tự động xoay góc chúc đầu theo vector vận tốc (`Math.atan2(vy, vx)`).
* **Sóng nước lan tỏa:** Khi cá chạm mặt nước, sinh ra các vòng sóng elip dẹt (phối cảnh góc nghiêng tỉ lệ `y = 0.4x`) loang rộng dần cùng các hạt bọt nước li ti bắn lên.

### 6.4. Hạt bụi nắng mai lơ lửng (Sunlight Motes)
* 25 hạt bụi nắng màu vàng ngà (`rgba(255, 245, 195)`) lơ lửng, trôi nhẹ từ dưới lên và đung đưa qua lại theo gió.
* Độ sáng nhấp nháy êm dịu (`sin(pulse)`), tái lập không khí trong lành, tinh khôi của buổi sớm làng quê.

---

## 7. ÂM THANH ĐỒNG QUÊ THỦ TỤC WEB AUDIO API (PASTORAL SOUNDSCAPE)
* **Tiêu chí:** Zero-asset (Hoàn toàn không tải file MP3/WAV nặng), sinh âm thanh trực tiếp bằng thuật toán Web Audio API trong trình duyệt.
* **Gió đồng nội êm dịu:**
  * Sinh tín hiệu Pink Noise qua bộ đệm.
  * Lọc dải thấp (Low-pass Biquad Filter) ở tần số ấm `320Hz`.
  * Dao động LFO chậm tần số `0.12Hz` điều biến độ mở bộ lọc, tái hiện từng đợt gió sớm thoảng qua rặng tre.
* **Tiếng chim hót véo von buổi sáng:**
  * Hàm ngẫu nhiên kích hoạt tiếng hót sau mỗi 3 đến 7 giây.
  * Bộ dao động hình sin (Sine Oscillator) quét tần số từ `2200Hz` lên `3400Hz` với các đường cong biến thiên âm lượng và cao độ tự nhiên.
* **Kiểm soát âm lượng:** Chuyển đổi êm dịu (Exponential Ramp) 1–2 giây khi Bật/Tắt, tuyệt đối không gây tiếng nổ lụp bụp (clicks/pops).

---

## 8. CHI TIẾT CÁC THÀNH PHẦN GIAO DIỆN (UI COMPONENTS)

### 8.1. Header / Navigation Bar
* **Kính mờ sang trọng:** `backdrop-blur-md bg-black/35 border-b border-white/15 px-4 sm:px-8 py-3.5`.
* **Cụm Logo bên trái:**
  * Nút "RETURN" quay lại trang chủ kèm icon mũi tên.
  * Chữ thương hiệu uy nghiêm: **VIỆT NAM** (Serif hoa, in đậm) kèm huy hiệu `HERITAGE` nền đen viền vàng hổ phách.
* **Menu điều hướng giữa (Desktop):** `Discover` (active vàng hổ phách), `Destinations`, `Culture`, `About` (font sans, chữ hoa, tracking rộng).
* **Cụm tiện ích bên phải:**
  * Nút bấm dạng viên thuốc bo tròn: **ÂM THANH ĐỒNG QUÊ 🌾** / **TIẾNG ĐỒNG QUÊ: BẬT** (kèm icon loa `Volume2`/`VolumeX`).
  * Nút hành động nhanh: **OPEN FORGE ⚡** (màu xanh ngọc emerald rực rỡ).

### 8.2. Dấu ấn di sản viền màn hình (Vertical Cultural Stamps)
* Xuất hiện cố định ở hai cạnh trái và phải trên màn hình lớn ($\ge$ 2XL) bằng thuộc tính `writing-mode: vertical-rl`.
* **Trái:** `[// HERITAGE_ZONE // RED_RIVER_DELTA // BIO_RESERVE: 20°15'N]`
* **Phải:** `[// THE_SOUL_OF_VIETNAM // TIMELESS_CHARM // UNESCO_HERITAGE]`

### 8.3. Khung Typography Hero chính (Hero Stage)
* **Vị trí:** Căn trái màn hình, đặt trong khung giới hạn tối đa `max-w-2xl`.
* **Huy hiệu địa danh:** Viên thuốc kính mờ hiển thị tọa độ GPS chính xác và icon `MapPin` (ví dụ: `TAM CỐC · NINH BÌNH · 20°13'N · 105°56'E`).
* **Đại tiêu đề (Headline Masterpiece):**
  ```text
  THE SOUL OF
  VIETNAM
  ```
  * Font Playfair Display không nghiêng, cỡ chữ `text-5xl sm:text-7xl lg:text-8xl`.
  * Dòng chữ `VIETNAM` ánh sắc vàng hoàng kim `#fcd34d`, đổ bóng chữ rực rỡ.
* **Câu Tagline cảm xúc:**
  * *"Nơi vẻ đẹp bình dị chạm đến tâm hồn"* (Font Serif thanh thoát, màu vàng ngà).
* **Đoạn văn mô tả thi vị:** Thay đổi sống động theo danh thắng đang chọn, font sans chữ nhỏ màu xám sáng sắc nét.
* **Nút bấm Khám phá (Primary CTA):**
  * Dạng viên thuốc bo tròn hoàn hảo, màu vàng hổ phách `bg-amber-400 text-stone-950 font-serif font-bold text-xs uppercase tracking-widest`.
  * Văn bản: `KHÁM PHÁ HÀNH TRÌNH` kèm icon la bàn `Compass`. Hiệu ứng hover phóng nhẹ `hover:scale-105` mượt mà.
  * Dòng chữ nhỏ bên cạnh: `UNESCO WORLD HERITAGE SITE`.

### 8.4. Dải Scrubber danh thắng tương tác dưới đáy (Destination Strip)
* Ghim cố định sát đáy màn hình (`border-t border-white/15 bg-black/40 backdrop-blur-md px-4 sm:px-8 py-3`).
* **Bộ 4 danh thắng miền Bắc tiêu biểu:**
  1. `01 · TAM CỐC (NINH BÌNH · 20°13'N · 105°56'E)`: Dòng Ngô Đồng uốn lượn qua ba hang kỳ vĩ giữa mùa lúa chín.
  2. `02 · TRÀNG AN (NINH BÌNH · 20°15'N · 105°54'E)`: Quần thể di sản thế giới nơi non nước hữu tình giao hòa mây trời.
  3. `03 · BẮC SƠN (LẠNG SƠN · 21°54'N · 106°19'E)`: Thung lũng lúa ngút ngàn đan sắc màu trù phú dưới chân núi đá vôi.
  4. `04 · MAI CHÂU (HÒA BÌNH · 20°40'N · 105°04'E)`: Bản làng người Thái thanh bình với mái nhà sàn nép bên nương lúa.
* **Tương tác trực quan:**
  * Danh thắng đang chọn nổi bật với nền vàng hổ phách, chữ đen đậm, đổ bóng sang trọng.
  * Các danh thắng khác nền kính tối, viền mảnh mờ, hover sáng dần.
  * Khi bấm chọn: Toàn bộ huy hiệu tọa độ, tên địa danh và đoạn văn dẫn chuyện ở Hero Stage lập tức chuyển đổi mượt mà.

---

## 9. QUY TẮC IMPECCABLE & HIỆU NĂNG TỐI THƯỢNG (IMPECCABLE BENCHMARK)
* **0 Anti-patterns:**
  * Không dùng font serif nghiêng rập khuôn giá rẻ; dùng Playfair Display đứng đắn, sang trọng.
  * Không che khuất cảnh vật bằng các tấm thẻ hộp (card) đục ngầu; toàn bộ UI hòa quyện bằng kính mờ và gradient bóng đổ.
  * Độ tương phản văn bản luôn $\ge 4.5:1$ (WCAG AA).
* **Hiệu năng 60 FPS mượt mà:**
  * Toàn bộ animation canvas được tính toán bằng phép toán số học phẳng, không cấp phát mảng mới trong hàm render để tránh rác bộ nhớ (Zero Garbage Collection pressure).
  * Hỗ trợ chuẩn màn hình Retina độ phân giải cao bằng Device Pixel Ratio (`dpr = min(devicePixelRatio, 2)`).

---

## 10. BẢN PROMPT MẪU HOÀN CHỈNH ĐỂ TẠO TRANG TƯƠNG ĐƯƠNG (READY-TO-USE PROMPT)

> *Dưới đây là nội dung prompt độc lập, cô đọng nhưng chứa đầy đủ thông số kỹ thuật mà bạn có thể sao chép và gửi cho bất kỳ AI coding assistant nào để tái tạo một trang hoàn toàn tương đương:*

```markdown
Hãy xây dựng một trang web Single-Page giới thiệu du lịch và di sản Việt Nam với chủ đề "Vẻ Đẹp Đồng Quê Việt Nam", mang phong cách Cinematic, Artistic và Immersive đạt chuẩn thiết kế Impeccable (0 anti-patterns).

YÊU CẦU BẮT BUỘC VỀ KỸ THUẬT & GIAO DIỆN:
1. KHÓA TRỌN 100VH TUYỆT ĐỐI (One-Screen, No Scroll):
   - Toàn bộ giao diện hiển thị vừa vặn trong đúng 100vh (h-screen w-full overflow-hidden), tuyệt đối không có thanh cuộn ngang hoặc cuộn dọc trên mọi độ phân giải.

2. BỨC TRANH NGHỆ THUẬT NỀN & PHỐI CẢNH 2.5D:
   - Sử dụng tranh minh họa phong cảnh làng quê Việt Nam mùa lúa chín (Tam Cốc, Tràng An) theo phong cách hoạt họa Studio Ghibli kết hợp tranh thủy mặc với góc nhìn từ trên cao chếch nghiêng (Aerial High-Angle).
   - Chi tiết tranh: Núi đá vôi hùng vĩ trong sương sớm cùng luồng nắng rọi xiên, cánh đồng lúa chín vàng xen kẽ xanh ngọc uốn lượn, dòng sông Ngô Đồng nước ngọc bích quanh co, mái nhà ngói đỏ truyền thống sau rặng tre xanh và bụi chuối, con thuyền gỗ nhỏ với người chèo đò đội nón lá, chú trâu gặm cỏ và trẻ em thả diều trên đê.
   - Thêm lớp phủ gradient tinh tế (bottom & left) đảm bảo độ tương phản WCAG AA >= 4.5:1 cho văn bản mà không làm tối bức tranh.
   - Hiệu ứng 2.5D Mouse Parallax: Khi rê chuột, các lớp cảnh vật dịch chuyển đa tầng mượt mà qua thuật toán nội suy Lerp tuyến tính (current += (target - current) * 0.12), không giật lag.

3. HỆ THỐNG HOẠT ẢNH 60 FPS HTML5 CANVAS:
   - Đàn cò trắng nghệ thuật: 6-8 con cò sải cánh bay so le tự nhiên từ phải qua trái. Tạo hình thẩm mỹ cao với đôi cánh cong chữ V kiêu hãnh, lông cánh sơ cấp viền đen huyền ở mép sau, cổ cong chữ S, mỏ vàng hổ phách và đôi chân dài duỗi thẳng sau thân. Động học bay gồm các nhịp vỗ cánh hình sin nhịp nhàng đan xen khoảng thời gian xòe cánh lướt êm trên luồng nhiệt và độ nghiêng thân banking tilt 2-3 độ.
   - Dòng nước sông chảy mềm mại: 38 tia nước lướt nhẹ dọc theo đường spline Catmull-Rom uốn lượn theo khúc cua của con sông, tự động uốn dòng né thuyền và lấp lánh phản chiếu ánh nắng ban mai.
   - Cá nhảy tung tăng: Định kỳ xuất hiện cá đồng ánh bạc vây vàng phóng nhảy lên khỏi mặt nước theo quỹ đạo parabol có gia tốc trọng trường, tạo các vòng sóng elip loang rộng và bọt nước li ti khi chạm mặt sông.
   - Bụi nắng sớm: 25 hạt bụi vàng ấm lơ lửng, bay bổng và nhấp nháy êm ái trong vòm trời.

4. HỆ THỐNG ÂM THANH THỦ TỤC ZERO-ASSET (WEB AUDIO API):
   - Tự động tổng hợp âm thanh trực tiếp trong trình duyệt không cần tải file MP3:
     + Tiếng gió đồng nội rì rào qua rặng tre: Dùng Pink Noise kết hợp bộ lọc Low-pass 320Hz và dao động LFO 0.12Hz.
     + Tiếng chim hót véo von buổi sớm: Dao động Sine sweep tần số 2200Hz - 3400Hz kích hoạt ngẫu nhiên mỗi 3-7 giây.
   - Nút bật/tắt dạng viên thuốc tròn tinh tế trên thanh điều hướng ("ÂM THANH ĐỒNG QUÊ 🌾" / "TIẾNG ĐỒNG QUÊ: BẬT") với hiệu ứng tăng/giảm âm lượng mềm mại (exponential ramp).

5. BỐ CỤC UI & TYPOGRAPHY CAO CẤP:
   - Header kính mờ: Logo "VIỆT NAM" serif in hoa kèm huy hiệu "HERITAGE", menu "Discover", "Destinations", "Culture", "About", nút bật âm thanh và nút CTA phụ "OPEN FORGE ⚡".
   - Hero Stage (Lệch trái):
     + Huy hiệu địa danh kính mờ kèm tọa độ GPS (ví dụ: TAM CỐC · NINH BÌNH · 20°13'N · 105°56'E).
     + Tiêu đề lớn serif trang trọng không nghiêng: "THE SOUL OF VIETNAM" (chữ VIETNAM ánh vàng hoàng kim).
     + Tagline cảm xúc: "Nơi vẻ đẹp bình dị chạm đến tâm hồn".
     + Nút CTA chính: Dạng viên thuốc bo tròn màu vàng hổ phách "KHÁM PHÁ HÀNH TRÌNH" kèm icon la bàn.
   - Dải chọn danh thắng di sản dưới đáy (Destination Strip):
     + Hiển thị 4 danh thắng: 01 · TAM CỐC, 02 · TRÀNG AN, 03 · BẮC SƠN, 04 · MAI CHÂU.
     + Khi người dùng chọn danh thắng nào, tọa độ, tiêu đề và câu chuyện mô tả trên màn hình cập nhật tức thì với hiệu ứng ánh sáng đồng bộ.
   - Viền màn hình lớn: Hai dải chữ dọc (Vertical Stamps) hiển thị mã định danh di sản văn hóa Red River Delta.
```
