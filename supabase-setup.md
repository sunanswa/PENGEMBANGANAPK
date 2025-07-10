# Setup Database Tables untuk Authentication & Role Management

Jalankan SQL berikut di Supabase SQL Editor:

## 1. Buat Tabel Profiles
```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('recruiter', 'applicant')) DEFAULT 'applicant',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## 2. Update Job Postings RLS Policies
```sql
-- Drop existing policy
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON job_postings;

-- Create new policies based on roles
CREATE POLICY "Recruiters can manage job postings" ON job_postings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'recruiter'
    )
  );

CREATE POLICY "Everyone can view active job postings" ON job_postings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can view all job postings" ON job_postings
  FOR SELECT USING (auth.role() = 'authenticated');
```

## 3. Create Function untuk Auto-create Profile
```sql
-- Function to automatically create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'applicant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 4. Setup Google OAuth (Optional)
1. Buka Supabase Dashboard > Authentication > Providers
2. Enable Google provider
3. Masukkan Google OAuth credentials
4. Tambahkan redirect URL: `http://localhost:5173/auth/callback`

## 5. Test Data (Optional)
```sql
-- Insert test recruiter account
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@swapro.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

Setelah menjalankan SQL di atas, aplikasi akan siap untuk:
- Login/Register dengan email & password
- Login dengan Google OAuth
- Manajemen role (recruiter/applicant)
- Dashboard yang berbeda berdasarkan role