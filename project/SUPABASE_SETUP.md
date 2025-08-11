# Supabase JWT Authentication Setup

This project now uses Supabase for JWT-based authentication. Follow these steps to set up your Supabase project and configure the application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be set up (this may take a few minutes)

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (something like `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

## 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 4. Set Up Database Schema

Run the following SQL in your Supabase SQL Editor to create the necessary tables:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'facility_owner', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'fullName', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 5. Configure Authentication Settings

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Configure the following settings:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add any additional URLs you need
   - **Email Templates**: Customize if needed
   - **Email Auth**: Enable if you want email/password authentication
   - **Confirm email**: Enable if you want users to verify their email

## 6. Available Authentication Methods

The implementation supports:
- **Email/Password Registration**: `signUpWithEmail()`
- **Email/Password Login**: `signInWithEmail()`
- **Email Verification**: `verifyOTP()`
- **Password Reset**: `resetPassword()`
- **Password Update**: `updatePassword()`
- **Logout**: `logout()`

## 7. User Roles

The system supports three user roles:
- `user`: Regular users who can book facilities
- `facility_owner`: Users who can manage venues
- `admin`: Administrative users with full access

## 8. JWT Token Handling

The Supabase client automatically handles:
- JWT token storage and retrieval
- Token refresh when expired
- Session persistence across browser sessions
- Secure token storage

## 9. Start Development

```bash
npm run dev
```

Your application should now be running with Supabase JWT authentication!

## Troubleshooting

### Common Issues:

1. **Environment variables not loading**: Make sure your `.env.local` file is in the project root and the variables start with `VITE_`

2. **Database connection errors**: Verify your Supabase URL and API key are correct

3. **Email not sending**: Check your email configuration in Supabase dashboard

4. **RLS policies**: Make sure Row Level Security policies are set up correctly for your use case

### Getting Help:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/auth-signup)