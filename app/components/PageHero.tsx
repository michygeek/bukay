interface Props {
  badge: string;
  title: string;
  description?: string;
}

export default function PageHero({ badge, title, description }: Props) {
  return (
    <section className="bg-linear-to-br from-[#0f2d54] to-[#1b4880] pt-36 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center text-white">
        <span className="inline-block bg-[#e8820c]/20 text-[#e8820c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
          {badge}
        </span>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">{title}</h1>
        {description && (
          <p className="text-white/70 text-sm max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
        <div className="w-16 h-1 bg-[#e8820c] mx-auto rounded-full mt-6" />
      </div>
    </section>
  );
}
