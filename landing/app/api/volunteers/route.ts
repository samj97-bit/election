import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

// Function to generate a random 8-character alphanumeric password
function generatePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, roll, mobile, dept, year, task, party_id, friends } = data;

    if (!name || !email || !party_id) {
      return NextResponse.json({ error: 'Name, email, and party_id are required' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !userData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Generate plain-text password
    const plainPassword = generatePassword();

    // 2. Hash the password (first with SHA-256 to match client, then bcrypt)
    const sha256Hash = crypto.createHash('sha256').update(plainPassword).digest('hex');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(sha256Hash, saltRounds);

    // 3. Create an authenticated Supabase client using the user's token
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabaseAuth = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    // 4. Save to Supabase using the authenticated client so RLS passes
    const { data: volunteerData, error } = await supabaseAuth.from('volunteers').insert([{
      party_id,
      name,
      email,
      mobile: mobile || 'Unknown',
      department: dept || 'Unknown',
      year: year || 'Unknown',
      tasks: task || 'Unassigned',
      password_hash: hashedPassword,
      status: 'Active',
      friends: friends && friends.length > 0 ? friends : []
    }]).select();

    if (error) {
       console.error("Supabase Error:", error);
       return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!volunteerData || volunteerData.length === 0) {
       console.error("Insert failed silently (likely RLS policy restriction).");
       return NextResponse.json({ error: 'Database blocked the insert. Please check your Supabase Row Level Security (RLS) policies for the volunteers table.' }, { status: 403 });
    }

    // 5. Return the generated credentials
    return NextResponse.json({
      success: true,
      message: 'Volunteer added successfully',
      volunteer: volunteerData[0],
      credentials: {
        email: email,
        password: plainPassword
      }
    });
  } catch (error) {
    console.error('Error generating volunteer credentials:', error);
    return NextResponse.json({ error: 'Failed to process volunteer' }, { status: 500 });
  }
}
