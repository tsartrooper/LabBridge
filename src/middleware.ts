
import { DEFAULT_LOGIN_REDIRECT, authRoutes, roleRoute } from "@/routes";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth(async (req) => {
    const { nextUrl } = req;

    const isAuthenticated = !!req.auth;  
    
    const isRoleRoute = roleRoute.includes(nextUrl.pathname);

    const userRole = req.auth?.user.role;
    
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    if (nextUrl.pathname.startsWith('/api') || nextUrl.pathname === '/api') {
        return NextResponse.next(); // Allow the request to proceed
    }

    if(isAuthenticated && !isRoleRoute && (userRole===undefined || userRole===null)){
        return NextResponse.redirect(new URL(roleRoute[0], nextUrl));
    }

    if ((isAuthRoute || isRoleRoute) && isAuthenticated && !(userRole===undefined || userRole===null))
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));

    if (!isAuthenticated && !isAuthRoute)
        return NextResponse.redirect(new URL("/sign-in", nextUrl));
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}