function PromoBannerBlock({ title, subtitle, gradient, icon }) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden p-6 h-44 md:h-52 flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer ${gradient}`}
    >
      {/* Optional Icon or Emoji */}
      <div className="text-3xl">{icon}</div>

      <div className="text-white z-10">
        <h3 className="text-lg md:text-xl font-bold">{title}</h3>
        <p className="text-sm md:text-md mt-1">{subtitle}</p>
      </div>

      {/* Decorative Overlay Shape */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-2xl opacity-50 pointer-events-none" />
    </div>
  );
}
export default PromoBannerBlock;