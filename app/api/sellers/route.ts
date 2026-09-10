import h5 from "@/data/generated/h5-sellers.json";
import {filterEnvelope} from "@/lib/api/filter-envelope";
import {jsonResponse,optionalText} from "@/lib/api/query";
import {resolveDataset} from "@/lib/api/resolve-dataset";
import {z} from "zod";

const schema=z.array(z.object({seller_id:z.string(),seller_name:z.string(),market:z.string(),channel:z.string(),product_form:z.string(),verification_status:z.string(),availability_status:z.string(),origin:z.string(),delivery_evidence:z.string(),source_url:z.string().url(),verified_date:z.string(),publication_rule:z.string()})).min(1);
export async function GET(request:Request){const query=optionalText(request,"q")?.toLowerCase();const market=optionalText(request,"market")?.toLowerCase();const envelope=await resolveDataset({cacheKey:"sellers",source:"Verified public seller and product pages",staticData:h5.sellers,staticTimestamp:"2026-09-07",schema});return jsonResponse(filterEnvelope(envelope,row=>(!market||row.market.toLowerCase().includes(market))&&(!query||`${row.seller_name} ${row.market} ${row.channel} ${row.product_form} ${row.origin}`.toLowerCase().includes(query))))}
