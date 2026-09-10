import h3 from "@/data/generated/h3-routes.json";
import {filterEnvelope} from "@/lib/api/filter-envelope";
import {jsonResponse,optionalText} from "@/lib/api/query";
import {resolveDataset} from "@/lib/api/resolve-dataset";
import {z} from "zod";

const schema=z.array(z.object({route_id:z.string(),origin_country:z.string(),origin_location:z.string(),destination_country:z.string(),destination_port:z.string(),mode:z.string(),estimated_cost_usd:z.number().nullable(),estimated_days:z.number().nullable(),route_status:z.string(),missing_data_flag:z.string().nullable()})).min(1);
export async function GET(request:Request){const origin=optionalText(request,"origin");const destination=optionalText(request,"destination");const envelope=await resolveDataset({cacheKey:"routes",source:"UN Comtrade route observations and verified road-route evidence",staticData:h3.routes,staticTimestamp:"2026-09-08",schema});return jsonResponse(filterEnvelope(envelope,row=>(!origin||`${row.origin_country} ${row.origin_location}`.toLowerCase().includes(origin.toLowerCase()))&&(!destination||`${row.destination_country} ${row.destination_port}`.toLowerCase().includes(destination.toLowerCase()))))}
