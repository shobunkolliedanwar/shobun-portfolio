export function GlowBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* almost-invisible technical grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #EDEEF0 1px, transparent 1px), linear-gradient(to bottom, #EDEEF0 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* single soft accent orb, offset toward the portrait */}
      <div
        className="absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(201,143,74,0.16), transparent 70%)" }}
      />
      <div
        className="absolute left-[-8%] bottom-[-10%] h-[420px] w-[420px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(237,238,240,0.05), transparent 70%)" }}
      />
    </div>
  );
}
