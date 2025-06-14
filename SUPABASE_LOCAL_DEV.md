### Seed the local supabase

prerequisite: download supabase cli

supabase start
supabase link

### sync with remote project

supabase db diff -f initial_structure --linked
supabase db dump --data-only --linked -f supabase/seed.sql
supabase db reset
