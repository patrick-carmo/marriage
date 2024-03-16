create table users (
  id serial primary key,
  google_id text not null unique,
  email text not null unique,
  name text not null,
  picture text,
  last_login text not null default now(),
  created_at timestamp not null default now()
);