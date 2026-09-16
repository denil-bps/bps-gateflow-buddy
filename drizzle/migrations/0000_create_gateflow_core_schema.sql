DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'gate_system');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.student_status AS ENUM ('on_campus', 'outside');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.movement_type AS ENUM ('Personal Leave', 'On Duty', 'Medical', 'Home Leave', 'Outing', 'Other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL DEFAULT 'BPS User',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL UNIQUE,
  name text NOT NULL,
  class_name text NOT NULL,
  section text NOT NULL,
  house text NOT NULL,
  house_no text,
  photo_url text,
  qr_id text NOT NULL UNIQUE,
  qr_blocked boolean NOT NULL DEFAULT false,
  current_status public.student_status NOT NULL DEFAULT 'on_campus',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.gate_passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pass_no text NOT NULL UNIQUE,
  student_id uuid NOT NULL REFERENCES public.students(id),
  vehicle_no text,
  going_with text NOT NULL,
  movement_type public.movement_type NOT NULL,
  purpose text NOT NULL,
  out_at timestamptz NOT NULL DEFAULT now(),
  in_at timestamptz,
  who_dropped text,
  expected_return timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'overridden')),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.gate_passes TO authenticated;
GRANT ALL ON public.gate_passes TO service_role;
ALTER TABLE public.gate_passes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.visitor_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_pass_id text NOT NULL UNIQUE,
  head_name text NOT NULL,
  email text,
  phone text,
  accompanying_names text[] NOT NULL DEFAULT '{}',
  in_at timestamptz NOT NULL DEFAULT now(),
  out_at timestamptz,
  vehicle_no text,
  whom_to_meet text NOT NULL,
  purpose text NOT NULL,
  status text NOT NULL DEFAULT 'inside' CHECK (status IN ('inside', 'completed')),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.visitor_groups TO authenticated;
GRANT ALL ON public.visitor_groups TO service_role;
ALTER TABLE public.visitor_groups ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.public_display_state (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  mode text NOT NULL DEFAULT 'idle' CHECK (mode IN ('idle', 'student_scan', 'student_identified', 'student_out', 'student_in', 'visitor_registration', 'visitor_in', 'visitor_out', 'access_denied', 'invalid_qr')),
  headline text NOT NULL DEFAULT 'WELCOME TO BIRLA PUBLIC SCHOOL, PILANI',
  detail text NOT NULL DEFAULT 'Please proceed to the security desk for entry or exit.',
  safe_name text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.public_display_state TO anon;
GRANT SELECT, INSERT, UPDATE ON public.public_display_state TO authenticated;
GRANT ALL ON public.public_display_state TO service_role;
ALTER TABLE public.public_display_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles own read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles own insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles own update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin')) WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "roles own read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin or gate read students" ON public.students FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system'));
CREATE POLICY "admin or gate create students" ON public.students FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin or gate update students" ON public.students FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system'));

CREATE POLICY "admin or gate read gate passes" ON public.gate_passes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system'));
CREATE POLICY "admin or gate create gate passes" ON public.gate_passes FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system'));
CREATE POLICY "admin or gate update gate passes" ON public.gate_passes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system'));

CREATE POLICY "admin or gate read visitor groups" ON public.visitor_groups FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system'));
CREATE POLICY "admin or gate create visitor groups" ON public.visitor_groups FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system'));
CREATE POLICY "admin or gate update visitor groups" ON public.visitor_groups FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system'));

CREATE POLICY "admin or gate read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system'));
CREATE POLICY "admin or gate write audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system'));

CREATE POLICY "public display is readable" ON public.public_display_state FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin or gate write public display" ON public.public_display_state FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system'));
CREATE POLICY "admin or gate update public display" ON public.public_display_state FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gate_system'));

CREATE INDEX students_status_idx ON public.students(current_status);
CREATE INDEX students_name_idx ON public.students(name);
CREATE INDEX gate_passes_student_status_idx ON public.gate_passes(student_id, status);
CREATE INDEX gate_passes_out_at_idx ON public.gate_passes(out_at);
CREATE INDEX visitor_groups_status_idx ON public.visitor_groups(status);
CREATE INDEX visitor_groups_in_at_idx ON public.visitor_groups(in_at);
CREATE INDEX audit_logs_created_at_idx ON public.audit_logs(created_at DESC);

ALTER PUBLICATION supabase_realtime ADD TABLE public.public_display_state;