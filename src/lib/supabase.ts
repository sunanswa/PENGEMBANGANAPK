import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Common placeholder values that indicate Supabase is not configured
const placeholderValues = [
  'undefined',
  'your_supabase_project_url_here',
  'your_supabase_anon_key_here',
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
];

// Check if we're in development mode without Supabase configured
const isDevelopmentMode = !supabaseUrl || 
                         !supabaseAnonKey || 
                         placeholderValues.includes(supabaseUrl) || 
                         placeholderValues.includes(supabaseAnonKey);

// Create a mock client for development mode
const createMockSupabaseClient = () => {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
    })
  };
};

// Initialize Supabase client or mock client
let supabase: any;

if (isDevelopmentMode) {
  supabase = createMockSupabaseClient();
  console.warn('⚠️ Running in development mode without Supabase configuration. Authentication and database features will be mocked.');
  if (supabaseUrl && placeholderValues.includes(supabaseUrl)) {
    console.warn('💡 Detected placeholder Supabase URL. Please update your .env file with actual Supabase credentials.');
  }
} else {
  try {
    // Validate URL format before creating client
    new URL(supabaseUrl);
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    supabase = createMockSupabaseClient();
    console.warn('⚠️ Invalid Supabase URL format detected. Falling back to development mode.');
    console.warn('💡 Please check your .env file and ensure VITE_SUPABASE_URL contains a valid URL.');
  }
}

export { supabase };



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
export const signUp = async (email: string, password: string, fullName: string, role: 'admin' | 'applicant') => {
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
      redirectTo: `${window.location.origin}`,
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