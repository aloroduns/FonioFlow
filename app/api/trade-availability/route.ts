import {jsonResponse,optionalText,optionalYear} from "@/lib/api/query";
import {getAvailability} from "@/lib/services/availability";

export async function GET(request:Request){return jsonResponse(await getAvailability(optionalText(request,"country"),optionalYear(request)))}
