create schema if not exists "drizzle";

create sequence "drizzle"."__drizzle_migrations_id_seq";

create table "drizzle"."__drizzle_migrations" (
    "id" integer not null default nextval('drizzle.__drizzle_migrations_id_seq'::regclass),
    "hash" text not null,
    "created_at" bigint
);


alter sequence "drizzle"."__drizzle_migrations_id_seq" owned by "drizzle"."__drizzle_migrations"."id";

CREATE UNIQUE INDEX __drizzle_migrations_pkey ON drizzle.__drizzle_migrations USING btree (id);

alter table "drizzle"."__drizzle_migrations" add constraint "__drizzle_migrations_pkey" PRIMARY KEY using index "__drizzle_migrations_pkey";


create table "public"."essays" (
    "id" uuid not null default gen_random_uuid(),
    "problem_id" uuid not null,
    "user_id" uuid not null,
    "content" text not null,
    "image_url" text,
    "status" text default 'pending'::text,
    "submitted_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now()
);


create table "public"."grading_results" (
    "id" uuid not null default gen_random_uuid(),
    "essay_id" uuid not null,
    "total_score" numeric(5,2) not null,
    "llm_feedback" jsonb,
    "graded_at" timestamp without time zone not null default now()
);


create table "public"."problems" (
    "id" uuid not null default gen_random_uuid(),
    "owner_id" uuid not null,
    "title" character varying(255) not null,
    "content" text,
    "image_url" text,
    "additional_instruction" text,
    "tags" text[] not null default ARRAY[]::text[],
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now()
);


create table "public"."profile" (
    "id" uuid not null,
    "email" text not null,
    "role" text default 'user'::text,
    "avatar_url" text,
    "created_at" timestamp without time zone not null default now(),
    "name" character varying(50) default 'Anonymous'::character varying
);


alter table "public"."profile" enable row level security;

create table "public"."usage_log" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "token_count" numeric default 0,
    "updated_at" timestamp without time zone not null default now()
);


create table "public"."user_quota" (
    "id" uuid not null,
    "num_usages" numeric default 0,
    "threshold" numeric default 10,
    "subscription_id" text,
    "tier" text default 'free'::text,
    "next_billed_at" timestamp without time zone,
    "customer_id" text
);


CREATE UNIQUE INDEX email_idx ON public.profile USING btree (email);

CREATE UNIQUE INDEX essays_pkey ON public.essays USING btree (id);

CREATE UNIQUE INDEX grading_results_pkey ON public.grading_results USING btree (id);

CREATE INDEX name_idx ON public.profile USING btree (name);

CREATE INDEX owner_idx ON public.problems USING btree (owner_id);

CREATE INDEX problem_idx ON public.essays USING btree (problem_id);

CREATE UNIQUE INDEX problems_pkey ON public.problems USING btree (id);

CREATE UNIQUE INDEX profile_email_unique ON public.profile USING btree (email);

CREATE UNIQUE INDEX profile_pkey ON public.profile USING btree (id);

CREATE UNIQUE INDEX uq_grading_results_essay_id ON public.grading_results USING btree (essay_id);

CREATE UNIQUE INDEX uq_quota_user_date ON public.usage_log USING btree (user_id, updated_at);

CREATE UNIQUE INDEX uq_user_quota_id ON public.user_quota USING btree (id);

CREATE INDEX user_idx ON public.essays USING btree (user_id);

CREATE UNIQUE INDEX user_quota_counters_pkey ON public.usage_log USING btree (id);

CREATE UNIQUE INDEX user_quota_customer_id_unique ON public.user_quota USING btree (customer_id);

CREATE UNIQUE INDEX user_quota_pkey ON public.user_quota USING btree (id);

CREATE UNIQUE INDEX user_quota_subscription_id_unique ON public.user_quota USING btree (subscription_id);

alter table "public"."essays" add constraint "essays_pkey" PRIMARY KEY using index "essays_pkey";

alter table "public"."grading_results" add constraint "grading_results_pkey" PRIMARY KEY using index "grading_results_pkey";

alter table "public"."problems" add constraint "problems_pkey" PRIMARY KEY using index "problems_pkey";

alter table "public"."profile" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."usage_log" add constraint "user_quota_counters_pkey" PRIMARY KEY using index "user_quota_counters_pkey";

alter table "public"."user_quota" add constraint "user_quota_pkey" PRIMARY KEY using index "user_quota_pkey";

alter table "public"."essays" add constraint "essays_problem_id_problems_id_fk" FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE not valid;

alter table "public"."essays" validate constraint "essays_problem_id_problems_id_fk";

alter table "public"."essays" add constraint "essays_user_id_profile_id_fk" FOREIGN KEY (user_id) REFERENCES profile(id) ON DELETE CASCADE not valid;

