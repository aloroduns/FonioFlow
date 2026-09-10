import {neon} from "@neondatabase/serverless";
import fs from "node:fs";

const connectionString=process.env.DATABASE_URL;
if(!connectionString) throw new Error("DATABASE_URL is required. Pull Vercel variables into .env.local first.");
const sql=neon(connectionString);
const payload=JSON.parse(fs.readFileSync(new URL("../data/generated/h5-sellers.json",import.meta.url),"utf8"));

for(const seller of payload.sellers){
  const approved=seller.publication_rule==="publish_with_caveat"&&seller.verification_status==="Verified";
  await sql.query(`insert into sellers (id,seller_name,market,channel,product_form,origin,source_url,publication_status)
    values ($1,$2,$3,$4,$5,$6,$7,$8)
    on conflict (id) do update set seller_name=excluded.seller_name,market=excluded.market,channel=excluded.channel,
      product_form=excluded.product_form,origin=excluded.origin,source_url=excluded.source_url,
      publication_status=excluded.publication_status,updated_at=now()`,[
    seller.seller_id,seller.seller_name,seller.market,seller.channel,seller.product_form,seller.origin,seller.source_url,approved?"approved":"research_only",
  ]);
  await sql.query(`insert into seller_verifications (seller_id,verified_at,verified_by,availability_status,delivery_coverage,evidence_url,notes)
    select $1,$2::timestamptz,'H5 research import',$3,$4,$5,$6
    where not exists (select 1 from seller_verifications where seller_id=$1 and verified_at=$2::timestamptz and evidence_url=$5)`,[
    seller.seller_id,`${seller.verified_date}T00:00:00Z`,seller.availability_status,seller.delivery_evidence,seller.source_url,seller.verification_status,
  ]);
  await sql.query(`insert into source_reviews (entity_type,entity_id,source_url,reviewed_at,reviewed_by,review_status,notes)
    select 'seller',$1,$2,$3::timestamptz,'H5 research import',$4,$5
    where not exists (select 1 from source_reviews where entity_type='seller' and entity_id=$1 and reviewed_at=$3::timestamptz)`,[
    seller.seller_id,seller.source_url,`${seller.verified_date}T00:00:00Z`,approved?"approved":"research_only",seller.publication_rule,
  ]);
}
console.log(`Imported ${payload.sellers.length} H5 sellers; ${payload.sellers.filter(s=>s.publication_rule==="publish_with_caveat"&&s.verification_status==="Verified").length} approved for publication.`);
