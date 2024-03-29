CREATE TYPE "public"."role" AS enum(
	'viewer',
	'editor',
	'admin'
);

CREATE TABLE "public"."general_overview"(
	"id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL,
	"thema" text,
	"typ" text,
	"datensatz_titel" text,
	"beschreibung" text,
	"raeumlicher_bezug" text,
	"verantwortlichkeit_bezirksebene" text,
	"ansprechperson_bezirksebene" text,
	"verantwortlichkeit_landesebene" text,
	"ansprechperson_landesebene" text,
	"datenhoheit_bei" text,
	"it_fachverfahren" text,
	"dateiformat" text,
	"datenqualitaet" text,
	"user_id" uuid
);

ALTER TABLE "public"."general_overview" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."user_profiles"(
	"id" uuid NOT NULL,
	"name" text,
	"created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"role" ROLE DEFAULT 'viewer' ::role
);

ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX general_overview_pkey ON public.general_overview USING btree(id);

CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree(id);

ALTER TABLE "public"."general_overview"
	ADD CONSTRAINT "general_overview_pkey" PRIMARY KEY USING INDEX "general_overview_pkey";

ALTER TABLE "public"."user_profiles"
	ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY USING INDEX "user_profiles_pkey";

ALTER TABLE "public"."general_overview"
	ADD CONSTRAINT "general_overview_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) NOT valid;

ALTER TABLE "public"."general_overview" validate CONSTRAINT "general_overview_user_id_fkey";

SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.handle_deleted_user()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	SECURITY DEFINER
	AS $function$
BEGIN
	DELETE FROM public.user_profiles
	WHERE id = OLD.id;
	RETURN old;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	SECURITY DEFINER
	AS $function$
BEGIN
	INSERT INTO public.user_profiles(id)
		VALUES(NEW.id);
	RETURN new;
END;
$function$;

CREATE POLICY "Allow users with role admin insert, select, update and delete" ON "public"."general_overview" AS permissive
	FOR ALL TO public
		USING ((user_id =(
			SELECT
				user_profiles.id
			FROM
				user_profiles
			WHERE (user_profiles.role = 'admin'::role))))
		WITH CHECK ((user_id =(
			SELECT
				user_profiles.id
			FROM
				user_profiles
			WHERE (user_profiles.role = 'admin'::role))));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."general_overview" AS permissive
	FOR DELETE TO authenticated, service_role
		USING ((auth.uid() = user_id));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."general_overview" AS permissive
	FOR INSERT TO authenticated, service_role
		WITH CHECK (TRUE);

CREATE POLICY "Enable read access for all users" ON "public"."general_overview" AS permissive
	FOR SELECT TO public
		USING (TRUE);

CREATE POLICY "Enable update for authenticated users only" ON "public"."general_overview" AS permissive
	FOR UPDATE TO authenticated, service_role
		USING ((auth.uid() = user_id))
		WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Allow individual delete access" ON "public"."user_profiles" AS permissive
	FOR DELETE TO public
		USING ((auth.uid() = id));

CREATE POLICY "Allow individual insert access" ON "public"."user_profiles" AS permissive
	FOR INSERT TO public
		WITH CHECK ((auth.uid() = id));

CREATE POLICY "Allow individual update access" ON "public"."user_profiles" AS permissive
	FOR UPDATE TO public
		USING ((auth.uid() = id));

CREATE POLICY "Allow read access for authenticated on public users table" ON "public"."user_profiles" AS permissive
	FOR SELECT TO public
		USING ((auth.role() = 'authenticated'::text));

CREATE POLICY "Allow read access on public users table" ON "public"."user_profiles" AS permissive
	FOR SELECT TO public
		USING ((auth.role() = 'anon'::text));

CREATE TRIGGER on_auth_user_created
	AFTER INSERT ON auth.users
	FOR EACH ROW
	EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER on_auth_user_deleted
	AFTER DELETE ON auth.users
	FOR EACH ROW
	EXECUTE FUNCTION handle_deleted_user();

