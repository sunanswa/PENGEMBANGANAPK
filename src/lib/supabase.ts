import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface JobPosting {
  id: string;
  created_at: string;
  title: string;
  description: string;
  locations: string[];
  status: 'active' | 'closed' | 'draft';
  requirements?: string;
  salary_range?: string;
  employment_type?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: 'recruiter' | 'applicant';
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      job_postings: {
        Row: JobPosting;
        Insert: Omit<JobPosting, 'id' | 'created_at'>;
        Update: Partial<Omit<JobPosting, 'id' | 'created_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

// Auth helper functions
export const signUp = async (email: string, password: string, fullName: string, role: 'recruiter' | 'applicant') => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};