alter table "public"."essays" validate constraint "essays_user_id_profile_id_fk";

alter table "public"."grading_results" add constraint "grading_results_essay_id_essays_id_fk" FOREIGN KEY (essay_id) REFERENCES essays(id) ON DELETE CASCADE not valid;

alter table "public"."grading_results" validate constraint "grading_results_essay_id_essays_id_fk";

alter table "public"."problems" add constraint "problems_owner_id_profile_id_fk" FOREIGN KEY (owner_id) REFERENCES profile(id) ON DELETE CASCADE not valid;

alter table "public"."problems" validate constraint "problems_owner_id_profile_id_fk";

alter table "public"."profile" add constraint "profile_email_unique" UNIQUE using index "profile_email_unique";

alter table "public"."profile" add constraint "profile_id_users_id_fk" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profile" validate constraint "profile_id_users_id_fk";

alter table "public"."usage_log" add constraint "usage_log_user_id_profile_id_fk" FOREIGN KEY (user_id) REFERENCES profile(id) ON DELETE CASCADE not valid;

alter table "public"."usage_log" validate constraint "usage_log_user_id_profile_id_fk";

alter table "public"."user_quota" add constraint "user_quota_customer_id_unique" UNIQUE using index "user_quota_customer_id_unique";

alter table "public"."user_quota" add constraint "user_quota_id_profile_id_fk" FOREIGN KEY (id) REFERENCES profile(id) ON DELETE CASCADE not valid;

alter table "public"."user_quota" validate constraint "user_quota_id_profile_id_fk";

