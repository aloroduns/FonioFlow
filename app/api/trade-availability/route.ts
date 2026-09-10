import {jsonResponse,optionalText,optionalYear} from "@/lib/api/query";
import {getAvailability} from "@/lib/services/availability";

export async function GET(request:Request){const year=optionalYear(request);const rawYear=new URL(request.url).searchParams.get("year");if(rawYear&&year===undefined)return jsonResponse({error:"Invalid year. Use a whole year from 1961 to 2100."},400);return jsonResponse(await getAvailability(optionalText(request,"country"),year))}
