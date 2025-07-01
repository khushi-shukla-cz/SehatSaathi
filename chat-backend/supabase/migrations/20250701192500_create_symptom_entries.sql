-- Create symptom_entries table
CREATE TABLE IF NOT EXISTS public.symptom_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  symptom TEXT NOT NULL,
  severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 5),
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.symptom_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own entries" 
ON public.symptom_entries
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries" 
ON public.symptom_entries
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" 
ON public.symptom_entries
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" 
ON public.symptom_entries
FOR DELETE USING (auth.uid() = user_id);