alter table "public"."user_quota" add constraint "user_quota_subscription_id_unique" UNIQUE using index "user_quota_subscription_id_unique";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_create_user_quota()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN

  INSERT INTO public.user_quota(id, num_usages, threshold)
    VALUES (NEW.id, 0, 10)
  ON CONFLICT (id) DO UPDATE
    SET num_usages = EXCLUDED.num_usages,
        threshold  = EXCLUDED.threshold;
        
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profile (id, email, name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_update_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  update public.profile
  set email = new.email
  where id = new.id;
  return new;
end;
$function$
;

grant delete on table "public"."essays" to "anon";

grant insert on table "public"."essays" to "anon";

grant references on table "public"."essays" to "anon";

grant select on table "public"."essays" to "anon";

grant trigger on table "public"."essays" to "anon";

grant truncate on table "public"."essays" to "anon";

grant update on table "public"."essays" to "anon";

grant delete on table "public"."essays" to "authenticated";

grant insert on table "public"."essays" to "authenticated";

grant references on table "public"."essays" to "authenticated";

grant select on table "public"."essays" to "authenticated";

grant trigger on table "public"."essays" to "authenticated";

grant truncate on table "public"."essays" to "authenticated";

grant update on table "public"."essays" to "authenticated";

grant delete on table "public"."essays" to "service_role";

grant insert on table "public"."essays" to "service_role";

grant references on table "public"."essays" to "service_role";

grant select on table "public"."essays" to "service_role";

grant trigger on table "public"."essays" to "service_role";

grant truncate on table "public"."essays" to "service_role";

grant update on table "public"."essays" to "service_role";

grant delete on table "public"."grading_results" to "anon";

grant insert on table "public"."grading_results" to "anon";

grant references on table "public"."grading_results" to "anon";

grant select on table "public"."grading_results" to "anon";

grant trigger on table "public"."grading_results" to "anon";

grant truncate on table "public"."grading_results" to "anon";

grant update on table "public"."grading_results" to "anon";

grant delete on table "public"."grading_results" to "authenticated";

grant insert on table "public"."grading_results" to "authenticated";

grant references on table "public"."grading_results" to "authenticated";

grant select on table "public"."grading_results" to "authenticated";

grant trigger on table "public"."grading_results" to "authenticated";

grant truncate on table "public"."grading_results" to "authenticated";

grant update on table "public"."grading_results" to "authenticated";

grant delete on table "public"."grading_results" to "service_role";

grant insert on table "public"."grading_results" to "service_role";

grant references on table "public"."grading_results" to "service_role";

grant select on table "public"."grading_results" to "service_role";

grant trigger on table "public"."grading_results" to "service_role";

grant truncate on table "public"."grading_results" to "service_role";

grant update on table "public"."grading_results" to "service_role";

grant delete on table "public"."problems" to "anon";

grant insert on table "public"."problems" to "anon";

grant references on table "public"."problems" to "anon";

grant select on table "public"."problems" to "anon";

grant trigger on table "public"."problems" to "anon";

grant truncate on table "public"."problems" to "anon";

grant update on table "public"."problems" to "anon";

grant delete on table "public"."problems" to "authenticated";

grant insert on table "public"."problems" to "authenticated";

grant references on table "public"."problems" to "authenticated";

grant select on table "public"."problems" to "authenticated";

grant trigger on table "public"."problems" to "authenticated";

grant truncate on table "public"."problems" to "authenticated";

grant update on table "public"."problems" to "authenticated";

grant delete on table "public"."problems" to "service_role";

grant insert on table "public"."problems" to "service_role";

grant references on table "public"."problems" to "service_role";

grant select on table "public"."problems" to "service_role";

grant trigger on table "public"."problems" to "service_role";

grant truncate on table "public"."problems" to "service_role";

grant update on table "public"."problems" to "service_role";

grant delete on table "public"."profile" to "anon";

grant insert on table "public"."profile" to "anon";

grant references on table "public"."profile" to "anon";

grant select on table "public"."profile" to "anon";

grant trigger on table "public"."profile" to "anon";

grant truncate on table "public"."profile" to "anon";

grant update on table "public"."profile" to "anon";

grant delete on table "public"."profile" to "authenticated";

grant insert on table "public"."profile" to "authenticated";

grant references on table "public"."profile" to "authenticated";

grant select on table "public"."profile" to "authenticated";

grant trigger on table "public"."profile" to "authenticated";

grant truncate on table "public"."profile" to "authenticated";

grant update on table "public"."profile" to "authenticated";

grant delete on table "public"."profile" to "service_role";

grant insert on table "public"."profile" to "service_role";

grant references on table "public"."profile" to "service_role";

grant select on table "public"."profile" to "service_role";

grant trigger on table "public"."profile" to "service_role";

grant truncate on table "public"."profile" to "service_role";

grant update on table "public"."profile" to "service_role";

grant delete on table "public"."usage_log" to "anon";

grant insert on table "public"."usage_log" to "anon";

grant references on table "public"."usage_log" to "anon";

grant select on table "public"."usage_log" to "anon";

grant trigger on table "public"."usage_log" to "anon";

grant truncate on table "public"."usage_log" to "anon";

grant update on table "public"."usage_log" to "anon";

grant delete on table "public"."usage_log" to "authenticated";

grant insert on table "public"."usage_log" to "authenticated";

grant references on table "public"."usage_log" to "authenticated";

grant select on table "public"."usage_log" to "authenticated";

grant trigger on table "public"."usage_log" to "authenticated";

grant truncate on table "public"."usage_log" to "authenticated";

grant update on table "public"."usage_log" to "authenticated";

grant delete on table "public"."usage_log" to "service_role";

grant insert on table "public"."usage_log" to "service_role";

grant references on table "public"."usage_log" to "service_role";

grant select on table "public"."usage_log" to "service_role";

grant trigger on table "public"."usage_log" to "service_role";

grant truncate on table "public"."usage_log" to "service_role";

grant update on table "public"."usage_log" to "service_role";

grant delete on table "public"."user_quota" to "anon";

grant insert on table "public"."user_quota" to "anon";

grant references on table "public"."user_quota" to "anon";

grant select on table "public"."user_quota" to "anon";

grant trigger on table "public"."user_quota" to "anon";

grant truncate on table "public"."user_quota" to "anon";

grant update on table "public"."user_quota" to "anon";

grant delete on table "public"."user_quota" to "authenticated";

grant insert on table "public"."user_quota" to "authenticated";

grant references on table "public"."user_quota" to "authenticated";

grant select on table "public"."user_quota" to "authenticated";

grant trigger on table "public"."user_quota" to "authenticated";

grant truncate on table "public"."user_quota" to "authenticated";

grant update on table "public"."user_quota" to "authenticated";

grant delete on table "public"."user_quota" to "service_role";

grant insert on table "public"."user_quota" to "service_role";

grant references on table "public"."user_quota" to "service_role";

grant select on table "public"."user_quota" to "service_role";

grant trigger on table "public"."user_quota" to "service_role";

grant truncate on table "public"."user_quota" to "service_role";

grant update on table "public"."user_quota" to "service_role";

create policy "Enable read access for all users"
on "public"."profile"
as permissive
for select
to public
using (true);


create policy "Enable users to update their own data only"
on "public"."profile"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));


CREATE TRIGGER create_customer_on_profile_insert AFTER INSERT ON public.profile FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://5059-2401-e180-8842-db8c-9c24-dfe3-431a-2b0d.ngrok-free.app/api/webhook/create-customer', 'POST', '{"Content-type":"application/json"}', '{"API_ROUTE_SECRET":"1234567890"}', '5000');

CREATE TRIGGER create_user_quota_after_create_profile AFTER INSERT OR UPDATE ON public.profile FOR EACH ROW EXECUTE FUNCTION handle_create_user_quota();


