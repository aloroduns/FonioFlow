import h6 from "@/data/generated/h6-demand.json";
import {filterEnvelope} from "@/lib/api/filter-envelope";
import {jsonResponse,optionalText} from "@/lib/api/query";
import {resolveDataset} from "@/lib/api/resolve-dataset";
import {z} from "zod";

const schema=z.array(z.object({Measure:z.string(),"Response option":z.string(),Count:z.number(),"% of respondents":z.number(),Hypothesis:z.string(),"Counting note":z.string()})).min(1);
export async function GET(request:Request){const measure=optionalText(request,"measure");const envelope=await resolveDataset({cacheKey:"survey",source:"Fonio Market Research Survey (150 unique respondents, confirmed by project owner)",staticData:h6.survey,staticTimestamp:"2026-09-11",schema});const filtered=filterEnvelope(envelope,row=>!measure||row.Measure.toLowerCase().includes(measure.toLowerCase()));const auditWarnings=h6.surveyAudit.warning?[h6.surveyAudit.warning]:[];return jsonResponse({...filtered,meta:{...filtered.meta,warnings:[...filtered.meta.warnings,...auditWarnings]}})}
