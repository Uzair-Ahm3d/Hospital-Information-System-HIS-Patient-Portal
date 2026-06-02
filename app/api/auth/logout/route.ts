import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  // Delete the session cookie
  cookieStore.delete('session');
  
  // Create redirect response
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  
  // Ensure cookie is deleted in the response as well
  response.cookies.delete('session');
  
  return response;
}
