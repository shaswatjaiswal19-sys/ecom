import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="24" fill="url(#grad)" />
  <circle cx="50" cy="50" r="32" fill="#FFFFFF" opacity="0.15"/>
  <text x="50" y="59" font-size="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">S</text>
  <circle cx="72" cy="28" r="6" fill="#FBBF24" />
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
