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
	id serial primary key,
  folder_id text not null unique,
  user_id integer not null references users(id),
  created_at timestamp not null default now()
);

create table images (
	id serial primary key,
  image_id text not null unique,
  url text not null,
  user_id integer not null references users(id),
  image_folder integer not null references image_folder(id),
  created_at timestamp not null default now()
);