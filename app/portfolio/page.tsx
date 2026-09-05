import { redirect } from "next/navigation";

// "Our Work" now lives on the Services page — keep this route working for any
// existing links or bookmarks.
export default function PortfolioRedirect() {
  redirect("/services#our-work");
}
