import h1 from "@/data/generated/h1-production.json";
import {productionRecordsSchema,type ProductionRecord} from "@/lib/api/contracts";
import {filterEnvelope} from "@/lib/api/filter-envelope";
import {jsonResponse,optionalText,optionalYear} from "@/lib/api/query";
import {resolveDataset} from "@/lib/api/resolve-dataset";
import {fetchFaostatProduction} from "@/lib/providers/faostat";

export async function GET(request:Request){
  const country=optionalText(request,"country"); const year=optionalYear(request);
  const rawYear=new URL(request.url).searchParams.get("year");
  if(rawYear&&year===undefined) return jsonResponse({error:"Invalid year. Use a whole year from 1961 to 2100."},400);
  const envelope=await resolveDataset({cacheKey:`production:${country??"all"}:${year??"all"}`,source:"FAOSTAT Crops and livestock products (QCL)",staticData:h1.production as ProductionRecord[],staticTimestamp:"2024",schema:productionRecordsSchema,live:country||year?()=>fetchFaostatProduction(country,year):undefined});
  return jsonResponse(filterEnvelope(envelope,row=>(!country||row.country.toLowerCase()===country.toLowerCase())&&(!year||row.year===year)));
}
