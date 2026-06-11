import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  // Delete the session cookie
  cookieStore.delete('session');

  // Redirect back to /login on the SAME host the request came in on.
  // Behind a proxy (e.g. GitHub Codespaces) the public host is in
  // x-forwarded-host; fall back to the normal host header, then localhost.
  const host =
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') ?? 'http';

  const response = NextResponse.redirect(`${proto}://${host}/login`);

  // Ensure cookie is deleted in the response as well
  response.cookies.delete('session');

  return response;
}
