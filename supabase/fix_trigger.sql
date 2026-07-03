-- Fix the handle_new_user trigger that is blocking all registrations
-- The original trigger had a COALESCE type mismatch (text vs user_role enum)
-- This version adds explicit casting + EXCEPTION handler so signup never fails

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_role user_role;
BEGIN
  -- Safely cast the role from metadata, fall back to 'student' if invalid/missing
  BEGIN
    v_role := (NEW.raw_user_meta_data->>'role')::user_role;
  EXCEPTION WHEN OTHERS THEN
    v_role := 'student'::user_role;
  END;

  IF v_role IS NULL THEN
    v_role := 'student'::user_role;
  END IF;

  INSERT INTO profiles (id, role)
  VALUES (NEW.id, v_role)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block signup even if profile creation fails
  RETURN NEW;
END;
$$;
