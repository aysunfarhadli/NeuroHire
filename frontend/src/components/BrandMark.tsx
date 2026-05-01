export default function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <div
      className="relative inline-flex items-center justify-center rounded-2xl overflow-hidden"
      style={{ width: size, height: size }}
      aria-label="HireMind AI logo"
    >
      <span className="absolute inset-0 brand-ring" />
      <span className="absolute inset-[2px] rounded-[12px] bg-bg" />
      <span className="relative z-10 font-semibold text-fg" style={{ fontSize: size * 0.42 }}>
        H<span className="gradient-text">M</span>
      </span>
    </div>
  );
}
