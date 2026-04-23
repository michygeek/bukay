const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const API_VERSION = "2024-01-01";

async function query<T>(groq: string, fallback: T): Promise<T> {
  if (!PROJECT_ID || PROJECT_ID === "your-project-id") return fallback;
  try {
    const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(groq)}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return fallback;
    const { result } = await res.json();
    return result ?? fallback;
  } catch {
    return fallback;
  }
}

// Builds a Sanity image CDN URL from an asset reference like "image-abc123-800x600-jpg"
export function sanityImageUrl(ref: string, width = 800): string {
  // ref format: image-{id}-{dimensions}-{format}
  const [, id, dims, fmt] = ref.split("-");
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${fmt}?w=${width}&auto=format`;
}

export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  coverImage?: { asset: { _ref: string }; alt?: string };
  category: string;
  author: string;
  publishedAt: string;
  body?: unknown[];
}

const POST_FIELDS = `
  _id, title, slug, excerpt,
  coverImage { asset, alt },
  category, author, publishedAt
`;

export async function getPosts(): Promise<SanityPost[]> {
  return query<SanityPost[]>(
    `*[_type == "post"] | order(publishedAt desc) { ${POST_FIELDS} }`,
    []
  );
}

export async function getPost(slug: string): Promise<SanityPost | null> {
  const results = await query<SanityPost[]>(
    `*[_type == "post" && slug.current == "${slug}"][0..0] { ${POST_FIELDS}, body }`,
    []
  );
  return results?.[0] ?? null;
}
