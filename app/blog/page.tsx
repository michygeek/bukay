import type { Metadata } from "next";
import { getPosts } from "@/lib/sanity";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PageHero from "@/app/components/PageHero";
import BlogListing from "@/app/components/BlogListing";

export const metadata: Metadata = {
  title: "Blog & Insights | Bukay Global Services",
  description: "Engineering insights, project updates, and industry news from Bukay Global Services.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <Navbar />
      <PageHero
        badge="Insights & Updates"
        title="Our Blog"
        description="Engineering insights, project milestones, and industry knowledge from the Bukay Global team."
      />
      <BlogListing initialPosts={posts} />
      <Footer />
    </>
  );
}
