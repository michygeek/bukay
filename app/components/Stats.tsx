"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 20, suffix: "+", label: "Years of Experience", description: "Delivering excellence since founding" },
  { value: 50, suffix: "+", label: "Projects Completed", description: "Across Nigeria's major states" },
  { value: 100, suffix: "+", label: "Expert Professionals", description: "Multi-disciplinary skilled team" },
  { value: 6, suffix: "", label: "Service Divisions", description: "Civil, Electrical, Telecom & more" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = Math.ceil(value / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#0f2d54] to-[#1b4880]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <p className="text-5xl font-black text-[#e8820c] mb-1">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="font-black text-lg mb-1">{stat.label}</p>
              <p className="text-white/60 text-xs">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
