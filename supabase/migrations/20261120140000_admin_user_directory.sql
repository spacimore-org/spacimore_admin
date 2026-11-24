CREATE TABLE IF NOT EXISTS public.admin_user_directory (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text,
  first_name text,
  last_name text,
  phone text,
  account_type text,
  account_role text,
  email_confirmed_at timestamptz,
  created_at timestamptz NOT NULL
);

ALTER TABLE public.admin_user_directory ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.admin_user_directory FROM anon, authenticated;
GRANT SELECT ON TABLE public.admin_user_directory TO authenticated;

DROP POLICY IF EXISTS "Admins can read user directory" ON public.admin_user_directory;
CREATE POLICY "Admins can read user directory"
  ON public.admin_user_directory
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

CREATE OR REPLACE FUNCTION public.sync_admin_user_directory()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.raw_app_meta_data ->> 'role' = 'admin' THEN
    DELETE FROM public.admin_user_directory WHERE id = NEW.id;
    RETURN NEW;
  END IF;

  INSERT INTO public.admin_user_directory (
    id,
    email,
    first_name,
    last_name,
    phone,
    account_type,
    account_role,
    email_confirmed_at,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(NEW.raw_user_meta_data ->> 'first_name', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NEW.phone),
    NEW.raw_user_meta_data ->> 'account_type',
    NEW.raw_user_meta_data ->> 'account_role',
    NEW.email_confirmed_at,
    NEW.created_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    account_type = EXCLUDED.account_type,
    account_role = EXCLUDED.account_role,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    created_at = EXCLUDED.created_at;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_admin_user_directory() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS sync_admin_user_directory_on_insert ON auth.users;
CREATE TRIGGER sync_admin_user_directory_on_insert
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_admin_user_directory();

DROP TRIGGER IF EXISTS sync_admin_user_directory_on_update ON auth.users;
CREATE TRIGGER sync_admin_user_directory_on_update
  AFTER UPDATE OF email, email_confirmed_at, raw_user_meta_data, raw_app_meta_data ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_admin_user_directory();

INSERT INTO public.admin_user_directory (
  id,
  email,
  first_name,
  last_name,
  phone,
  account_type,
  account_role,
  email_confirmed_at,
  created_at
)
SELECT
  users.id,
  users.email,
  NULLIF(users.raw_user_meta_data ->> 'first_name', ''),
  NULLIF(users.raw_user_meta_data ->> 'last_name', ''),
  COALESCE(users.raw_user_meta_data ->> 'phone', users.phone),
  users.raw_user_meta_data ->> 'account_type',
  users.raw_user_meta_data ->> 'account_role',
  users.email_confirmed_at,
  users.created_at
FROM auth.users AS users
WHERE users.raw_app_meta_data ->> 'role' IS DISTINCT FROM 'admin'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  account_type = EXCLUDED.account_type,
  account_role = EXCLUDED.account_role,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  created_at = EXCLUDED.created_at;
