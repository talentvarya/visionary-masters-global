import type { Metadata } from "next";

// Unlisted page: reachable at /clients, but not linked from the site's
// navigation and kept out of search results until it's ready to launch.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
