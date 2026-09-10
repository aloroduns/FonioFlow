-- FonioFlow maintainable-record schema. Compatible with PostgreSQL providers
-- such as Vercel Postgres/Neon and Supabase.
create table if not exists organizations (
  id text primary key,
  name text not null,
  organization_type text not null,
  country text,
  city text,
  website_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sellers (
  id text primary key,
  organization_id text references organizations(id),
  seller_name text not null,
  market text not null,
  channel text,
  product_form text,
  origin text,
  source_url text not null,
  publication_status text not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists seller_verifications (
  id bigint generated always as identity primary key,
  seller_id text not null references sellers(id),
  verified_at timestamptz not null,
  verified_by text,
  availability_status text,
  delivery_coverage text,
  price_observed numeric,
  currency text,
  evidence_url text,
  notes text
);

create table if not exists wholesale_inquiries (
  id bigint generated always as identity primary key,
  seller_id text references sellers(id),
  sent_at timestamptz not null,
  response_at timestamptz,
  destination_market text,
  requested_quantity_kg numeric,
  quoted_price numeric,
  quoted_currency text,
  minimum_order_kg numeric,
  delivery_terms text,
  information_completeness text,
  notes text
);

create table if not exists demand_submissions (
  id bigint generated always as identity primary key,
  submitted_at timestamptz not null default now(),
  country text not null,
  city text,
  product_form text,
  desired_quantity_kg numeric,
  purchase_frequency text,
  willingness_to_pay numeric,
  currency text,
  consent_to_research boolean not null default false
);

create table if not exists source_reviews (
  id bigint generated always as identity primary key,
  entity_type text not null,
  entity_id text not null,
  source_url text not null,
  reviewed_at timestamptz not null,
  reviewed_by text,
  review_status text not null,
  source_published_at date,
  notes text
);

create index if not exists seller_verifications_seller_date on seller_verifications(seller_id, verified_at desc);
create index if not exists demand_submissions_market on demand_submissions(country, city, submitted_at desc);
create index if not exists source_reviews_entity on source_reviews(entity_type, entity_id, reviewed_at desc);
