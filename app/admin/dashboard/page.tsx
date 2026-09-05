"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { LogOut, Pencil, Trash2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { PortfolioPost } from "@/types/database";
import PostForm from "./PostForm";
import UpdatesManager from "./UpdatesManager";
import SlidesManager from "./SlidesManager";
import GalleryManager from "./GalleryManager";
import ClientsManager from "./ClientsManager";
import ServiceImagesManager from "./ServiceImagesManager";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [posts, setPosts] = useState<PortfolioPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<PortfolioPost | null>(null);

  const loadPosts = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("portfolio_posts").select("*").order("created_at", { ascending: false });
    setPosts(data ?? []);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    loadPosts();
  }, [loadPosts]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function handleDelete(post: PortfolioPost) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    const supabase = createClient();
    await supabase.from("portfolio_posts").delete().eq("id", post.id);
    loadPosts();
  }

  function handleSaved() {
    setShowForm(false);
    setEditingPost(null);
    loadPosts();
  }

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-500">Loading...</div>;
  }

  if (!session) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-500">Redirecting to login...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Signed in as {session.user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="mt-8">
        {showForm ? (
          <PostForm
            session={session}
            editingPost={editingPost}
            onSaved={handleSaved}
            onCancel={() => {
              setShowForm(false);
              setEditingPost(null);
            }}
          />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light"
          >
            <Plus size={16} /> Add New Work Post
          </button>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-bold text-navy">All Posts ({posts.length})</h2>
        <div className="mt-4 space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800">{post.title}</p>
                <p className="text-xs text-slate-500">
                  {post.category ?? "Uncategorized"} · {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => {
                    setEditingPost(post);
                    setShowForm(true);
                  }}
                  className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(post)}
                  className="rounded-md border border-red-200 p-2 text-red-500 hover:bg-red-50"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p className="text-sm text-slate-500">No posts yet.</p>}
        </div>
      </div>

      <div className="mt-10">
        <SlidesManager session={session} />
      </div>

      <div className="mt-10">
        <ServiceImagesManager session={session} />
      </div>

      <div className="mt-10">
        <GalleryManager session={session} />
      </div>

      <div className="mt-10">
        <UpdatesManager />
      </div>

      <div className="mt-10">
        <ClientsManager session={session} />
      </div>
    </div>
  );
}
