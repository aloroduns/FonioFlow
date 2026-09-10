import {filterEnvelope} from "@/lib/api/filter-envelope";
import {optionalText} from "@/lib/api/query";
import {approvedSellers} from "@/lib/db/sellers";
export async function GET(request:Request){const query=optionalText(request,"q")?.toLowerCase();const market=optionalText(request,"market")?.toLowerCase();const envelope=await approvedSellers();return Response.json(filterEnvelope(envelope,row=>(!market||row.market.toLowerCase().includes(market))&&(!query||`${row.seller_name} ${row.market} ${row.channel} ${row.product_form} ${row.origin}`.toLowerCase().includes(query))),{headers:{"Cache-Control":"no-store"}})}
