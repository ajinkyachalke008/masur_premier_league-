
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id TEXT NOT NULL UNIQUE DEFAULT ('MPL-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  user_id UUID,
  full_name TEXT NOT NULL,
  jersey_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  city TEXT,
  full_address TEXT,
  mobile_number TEXT,
  profile_photo_url TEXT,
  gov_id_url TEXT,
  playing_role TEXT,
  batting_style TEXT,
  bowling_style TEXT,
  preferred_batting_order TEXT,
  experience_level TEXT,
  current_club TEXT,
  highest_level_played TEXT,
  awards_achievements TEXT,
  video_highlights_link TEXT,
  resume_url TEXT,
  batting_skill INT,
  bowling_skill INT,
  fielding_skill INT,
  fitness_skill INT,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.players TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.players TO authenticated;
GRANT ALL ON public.players TO service_role;

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a registration"
  ON public.players FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own registration"
  ON public.players FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can upload player files"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'player-files');

CREATE POLICY "Anyone can read player files"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'player-files');
