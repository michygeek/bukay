"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

const navLinks: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
    ],
  },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/#projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  {
    label: "Tools",
    children: [
      { label: "3D House Designer", href: "/design" },
      { label: "ROI & Property Estimator", href: "/roi" },
      { label: "Cost Calculator", href: "/#calculator" },
    ],
  },
  { label: "Book", href: "/book" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollSection, setScrollSection] = useState("home");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      if (!isHome) return;
      const sections = ["projects", "services", "home"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setScrollSection(id);
          break;
        }
      }
    };
    setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const isTransparent = isHome && !scrolled;

  const isActive = (href: string) => {
    if (href === "/") return isHome && scrollSection === "home";
    if (href.startsWith("/#")) return isHome && scrollSection === href.slice(2);
    return pathname === href;
  };

  const isGroupActive = (item: NavItem) => {
    if (item.href) return isActive(item.href);
    return item.children?.some((c) => pathname === c.href) ?? false;
  };

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const linkClass = (active: boolean) =>
    `text-sm font-semibold transition-colors ${
      isTransparent
        ? active
          ? "text-orange-300"
          : "text-white hover:text-orange-300"
        : active
        ? "text-[#e8820c]"
        : "text-[#0f2d54] hover:text-[#e8820c]"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent ? "bg-transparent py-4" : "bg-white/95 backdrop-blur shadow-lg py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/bukaylogo.png"
            alt="Bukay Global Services Limited"
            width={100}
            height={100}
            className="object-contain"
            priority
          />
          <div className="hidden sm:block">
            <p className={`font-black text-sm leading-tight transition-colors ${isTransparent ? "text-white" : "text-[#0f2d54]"}`}>
              BUKAY GLOBAL
            </p>
            <p className={`text-xs font-medium transition-colors ${isTransparent ? "text-orange-300" : "text-[#e8820c]"}`}>
              SERVICES LIMITED
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-1 ${linkClass(isGroupActive(item))}`}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""}`}
                  />
                </button>

                {openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpenDropdown(null)}
                        className={`block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-orange-50 hover:text-[#e8820c] ${
                          pathname === child.href ? "text-[#e8820c] bg-orange-50" : "text-[#0f2d54]"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className={linkClass(isActive(item.href!))}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA */}
        <Link
          href="/contact"
          className="hidden lg:flex items-center gap-2 bg-[#e8820c] hover:bg-[#d4730a] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:scale-105"
        >
          <Phone size={15} />
          Get a Quote
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${isTransparent ? "text-white" : "text-[#0f2d54]"}`}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#0f2d54] text-white px-6 py-4 flex flex-col gap-1 shadow-xl">
          {navLinks.map((item) =>
            item.children ? (
              <div key={item.label}>
                <button
                  onClick={() => setMobileOpen(mobileOpen === item.label ? null : item.label)}
                  className="w-full flex items-center justify-between text-sm font-semibold py-2.5 border-b border-white/10 hover:text-[#e8820c] transition-colors"
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${mobileOpen === item.label ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileOpen === item.label && (
                  <div className="pl-4 flex flex-col gap-1 py-1 bg-white/5 rounded-lg my-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => { setMenuOpen(false); setMobileOpen(null); }}
                        className="text-sm py-2 text-white/80 hover:text-[#e8820c] transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold py-2.5 border-b border-white/10 hover:text-[#e8820c] transition-colors block"
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 bg-[#e8820c] text-white px-5 py-3 rounded-full text-sm font-bold mt-3"
          >
            <Phone size={15} /> Get a Quote
          </Link>
        </div>
      )}
    </header>
  );
}
