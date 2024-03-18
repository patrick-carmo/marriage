create table users (
  id serial primary key,
  google_id text not null unique,
  email text not null unique,
  name text not null,
  picture text,
  last_login text not null default now(),
  created_at timestamp not null default now()
);

create table image_folder (
	id text primary key,
  user_id integer not null references users(id),
  created_at timestamp not null default now()
);

create table images (
	id text primary key,
  url text not null,
  user_id integer not null references users(id),
  folder_id text not null references image_folder(id),
  created_at timestamp not null default now()
);