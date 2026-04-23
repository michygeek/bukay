import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, sanityImageUrl } from "@/lib/sanity";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import BlogPost from "@/app/components/BlogPost";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Bukay Global Blog`,
    description: post.excerpt,
    openGraph: post.coverImage?.asset?._ref
      ? { images: [sanityImageUrl(post.coverImage.asset._ref, 1200)] }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return (
    <>
      <Navbar />
      <BlogPost post={post} />
      <Footer />
    </>
  );
}
