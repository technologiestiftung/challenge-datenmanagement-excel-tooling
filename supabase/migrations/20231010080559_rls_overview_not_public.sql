DROP POLICY "Enable read access for all users" ON "public"."general_overview";

CREATE POLICY "Enable read access for all users" ON "public"."general_overview" AS permissive
	FOR SELECT TO authenticated
		USING (TRUE);

