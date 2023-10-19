drop policy "Allow users with role admin insert, select, update and delete" on "public"."general_overview";

drop policy "Enable delete for users based on user_id" on "public"."general_overview";

drop policy "Enable insert for authenticated users only" on "public"."general_overview";

drop policy "Enable read access for all users" on "public"."general_overview";

drop policy "Enable update for authenticated users only" on "public"."general_overview";

alter table "public"."general_overview" drop constraint "general_overview_user_id_fkey";

alter table "public"."general_overview" drop column "user_id";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_deleted_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$ begin
delete from public.user_profiles
where id = old.id;
return old;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$ begin
insert into public.user_profiles (id)
values (new.id);
return new;
end;
$function$
;

create policy "Allow users  insert, select, update and delete"
on "public"."general_overview"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Enable delete for authenticated users only"
on "public"."general_overview"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."general_overview"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."general_overview"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."general_overview"
as permissive
for update
to authenticated
using (true)
with check (true);



