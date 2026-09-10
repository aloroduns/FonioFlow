import h2 from "@/data/generated/h2-processing.json";
import {filterEnvelope} from "@/lib/api/filter-envelope";
import {jsonResponse,optionalText} from "@/lib/api/query";
import {resolveDataset} from "@/lib/api/resolve-dataset";
import {z} from "zod";

const schema=z.array(z.object({record_id:z.string(),name:z.string(),country_coverage:z.string(),location:z.string(),initiative_type:z.string(),status:z.string(),processing_stages:z.string(),product_forms:z.string(),capacity_evidence:z.string(),evidence_strength:z.string(),source_url:z.string().url(),missing_indicators:z.string()})).min(1);
export async function GET(request:Request){const country=optionalText(request,"country");const envelope=await resolveDataset({cacheKey:"processing",source:"Validated public facility and initiative sources",staticData:h2.processors,staticTimestamp:"2026-09-08",schema});return jsonResponse(filterEnvelope(envelope,row=>!country||row.country_coverage.toLowerCase().includes(country.toLowerCase())))}
