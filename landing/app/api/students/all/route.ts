import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceRoleKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY in environment variables.");
      return NextResponse.json({ error: "Server Configuration Error." }, { status: 500 });
    }

    // Initialize Supabase with the Service Role Key to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Fetch only the necessary fields for autocomplete from all students
    const { data, error } = await supabaseAdmin
      .from('students')
      .select('id, name, roll, dept, year')
      .order('name');

    if (error) {
      console.error('Supabase Admin Fetch Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      students: data || []
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
