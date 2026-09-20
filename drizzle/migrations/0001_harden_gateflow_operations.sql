CREATE UNIQUE INDEX IF NOT EXISTS gate_passes_one_active_student_idx ON public.gate_passes(student_id) WHERE status = 'active';

CREATE OR REPLACE FUNCTION public.enforce_gate_system_update_scope()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'gate_system') AND NOT public.has_role(auth.uid(), 'admin') THEN
    IF TG_TABLE_NAME = 'students' THEN
      IF NEW.student_id IS DISTINCT FROM OLD.student_id
        OR NEW.name IS DISTINCT FROM OLD.name
        OR NEW.class_name IS DISTINCT FROM OLD.class_name
        OR NEW.section IS DISTINCT FROM OLD.section
        OR NEW.house IS DISTINCT FROM OLD.house
        OR NEW.house_no IS DISTINCT FROM OLD.house_no
        OR NEW.photo_url IS DISTINCT FROM OLD.photo_url
        OR NEW.qr_id IS DISTINCT FROM OLD.qr_id
        OR NEW.qr_blocked IS DISTINCT FROM OLD.qr_blocked THEN
        RAISE EXCEPTION 'Gate System may update student status only';
      END IF;
    ELSIF TG_TABLE_NAME = 'gate_passes' THEN
      IF NEW.pass_no IS DISTINCT FROM OLD.pass_no
        OR NEW.student_id IS DISTINCT FROM OLD.student_id
        OR NEW.vehicle_no IS DISTINCT FROM OLD.vehicle_no
        OR NEW.going_with IS DISTINCT FROM OLD.going_with
        OR NEW.movement_type IS DISTINCT FROM OLD.movement_type
        OR NEW.purpose IS DISTINCT FROM OLD.purpose
        OR NEW.out_at IS DISTINCT FROM OLD.out_at
        OR NEW.expected_return IS DISTINCT FROM OLD.expected_return
        OR NEW.created_by IS DISTINCT FROM OLD.created_by
        OR NEW.created_at IS DISTINCT FROM OLD.created_at
        OR NEW.status NOT IN ('completed') THEN
        RAISE EXCEPTION 'Gate System may complete active gate passes only';
      END IF;
    ELSIF TG_TABLE_NAME = 'visitor_groups' THEN
      IF NEW.visitor_pass_id IS DISTINCT FROM OLD.visitor_pass_id
        OR NEW.head_name IS DISTINCT FROM OLD.head_name
        OR NEW.email IS DISTINCT FROM OLD.email
        OR NEW.phone IS DISTINCT FROM OLD.phone
        OR NEW.accompanying_names IS DISTINCT FROM OLD.accompanying_names
        OR NEW.in_at IS DISTINCT FROM OLD.in_at
        OR NEW.vehicle_no IS DISTINCT FROM OLD.vehicle_no
        OR NEW.whom_to_meet IS DISTINCT FROM OLD.whom_to_meet
        OR NEW.purpose IS DISTINCT FROM OLD.purpose
        OR NEW.created_by IS DISTINCT FROM OLD.created_by
        OR NEW.created_at IS DISTINCT FROM OLD.created_at
        OR NEW.status NOT IN ('completed') THEN
        RAISE EXCEPTION 'Gate System may complete visitor groups only';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS gate_system_students_update_scope ON public.students;
CREATE TRIGGER gate_system_students_update_scope
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.enforce_gate_system_update_scope();

DROP TRIGGER IF EXISTS gate_system_gate_passes_update_scope ON public.gate_passes;
CREATE TRIGGER gate_system_gate_passes_update_scope
BEFORE UPDATE ON public.gate_passes
FOR EACH ROW EXECUTE FUNCTION public.enforce_gate_system_update_scope();

DROP TRIGGER IF EXISTS gate_system_visitor_groups_update_scope ON public.visitor_groups;
CREATE TRIGGER gate_system_visitor_groups_update_scope
BEFORE UPDATE ON public.visitor_groups
FOR EACH ROW EXECUTE FUNCTION public.enforce_gate_system_update_scope();

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.gate_passes;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.visitor_groups;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;