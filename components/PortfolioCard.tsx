"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import type { PortfolioPost } from "@/types/database";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PortfolioCard({ post }: { post: PortfolioPost }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      {post.video_url ? (
        <video
          controls
          preload="metadata"
          poster={post.image_url ?? undefined}
          className="h-48 w-full bg-black object-cover"
        >
          <source src={post.video_url} />
        </video>
      ) : post.image_url ? (
        <div className="relative h-48 w-full bg-slate-100">
          <Image src={post.image_url} alt={post.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        {post.category && (
          <span className="mb-2 inline-block w-fit rounded-full bg-navy/10 px-3 py-1 text-xs font-semibold text-navy">
            {post.category}
          </span>
        )}
        <h3 className="text-lg font-bold text-navy">{post.title}</h3>
        <div className="prose prose-sm mt-2 max-w-none text-slate-600">
          <ReactMarkdown>{post.description}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
