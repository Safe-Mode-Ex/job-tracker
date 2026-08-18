import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";
import { ApiRoute } from "./lib/enums";

export default async function proxy(request: NextRequest) {
  const session = await getSession();

  const isDashboardPage = request.nextUrl.pathname.startsWith(ApiRoute.Dashboard);

  if (isDashboardPage && !session?.user) {
    return NextResponse.redirect(new URL(ApiRoute.SignIn, request.url));
  }

  const isSignInPage = request.nextUrl.pathname.startsWith(ApiRoute.SignIn);
  const isSignUpPage = request.nextUrl.pathname.startsWith(ApiRoute.SignUp);

  if ((isSignInPage || isSignUpPage) && session?.user) {
    return NextResponse.redirect(new URL(ApiRoute.Dashboard, request.url));
  }

  return NextResponse.next();
}
