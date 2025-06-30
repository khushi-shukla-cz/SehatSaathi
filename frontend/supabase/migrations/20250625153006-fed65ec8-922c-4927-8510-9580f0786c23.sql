
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  blood_type TEXT,
  allergies TEXT[],
  medical_conditions TEXT[],
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create healthcare providers table
CREATE TABLE public.healthcare_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  license_number TEXT,
  phone TEXT,
  email TEXT,
  office_address TEXT,
  bio TEXT,
  years_experience INTEGER,
  rating DECIMAL(3,2) DEFAULT 0.00,
  is_available BOOLEAN DEFAULT true,
  consultation_fee DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.healthcare_providers(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  type TEXT NOT NULL CHECK (type IN ('in_person', 'video_call', 'phone_call')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider_id, appointment_date, appointment_time)
);

-- Create medical records table
CREATE TABLE public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.healthcare_providers(id),
  record_type TEXT NOT NULL CHECK (record_type IN ('visit_notes', 'lab_results', 'imaging', 'prescription', 'vaccination', 'surgery', 'diagnosis')),
  title TEXT NOT NULL,
  content TEXT,
  record_date DATE NOT NULL,
  file_url TEXT,
  is_sensitive BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medications table
CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.healthcare_providers(id),
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  instructions TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  pills_total INTEGER,
  pills_remaining INTEGER,
  refill_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health metrics table
CREATE TABLE public.health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('blood_pressure', 'heart_rate', 'weight', 'height', 'blood_sugar', 'temperature', 'oxygen_saturation', 'bmi')),
  value DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table for secure messaging
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('patient', 'provider')),
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  thread_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create telemedicine sessions table
CREATE TABLE public.telemedicine_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  session_url TEXT,
  session_start_time TIMESTAMP WITH TIME ZONE,
  session_end_time TIMESTAMP WITH TIME ZONE,
  session_type TEXT NOT NULL CHECK (session_type IN ('video', 'phone', 'chat')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.healthcare_providers(id),
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  refills_allowed INTEGER DEFAULT 0,
  instructions TEXT,
  prescribed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_filled BOOLEAN DEFAULT false,
  pharmacy_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemedicine_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for healthcare providers (public read access)
CREATE POLICY "Anyone can view healthcare providers" ON public.healthcare_providers
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for appointments
CREATE POLICY "Patients can view their own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create their own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Patients can delete their own appointments" ON public.appointments
  FOR DELETE USING (auth.uid() = patient_id);

-- RLS Policies for medical records
CREATE POLICY "Patients can view their own medical records" ON public.medical_records
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create their own medical records" ON public.medical_records
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- RLS Policies for medications
CREATE POLICY "Patients can view their own medications" ON public.medications
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can manage their own medications" ON public.medications
  FOR ALL USING (auth.uid() = patient_id);

-- RLS Policies for health metrics
CREATE POLICY "Patients can view their own health metrics" ON public.health_metrics
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create their own health metrics" ON public.health_metrics
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own health metrics" ON public.health_metrics
  FOR UPDATE USING (auth.uid() = patient_id);

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for telemedicine sessions
CREATE POLICY "Patients can view their telemedicine sessions" ON public.telemedicine_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.appointments 
      WHERE appointments.id = telemedicine_sessions.appointment_id 
      AND appointments.patient_id = auth.uid()
    )
  );

-- RLS Policies for prescriptions
CREATE POLICY "Patients can view their own prescriptions" ON public.prescriptions
  FOR SELECT USING (auth.uid() = patient_id);

-- Create trigger function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample healthcare providers
INSERT INTO public.healthcare_providers (first_name, last_name, specialty, license_number, phone, email, office_address, bio, years_experience, rating, consultation_fee) VALUES
('Sarah', 'Johnson', 'Cardiology', 'MD12345', '(555) 123-4567', 'sarah.johnson@healthportal.com', '123 Medical Center Dr, Suite 200', 'Board-certified cardiologist with 15 years of experience specializing in preventive cardiology and heart disease management.', 15, 4.9, 250.00),
('Michael', 'Chen', 'Primary Care', 'MD67890', '(555) 234-5678', 'michael.chen@healthportal.com', '456 Family Health Blvd, Suite 100', 'Family medicine physician dedicated to comprehensive primary care for patients of all ages.', 12, 4.8, 150.00),
('Emily', 'Rodriguez', 'Dermatology', 'MD11111', '(555) 345-6789', 'emily.rodriguez@healthportal.com', '789 Skin Care Center, Suite 300', 'Dermatologist specializing in medical and cosmetic dermatology with expertise in skin cancer prevention.', 10, 4.9, 200.00),
('James', 'Wilson', 'Mental Health', 'MD22222', '(555) 456-7890', 'james.wilson@healthportal.com', '321 Wellness Center, Suite 400', 'Licensed psychiatrist with focus on anxiety, depression, and cognitive behavioral therapy.', 8, 4.8, 180.00),
('Lisa', 'Thompson', 'Pediatrics', 'MD33333', '(555) 567-8901', 'lisa.thompson@healthportal.com', '654 Children Medical Center, Suite 150', 'Pediatrician with 20 years of experience providing comprehensive care for infants, children, and adolescents.', 20, 4.95, 175.00);
