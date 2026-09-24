CREATE OR REPLACE FUNCTION public.stamp_gateflow_server_times()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_TABLE_NAME = 'gate_passes' THEN
    IF TG_OP = 'INSERT' THEN
      NEW.out_at := statement_timestamp();
      NEW.created_at := statement_timestamp();
    ELSIF OLD.status = 'active' AND NEW.status IN ('completed', 'overridden') THEN
      NEW.in_at := statement_timestamp();
      NEW.out_at := OLD.out_at;
      NEW.created_at := OLD.created_at;
    ELSE
      NEW.out_at := OLD.out_at;
      NEW.in_at := OLD.in_at;
      NEW.created_at := OLD.created_at;
    END IF;
  ELSIF TG_TABLE_NAME = 'visitor_groups' THEN
    IF TG_OP = 'INSERT' THEN
      NEW.in_at := statement_timestamp();
      NEW.created_at := statement_timestamp();
      NEW.out_at := NULL;
    ELSIF OLD.status = 'inside' AND NEW.status = 'completed' THEN
      NEW.out_at := statement_timestamp();
      NEW.in_at := OLD.in_at;
      NEW.created_at := OLD.created_at;
    ELSE
      NEW.in_at := OLD.in_at;
      NEW.out_at := OLD.out_at;
      NEW.created_at := OLD.created_at;
    END IF;
  ELSIF TG_TABLE_NAME = 'students' THEN
    IF TG_OP = 'INSERT' THEN
      NEW.created_at := statement_timestamp();
    ELSE
      NEW.created_at := OLD.created_at;
    END IF;
    NEW.updated_at := statement_timestamp();
  ELSIF TG_TABLE_NAME = 'public_display_state' THEN
    NEW.updated_at := statement_timestamp();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER gateflow_server_timestamps_students
BEFORE INSERT OR UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.stamp_gateflow_server_times();

CREATE TRIGGER gateflow_server_timestamps_gate_passes
BEFORE INSERT OR UPDATE ON public.gate_passes
FOR EACH ROW EXECUTE FUNCTION public.stamp_gateflow_server_times();

CREATE TRIGGER gateflow_server_timestamps_visitor_groups
BEFORE INSERT OR UPDATE ON public.visitor_groups
FOR EACH ROW EXECUTE FUNCTION public.stamp_gateflow_server_times();

CREATE TRIGGER gateflow_server_timestamps_public_display
BEFORE INSERT OR UPDATE ON public.public_display_state
FOR EACH ROW EXECUTE FUNCTION public.stamp_gateflow_server_times();