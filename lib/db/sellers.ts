import h5 from "@/data/generated/h5-sellers.json";
import type {ApiEnvelope} from "@/lib/api/contracts";
import {db} from "./client";

export type PublishedSeller=(typeof h5.sellers)[number];

export async function approvedSellers():Promise<ApiEnvelope<PublishedSeller[]>>{
  try{
    const rows=await db().query(`
      select s.id as seller_id,s.seller_name,s.market,coalesce(s.channel,'') as channel,
        coalesce(s.product_form,'') as product_form,
        'Verified' as verification_status,
        coalesce(v.availability_status,'Not recently checked') as availability_status,
        coalesce(s.origin,'Not reported') as origin,
        coalesce(v.delivery_coverage,'Not verified') as delivery_evidence,
        s.source_url,coalesce(to_char(v.verified_at,'YYYY-MM-DD'),to_char(s.updated_at,'YYYY-MM-DD')) as verified_date,
        'publish_with_caveat' as publication_rule
      from sellers s
      left join lateral (
        select * from seller_verifications sv where sv.seller_id=s.id order by sv.verified_at desc limit 1
      ) v on true
      where s.publication_status='approved'
      order by s.seller_name
    `) as PublishedSeller[];
    return {data:rows,meta:{status:"live",source:"FonioFlow PostgreSQL seller registry",sourceTimestamp:new Date().toISOString(),retrievedAt:new Date().toISOString(),recordCount:rows.length,missingDataCount:rows.filter(row=>!row.origin||!row.delivery_evidence).length,warnings:[]}};
  }catch{
    const data=h5.sellers.filter(row=>row.publication_rule==="publish_with_caveat");
    return {data,meta:{status:"static",source:"Validated H5 seller snapshot",sourceTimestamp:"2026-09-07",retrievedAt:new Date().toISOString(),recordCount:data.length,missingDataCount:data.filter(row=>row.delivery_evidence.toLowerCase().includes("not")).length,warnings:["Database unavailable; validated seller snapshot returned"]}};
  }
}
