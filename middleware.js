// import { clerkMiddleware } from '@clerk/nextjs/server'

// export default clerkMiddleware({
//   publicRoutes:['/']
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }

import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  // Make the home route ("/") public
  publicRoutes: ['/', '/public-page', '/another-public-page'] // Add more public routes if needed
});

export const config = {
  matcher: [
    // Match all routes, but ignore Next.js internal files and static assets
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
