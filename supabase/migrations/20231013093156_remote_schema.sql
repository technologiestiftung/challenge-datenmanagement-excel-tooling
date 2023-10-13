drop policy "Enable read access for all users" on "public"."general_overview";

create policy "Enable read access for all users"
on "public"."general_overview"
as permissive
for select
to authenticated, service_role
using (true);



