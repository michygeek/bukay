"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { sanityImageUrl, type SanityPost } from "@/lib/sanity";

const CATEGORIES = ["All", "News", "Projects", "Engineering", "Industry", "Company"];

export default function BlogListing({ initialPosts }: { initialPosts: SanityPost[] }) {
  const [filter, setFilter] = useState("All");

  const posts = filter === "All" ? initialPosts : initialPosts.filter((p) => p.category === filter);

  return (
    <section className="py-16 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-2 flex-wrap mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                filter === cat
                  ? "bg-[#0f2d54] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#0f2d54]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg font-semibold">No posts yet</p>
            <p className="text-sm mt-1">Check back soon for updates from our team.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {posts.map((post) => {
              const coverUrl = post.coverImage?.asset?._ref
                ? sanityImageUrl(post.coverImage.asset._ref, 800)
                : null;
              return (
                <article
                  key={post._id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  {coverUrl ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={coverUrl}
                        alt={post.coverImage?.alt ?? post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-linear-to-br from-[#0f2d54] to-[#1b4880] flex items-center justify-center">
                      <span className="text-4xl font-black text-white/20">BGS</span>
                    </div>
                  )}
                  <div className="p-6">
                    <span className="inline-block bg-[#e8820c]/10 text-[#e8820c] text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                      {post.category}
                    </span>
                    <h2 className="font-black text-[#0f2d54] text-lg leading-snug mb-2 group-hover:text-[#e8820c] transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug.current}`}>{post.title}</Link>
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><User size={11} />{post.author}</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(post.publishedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <Link
                        href={`/blog/${post.slug.current}`}
                        className="flex items-center gap-1 text-xs font-bold text-[#e8820c] hover:gap-2 transition-all"
                      >
                        Read <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
