import h4 from "@/data/generated/h4-prices.json";
import {filterEnvelope} from "@/lib/api/filter-envelope";
import {jsonResponse,optionalText} from "@/lib/api/query";
import {resolveDataset} from "@/lib/api/resolve-dataset";
import {z} from "zod";

const schema=z.array(z.object({Grain:z.string(),"Comparable products":z.number(),"Average USD/kg":z.number(),"Fonio premium vs grain":z.number(),"Evidence status":z.string(),Interpretation:z.string()})).min(1);
export async function GET(request:Request){const grain=optionalText(request,"grain");const envelope=await resolveDataset({cacheKey:"prices",source:"Validated retail price observations",staticData:h4.prices,staticTimestamp:"2026-09-08",schema});return jsonResponse(filterEnvelope(envelope,row=>!grain||row.Grain.toLowerCase()===grain.toLowerCase()))}
