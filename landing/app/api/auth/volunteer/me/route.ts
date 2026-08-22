import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const volunteerId = cookieStore.get('volunteer_session')?.value;

    if (!volunteerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseKey = supabaseServiceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const { data: volunteer, error } = await supabaseAdmin
      .from('volunteers')
      .select('id, name, email, mobile, status, party_id')
      .eq('id', volunteerId)
      .maybeSingle();

    if (error || !volunteer) {
      console.error('Supabase fetch error for volunteer:', error);
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    return NextResponse.json({ volunteer });
  } catch (error) {
    console.error('Fetch volunteer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
