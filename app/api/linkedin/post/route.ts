import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { shareToLinkedIn } from "@/lib/linkedin";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text, imageUrl } = await request.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing post text" }, { status: 400 });
  }

  try {
    await shareToLinkedIn(text, imageUrl ?? null);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "LinkedIn post failed" },
      { status: 500 }
    );
  }
}
