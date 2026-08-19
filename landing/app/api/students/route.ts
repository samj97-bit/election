import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceRoleKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY in environment variables.");
      return NextResponse.json({ error: "Server Configuration Error: Please RESTART your Next.js development server so it can read the new .env.local variables!" }, { status: 500 });
    }

    // Initialize Supabase with the Service Role Key to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    const studentData = await request.json();

    if (!studentData.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Insert student using the admin client
    const { data, error } = await supabaseAdmin
      .from('students')
      .insert([studentData])
      .select();

    if (error) {
      console.error('Supabase Admin Insert Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Student added successfully',
      student: data ? data[0] : null
    });
  } catch (error) {
    console.error('Error inserting student:', error);
    return NextResponse.json({ error: 'Failed to insert student' }, { status: 500 });
  }
}
