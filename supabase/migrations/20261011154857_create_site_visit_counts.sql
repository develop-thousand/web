create schema if not exists private;
revoke all on schema private from public;

create table private.site_visit_counts (
  visit_date date primary key,
  visits bigint not null default 0 check (visits >= 0)
);

alter table private.site_visit_counts enable row level security;
revoke all on private.site_visit_counts from public, anon, authenticated;
