import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Use anon key as fallback, but warn that it might fail if RLS is enabled
    const supabaseKey = supabaseServiceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (!supabaseServiceRoleKey) {
      console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY is not set. Volunteer login might fail due to RLS policies.");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch volunteer by email
    const { data: volunteer, error } = await supabaseAdmin
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
