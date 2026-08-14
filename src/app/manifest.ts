import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shaswat Ecom - Quality Groceries. Trusted Service.",
    short_name: "Shaswat Ecom",
    description: "India's premier supermarket for 100% farm-fresh organic produce and heritage groceries.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#f59e0b",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
