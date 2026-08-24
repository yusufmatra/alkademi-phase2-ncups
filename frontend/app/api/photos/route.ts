import { NextRequest, NextResponse } from "next/server";

type UnsplashPhoto = {
  urls: { regular: string };
  alt_description: string | null;
  links: { html: string };
  user: { name: string; links: { html: string } };
};

const destinationAliases: Record<string, string> = {
  jerman: "Germany",
  jepang: "Japan",
  korea: "South Korea",
  "korea selatan": "South Korea",
  belanda: "Netherlands",
  swiss: "Switzerland",
  inggris: "United Kingdom",
  prancis: "France",
  italia: "Italy",
  spanyol: "Spain",
  amerika: "United States",
  "amerika serikat": "United States",
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { error: "UNSPLASH_ACCESS_KEY is not configured." },
      { status: 500 },
    );
  }

  if (!query) {
    return NextResponse.json({ error: "A destination query is required." }, { status: 400 });
  }

  const normalizedQuery = destinationAliases[query.toLowerCase()] || query;

  const searchParams = new URLSearchParams({
    query: `${normalizedQuery} tourist attraction landmark`,
    per_page: "1",
    orientation: "landscape",
  });

  const response = await fetch(
    `https://api.unsplash.com/search/photos?${searchParams.toString()}`,
    {
      headers: { Authorization: `Client-ID ${accessKey}` },
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Unable to search Unsplash photos." },
      { status: response.status },
    );
  }

  const data = (await response.json()) as { results: UnsplashPhoto[] };
  const photo = data.results[0];

  if (!photo) {
    return NextResponse.json({ error: "No destination photo found." }, { status: 404 });
  }

  return NextResponse.json({
    imageUrl: photo.urls.regular,
    alt: photo.alt_description || `Tourist attraction in ${normalizedQuery}`,
    photographerName: photo.user.name,
    photographerUrl: photo.user.links.html,
    unsplashUrl: photo.links.html,
  });
}
