import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Fetch volunteer by email
    const { data: volunteer, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error || !volunteer) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 2. Compare password with hashed password
    const isValid = await bcrypt.compare(password, volunteer.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 3. Establish Volunteer Session (Cookie)
    const cookieStore = await cookies();
    cookieStore.set('volunteer_session', volunteer.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return NextResponse.json({ success: true, volunteer });
  } catch (error) {
    console.error('Volunteer login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
