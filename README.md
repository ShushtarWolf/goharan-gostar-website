# GXPORE — گوهران گستر نادین

سایت بازاریابی استاتیک (Next.js App Router + TypeScript + Tailwind CSS) برای برند بین‌المللی **GXPORE** / شرکت **گوهران گستر نادین**.

فقط فرانت‌اند فارسی و RTL — بدون بک‌اند، API یا پایگاه داده.

## راه‌اندازی / Setup

```bash
npm install
npm run dev
```

ساخت production:

```bash
npm run build
npm start
```

## ویدیوها / Videos

چهار فایل ویدیو را در مسیر زیر قرار دهید (نام‌ها دقیق باشد):

| فایل | بخش |
|------|------|
| `public/videos/hero.mp4` | هیرو |
| `public/videos/silencer.mp4` | صداگیر پنوماتیک |
| `public/videos/pipette.mp4` | فیلتر سرسمپلر |
| `public/videos/medical.mp4` | کاربرد پزشکی |

تا زمان افزودن فایل‌ها، سایت با گرادیان/انیمیشن CSS به‌عنوان fallback کار می‌کند.

## لوگو / Logo

لوگوی قابل تعویض:

`public/images/gxpore-logo.svg`

## برند / Brand

- Navy `#0A3D7A`
- Cyan `#00A8E8`
- Graphite `#0a0e12`
- فونت: Vazirmatn
- انیمیشن اسکرول: GSAP + ScrollTrigger

## ساختار

```
app/                  # App Router
components/
  Header.tsx
  Logo.tsx
  VideoBackground.tsx
  ScrollStory.tsx
  sections/           # بخش‌های صفحهٔ اصلی
public/
  images/
  videos/
```
