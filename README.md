# 🚀 ProfileForge — Visual GitHub Profile README Builder

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-3.2-6e9f18?logo=vitest)](https://vitest.dev/)

**ProfileForge** là công cụ trực quan (visual builder) mã nguồn mở giúp lập trình viên thiết kế hồ sơ GitHub cá nhân (`README.md`) ấn tượng, chuyên nghiệp chỉ trong vài phút mà không cần viết Markdown thủ công.

[Tính Năng](#-tính-năng-nổi-bật) • [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng-chi-tiết) • [Cài Đặt Cục Bộ](#-cài-đặt--phát-triển-local) • [Cấu Trúc Thư Mục](#-cấu-trúc-dự-án) • [Đóng Góp](#-đóng-góp)

</div>

---

## 🌟 Tính Năng Nổi Bật

- **Trình Kéo Thả Trực Quan (Visual Drag-and-Drop)**: Tự do sắp xếp thứ tự các section, bật/tắt hiển thị, nhân bản và tùy chỉnh nội dung linh hoạt được hỗ trợ bởi `@dnd-kit`.
- **Nhập Dữ Liệu Tự Động Từ GitHub**: Chỉ cần nhập username GitHub của bạn, ProfileForge sẽ tự động lấy avatar, bio, địa chỉ, các repository nhiều sao nhất và ngôn ngữ lập trình chủ đạo thông qua Octokit GitHub API.
- **5 Mẫu Template Chuyên Nghiệp**:
  1. **Modern Developer** *(Phổ biến nhất)*: Giao diện hiện đại với banner gõ chữ (typing effect), bảng thống kê streak và lưới công nghệ.
  2. **Minimalist**: Tối giản, tập trung vào typographic sắc nét, bio ngắn gọn và badges thanh lịch.
  3. **Executive & Lead**: Bố cục trang trọng dành cho Tech Lead/Engineering Manager với điểm nhấn về năng lực lãnh đạo và kiến trúc hệ thống.
  4. **Terminal**: Phong cách hacker monospaced hoài cổ (`$ whoami`, `$ cat skills.sh`).
  5. **Creative**: Màu sắc sinh động, widget đếm lượt truy cập, huy hiệu năng động và quote truyền cảm hứng.
- **6 Bộ Theme Đồng Bộ**: Hỗ trợ đầy đủ GitHub Dark, GitHub Light, Dracula, Nord, Tokyo Night, và Catppuccin cho toàn bộ card thống kê và huy hiệu.
- **Hệ Sinh Thái Section Đa Dạng**:
  - **Header**: Lời chào, ảnh đại diện (tròn/vuông), typing animation banner, căn lề trái/giữa/phải.
  - **About Me**: Giới thiệu bản thân, mục tiêu học tập, dự án đang phát triển, sở thích.
  - **Tech Stack**: Danh mục công nghệ phân theo Languages, Frontend, Backend, Database, DevOps, Tools với 3 kiểu badge: *for-the-badge*, *flat*, *flat-square*.
  - **GitHub Stats**: Card thống kê tổng hợp, ngôn ngữ được dùng nhiều nhất, chuỗi ngày commit liên tục (streak stats), danh hiệu (trophies).
  - **Featured Projects**: Giới thiệu dự án tiêu biểu kèm link demo, mô tả, số sao và công nghệ sử dụng.
  - **Socials & Contacts**: Kết nối nhanh qua GitHub, LinkedIn, Twitter/X, Discord, Portfolio cá nhân, Email, YouTube, Twitch.
  - **Status & Dynamic Widgets**: Đếm số lượt xem profile (hit counter), trích dẫn ngẫu nhiên hàng ngày, trạng thái hiện tại.
- **Xem Trước Song Song Thời Gian Thực (Live Preview)**:
  - Khung Preview chuẩn GitHub Flavored Markdown (GFM) qua `react-markdown` và `rehype-sanitize`.
  - Trình soạn thảo thô tích hợp CodeMirror 6 cho phép xem và sao chép trực tiếp mã Markdown.
- **Xuất Dữ Liệu Tiện Lợi & Không Ràng Buộc (Zero Lock-in)**:
  - 1-click Copy Markdown vào Clipboard.
  - Tải trực tiếp file `README.md`.
  - Tải gói lưu trữ ZIP (gồm README và file cấu hình JSON).
  - Lưu và nạp cấu hình bằng file JSON backup để chỉnh sửa tiếp bất kỳ lúc nào mà không cần tạo tài khoản hay cơ sở dữ liệu.

---

## 📖 Hướng Dẫn Sử Dụng Chi Tiết

### Bước 1: Khởi đầu với Template có sẵn
Khi truy cập ứng dụng tại `/builder`, bạn có thể chọn một trong **5 Template mẫu** ở thanh điều hướng trên cùng (hoặc dùng template mặc định). Template sẽ tự động điền sẵn cấu trúc các section hợp lý.

### Bước 2: Nhập thông tin nhanh từ GitHub (Khuyên dùng)
1. Bấm vào nút **Import GitHub** (biểu tượng GitHub) trên thanh Header.
2. Nhập username GitHub của bạn và bấm **Fetch Profile**.
3. ProfileForge sẽ tự động cập nhật avatar, bio, danh sách repository nổi bật và các ngôn ngữ bạn hay dùng vào cấu hình.

### Bước 3: Tùy biến và sắp xếp các Section
- **Kéo thả để đổi vị trí**: Nhấp và giữ biểu tượng kéo thả bên trái từng section trong danh sách bên trái để di chuyển lên/xuống.
- **Bật/Tắt hiển thị**: Bấm vào công tắc chuyển đổi (Switch) để ẩn hoặc hiện một section mà không bị mất dữ liệu đã nhập.
- **Chỉnh sửa nội dung chi tiết**: Nhấp vào section tương ứng, bảng điều khiển cấu hình (Inspector) ở giữa sẽ hiển thị các trường dữ liệu trực quan:
  - Nhập thông tin cá nhân, liên kết mạng xã hội.
  - Chọn các công nghệ trong Tech Stack từ thư viện icon tích hợp.
  - Tùy chỉnh màu sắc, ẩn viền, đếm private commit cho card thống kê GitHub.
- **Thao tác Hoàn tác / Làm lại**: Hỗ trợ phím tắt `Ctrl + Z` (Undo) và `Ctrl + Y` (Redo) ngay trên thanh công cụ.

### Bước 4: Chọn Theme & Phong cách hiển thị
- Tại thanh Header, bấm chọn mục **Theme** để đổi bảng màu cho các widget (GitHub Dark, Dracula, Nord, v.v.).
- Bạn có thể bật chế độ xem Dark/Light mode của trang để kiểm tra mức độ tương thích trên cả hai nền giao diện của GitHub.

### Bước 5: Xem trước và tinh chỉnh Markdown
- Cột bên phải cung cấp hai tab:
  - **Preview**: Hiển thị chính xác diện mạo trang README của bạn khi hiển thị trên GitHub.
  - **Markdown (CodeMirror 6)**: Hiển thị toàn bộ mã nguồn Markdown được tạo tự động với cú pháp tô màu chuẩn xác.

### Bước 6: Cài đặt vào GitHub Profile của bạn
1. Bấm nút **Export** trên thanh Header:
   - Chọn **Copy Markdown** để sao chép toàn bộ nội dung vào bộ nhớ tạm.
   - Hoặc chọn **Download README.md** để tải file về máy.
   - *(Tùy chọn)* Chọn **Export JSON Config** để sao lưu lại cấu hình, sau này có thể dùng nút **Import JSON** để khôi phục cấu hình này.
2. Truy cập [GitHub](https://github.com/) và tạo một repository mới có **tên trùng với username của bạn** (Ví dụ: nếu username là `hoducvinhh`, tên repository sẽ là `hoducvinhh/hoducvinhh`).
3. Đặt trạng thái repository là **Public** và tích chọn **Add a README file**.
4. Mở file `README.md` trong repository đó, dán toàn bộ nội dung bạn vừa sao chép từ ProfileForge vào và bấm **Commit changes**.
5. Quay lại trang cá nhân GitHub `https://github.com/<username>`, bạn sẽ thấy hồ sơ hoàn toàn mới của mình!

---

## 💻 Cài Đặt & Phát Triển Local

### Yêu cầu hệ thống
- **Node.js**: >= 18.18.0
- **Package Manager**: [pnpm](https://pnpm.io/) >= 9.0.0 (khuyến nghị) hoặc `npm` / `yarn`

### Các bước cài đặt

```bash
# 1. Clone repository về máy
git clone https://github.com/hoducvinhh/github-profile-generator.git
cd github-profile-generator

# 2. Cài đặt các gói phụ thuộc
pnpm install

# 3. Cấu hình biến môi trường (Tùy chọn)
cp .env.example .env.local
```

> **Gợi ý**: Mở file `.env.local` và thêm `GITHUB_TOKEN=ghp_your_token` để nâng hạn mức truy vấn GitHub API từ 60 lượt/giờ lên 5.000 lượt/giờ.

```bash
# 4. Khởi chạy máy chủ phát triển
pnpm dev
```

Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000) để trải nghiệm.

### Kiểm thử & Build dự án

```bash
# Chạy Unit Tests với Vitest
pnpm test

# Kiểm tra kiểu dữ liệu TypeScript
pnpm typecheck

# Đóng gói sản phẩm cho Production
pnpm build
```

---

## 📁 Cấu Trúc Dự Án

```plaintext
github-profile-generator/
├── .github/workflows/          # Quy trình CI/CD GitHub Actions
├── public/                     # Tài nguyên tĩnh
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── api/github/         # API Route trung gian gọi GitHub API
│   │   ├── builder/            # Giao diện chính của Profile Workspace
│   │   ├── layout.tsx          # Root Layout & Theme Provider
│   │   └── page.tsx            # Trang Landing Page giới thiệu
│   ├── components/
│   │   ├── editor/             # Danh sách Sortable Sections & Inspector
│   │   ├── github/             # Hộp thoại Import GitHub Profile
│   │   ├── layout/             # Header, Footer thanh điều hướng
│   │   ├── preview/            # GFM Markdown Preview & CodeMirror Editor
│   │   └── ui/                 # Bộ thư viện UI component (Radix + Tailwind)
│   ├── lib/
│   │   ├── export/             # Tiện ích Clipboard, Download, ZIP, JSON
│   │   ├── markdown/           # Bộ chuyển đổi & Serializer GFM chuẩn xác
│   │   ├── sections/           # Định nghĩa và đăng ký các loại section
│   │   ├── templates/          # Đăng ký 5 mẫu Profile Template
│   │   ├── themes/             # Đăng ký bảng màu & Theme SVG widgets
│   │   └── utils.ts            # Hàm tiện ích chung (cn, class merge)
│   ├── schemas/                # Lược đồ Zod xác thực dữ liệu Profile
│   ├── stores/                 # Zustand store quản lý state & lịch sử Undo/Redo
│   ├── styles/                 # Tailwind CSS & Global design tokens
│   └── types/                  # Định nghĩa TypeScript toàn cục
├── tests/unit/                 # Bộ kiểm thử Unit Test cho Markdown Serializer
├── .env.example                # Mẫu biến môi trường
├── .gitignore                  # Cấu hình bỏ qua tệp cá nhân & bản build
├── package.json                # Khai báo dependencies và scripts
└── README.md                   # Tài liệu hướng dẫn sử dụng
```

---

## 🛠️ Công Nghệ Sử Dụng

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI & Animation**: [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) kết hợp [Immer](https://immerjs.github.io/immer/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Markdown Processing**: `react-markdown`, `remark-gfm`, `rehype-sanitize`
- **Code Editor**: CodeMirror 6 (`@uiw/react-codemirror`)
- **API Client**: [@octokit/rest](https://github.com/octokit/rest.js/)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 🤝 Đóng Góp (Contributing)

Mọi đóng góp nhằm cải thiện tính năng, sửa lỗi hoặc thêm các template/theme mới đều rất được hoan nghênh!
1. Fork dự án về tài khoản của bạn.
2. Tạo nhánh tính năng mới (`git checkout -b feature/tinh-nang-moi`).
3. Commit các thay đổi (`git commit -m 'feat: them theme moi'`).
4. Đẩy lên nhánh của bạn (`git push origin feature/tinh-nang-moi`).
5. Mở một **Pull Request** trên GitHub.

Xem thêm quy định chi tiết tại [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 Giấy Phép (License)

Dự án được phân phối dưới giấy phép **MIT**. Xem tệp [LICENSE](LICENSE) để biết thêm chi tiết.

<div align="center">
  <sub>Được phát triển với niềm đam mê dành cho cộng đồng lập trình viên mã nguồn mở 💖</sub>
</div>
