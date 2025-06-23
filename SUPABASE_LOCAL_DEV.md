### Seed the local supabase

prerequisite: download supabase cli
https://supabase.com/docs/guides/local-development

supabase start
supabase link

### sync with remote project

supabase db diff -f initial_structure --linked
supabase db pull --schema auth
supabase db reset
