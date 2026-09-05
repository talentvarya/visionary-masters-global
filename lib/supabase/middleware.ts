import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // This Supabase project's auth pool is shared with another app, so simply
  // being signed in is NOT enough — the user must be on the site_admins
  // allowlist to reach the website's admin area.
  let isSiteAdmin = false;
  if (user) {
    const { data: adminRow } = await supabase
      .from("site_admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    isSiteAdmin = Boolean(adminRow);
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname.startsWith("/admin/login");

  if (isAdminRoute && !isLoginRoute && !isSiteAdmin) {
    const redirectUrl = new URL("/admin/login", request.url);
    if (user) redirectUrl.searchParams.set("error", "not-authorised");
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginRoute && isSiteAdmin) {
    const redirectUrl = new URL("/admin/dashboard", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
