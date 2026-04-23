"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All", "Buildings", "Construction", "Telecom", "Electrical", "Finishing"] as const;
type Category = (typeof categories)[number];

const photos: { id: number; category: Category; src: string; caption: string }[] = [
  // Buildings — completed
  { id: 1,  category: "Buildings",    src: "/images/Screenshot 2026-04-22 212433.png", caption: "Providus Bank Remodeling, Abuja" },
  { id: 2,  category: "Buildings",    src: "/images/Screenshot 2026-04-22 203121.png", caption: "Building Remodeling & Exterior Works" },
  { id: 3,  category: "Buildings",    src: "/images/Screenshot 2026-04-22 212553.png", caption: "Completed Commercial Building" },
  { id: 4,  category: "Buildings",    src: "/images/Screenshot 2026-04-22 212935.png", caption: "6-Unit Residential Apartment Block" },
  { id: 5,  category: "Buildings",    src: "/images/Screenshot 2026-04-22 213044.png", caption: "Twin Duplex — Completed Exterior" },
  { id: 6,  category: "Buildings",    src: "/images/Screenshot 2026-04-22 213204.png", caption: "5-Bedroom Home with Perimeter Fence" },
  { id: 7,  category: "Buildings",    src: "/images/Screenshot 2026-04-22 213226.png", caption: "Completed Bungalow with Roof Tiles" },
  { id: 8,  category: "Buildings",    src: "/images/Screenshot 2026-04-22 213213.png", caption: "Roofing — Stone-Coated Tiles Installation" },
  { id: 9,  category: "Buildings",    src: "/images/Screenshot 2026-04-22 212523.png", caption: "Interior Ceiling & Air Conditioning Works" },
  { id: 10, category: "Buildings",    src: "/images/Screenshot 2026-04-22 213033.png", caption: "Interior Finishing — Living Room" },
  { id: 11, category: "Buildings",    src: "/images/Screenshot 2026-04-22 213115.png", caption: "Kitchen Interior Fit-Out" },
  // Construction — foundation & in-progress
  { id: 12, category: "Construction", src: "/images/Screenshot 2026-04-22 203012.png", caption: "Foundation Pile & Column Construction" },
  { id: 13, category: "Construction", src: "/images/Screenshot 2026-04-22 203044.png", caption: "Excavation & Earthwork" },
  { id: 14, category: "Construction", src: "/images/Screenshot 2026-04-22 203139.png", caption: "Structural Steel Frame & Scaffolding" },
  { id: 15, category: "Construction", src: "/images/Screenshot 2026-04-22 212454.png", caption: "Building Construction — Upper Floors" },
  { id: 16, category: "Construction", src: "/images/Screenshot 2026-04-22 212508.png", caption: "External Scaffolding & Render Works" },
  { id: 17, category: "Construction", src: "/images/Screenshot 2026-04-22 212831.png", caption: "Foundation Trench Excavation" },
  { id: 18, category: "Construction", src: "/images/Screenshot 2026-04-22 212843.png", caption: "Reinforced Concrete Slab Works" },
  { id: 19, category: "Construction", src: "/images/Screenshot 2026-04-22 212900.png", caption: "Rebar & Reinforcement Works" },
  { id: 20, category: "Construction", src: "/images/Screenshot 2026-04-22 212914.png", caption: "Block-Laying & Superstructure Works" },
  { id: 21, category: "Construction", src: "/images/Screenshot 2026-04-22 212947.png", caption: "Ground Floor Block Works in Progress" },
  { id: 22, category: "Construction", src: "/images/Screenshot 2026-04-22 213002.png", caption: "Early-Stage Construction Works" },
  { id: 23, category: "Construction", src: "/images/Screenshot 2026-04-22 213018.png", caption: "Material Delivery & Site Operations" },
  { id: 24, category: "Construction", src: "/images/Screenshot 2026-04-22 213053.png", caption: "Concrete Slab & Platform Construction" },
  { id: 25, category: "Construction", src: "/images/Screenshot 2026-04-22 213104.png", caption: "Roof Frame & Truss Installation" },
  // Telecom
  { id: 26, category: "Telecom",      src: "/images/Screenshot 2026-04-22 203104.png", caption: "Telecom Mast & Tower Erection" },
  // Electrical
  { id: 27, category: "Electrical",   src: "/images/Screenshot 2026-04-22 213240.png", caption: "Electrical Wiring & Distribution Works" },
  // Finishing — flooring & plumbing
  { id: 28, category: "Finishing",    src: "/images/Screenshot 2026-04-22 212536.png", caption: "Interlocking Paving Block Installation" },
  { id: 29, category: "Finishing",    src: "/images/Screenshot 2026-04-22 210032.png", caption: "Plumbing Fittings & Pipe Works" },
  { id: 30, category: "Finishing",    src: "/images/Screenshot 2026-04-22 211156.png", caption: "Valley Forge Laminate Flooring" },
  { id: 31, category: "Finishing",    src: "/images/Screenshot 2026-04-22 211224.png", caption: "Middlebrooke Laminate Flooring Collection" },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "All" ? photos : photos.filter((p) => p.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, prev, next]);

  const currentPhoto = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#e8820c]/10 text-[#e8820c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            Our Work
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d54] mb-4">
            Media Gallery
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            A showcase of our completed and ongoing projects across Nigeria — roads, buildings,
            telecom sites, and electrical installations.
          </p>
          <div className="w-16 h-1 bg-[#e8820c] mx-auto rounded-full mt-4" />
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat
                  ? "bg-[#0f2d54] text-white shadow-md"
                  : "bg-white text-[#0f2d54] border border-gray-200 hover:border-[#0f2d54]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo grid */}
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          <AnimatePresence>
            {filtered.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="relative group cursor-pointer break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white text-sm font-semibold leading-tight">{photo.caption}</p>
                  <span className="text-[#e8820c] text-xs font-bold mt-1">{photo.category}</span>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={14} className="text-white" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && currentPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              onClick={closeLightbox}
            >
              <X size={20} />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft size={22} />
            </button>

            {/* Image */}
            <motion.div
              key={currentPhoto.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl w-full mx-12"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentPhoto.src}
                alt={currentPhoto.caption}
                className="w-full max-h-[80vh] object-contain rounded-2xl"
              />
              <div className="text-center mt-4">
                <p className="text-white font-semibold">{currentPhoto.caption}</p>
                <span className="text-[#e8820c] text-xs font-bold">{currentPhoto.category}</span>
              </div>
              <p className="text-white/40 text-xs text-center mt-2">
                {lightboxIndex + 1} / {filtered.length} &nbsp;·&nbsp; ESC to close &nbsp;·&nbsp; ← → to navigate
              </p>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
