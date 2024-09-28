import UserType from "@/types/user-type";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();
    if (request.nextUrl.pathname !== "/sign-in" && user.error) {
      // 로그인 정보가 없으면 로그인 페이지로
      console.log("Redirect to Sign in");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (!user.error) {
      if (request.nextUrl.pathname === "/sign-in") {
        // 로그인 정보가 있는데 로그인 페이지로 가려하면 메인으로
        console.log("Redirect to Main");
        return NextResponse.redirect(new URL("/", request.url));
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.data.user?.id)
        .single();

      if (
        request.nextUrl.pathname !== "/access-denied" &&
        !(profile && profile.type === UserType.ADMIN)
      ) {
        // 로그인한 유저가 관리자가 아니면 접근 금지 페이지로
        console.log("Redirect to Access Denied");
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
