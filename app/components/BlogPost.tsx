"use client";

import Link from "next/link";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { sanityImageUrl, type SanityPost } from "@/lib/sanity";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="my-8">
          <img
            src={sanityImageUrl(value.asset._ref, 900)}
            alt={value.alt ?? ""}
            className="w-full rounded-xl shadow-sm"
          />
          {value.caption && (
            <figcaption className="text-center text-xs text-gray-400 mt-2">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value.href}
        target={value.blank ? "_blank" : undefined}
        rel={value.blank ? "noopener noreferrer" : undefined}
        className="text-[#e8820c] underline font-semibold hover:text-[#d4730a]"
      >
        {children}
      </a>
    ),
  },
  block: {
    h2: ({ children }) => <h2 className="text-2xl font-black text-[#0f2d54] mt-10 mb-4 border-b-2 border-gray-100 pb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-black text-[#0f2d54] mt-8 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-bold text-[#0f2d54] mt-6 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#e8820c] bg-orange-50 px-5 py-4 rounded-r-xl my-6 italic text-gray-600">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mb-5 leading-relaxed text-gray-700">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-1 text-gray-700">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-1 text-gray-700">{children}</ol>,
  },
};

export default function BlogPost({ post }: { post: SanityPost }) {
  const coverUrl = post.coverImage?.asset?._ref
    ? sanityImageUrl(post.coverImage.asset._ref, 1600)
    : null;

  return (
    <article className="bg-white">
      {coverUrl ? (
        <div className="w-full max-h-125 overflow-hidden">
          <img src={coverUrl} alt={post.coverImage?.alt ?? post.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-64 bg-linear-to-br from-[#0f2d54] to-[#1b4880]" />
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#0f2d54] transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        <div className="mb-4">
          <span className="bg-[#e8820c]/10 text-[#e8820c] text-xs font-bold px-3 py-1.5 rounded-full">{post.category}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[#0f2d54] leading-tight mb-4">{post.title}</h1>

        <div className="flex items-center gap-5 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
          <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date(post.publishedAt).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        {post.excerpt && (
          <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium">{post.excerpt}</p>
        )}

        <div className="prose">
          {post.body && <PortableText value={post.body as never} components={components} />}
        </div>

        <div className="mt-16 bg-[#0f2d54] rounded-2xl p-8 text-center">
          <h3 className="font-black text-white text-xl mb-2">Ready to Start a Project?</h3>
          <p className="text-white/70 text-sm mb-6">Get in touch with our team for a free consultation and competitive quote.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="bg-[#e8820c] hover:bg-[#d4730a] text-white px-6 py-3 rounded-full font-bold text-sm transition-colors">
              Contact Us
            </Link>
            <Link href="/book" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold text-sm transition-colors">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
