-- STEP 1: In Supabase > Authentication > Users > "Add user" create your login (email + password,
--         tick "Auto Confirm User").
-- STEP 2: Replace the email below with EXACTLY that email, then run this file.
insert into public.admin_users (email) values ('singhtaniya153@gmail.com'),('chiragtanwar0008@gmail.com')
on conflict (email) do nothing;
