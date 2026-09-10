import {fetchJson,numeric,textValue} from "@/lib/api/http";
import type {ProductionRecord} from "@/lib/api/contracts";

const DEFAULT_BASE_URL="https://fenixservices.fao.org/faostat/api/v1/en/data/QCL";

type PartialRecord={country:string;m49?:string;year:number;production_tonnes?:number;area_harvested_ha?:number;yield_kg_ha?:number;source_url:string};

export async function fetchFaostatProduction(country?:string,year?:number):Promise<{data:ProductionRecord[];sourceTimestamp:string}>{
  const url=new URL(process.env.FAOSTAT_API_BASE_URL||DEFAULT_BASE_URL);
  url.searchParams.set("item_code","94");
  url.searchParams.set("page_size","1000");
  if(country) url.searchParams.set("area",country);
  if(year) url.searchParams.set("year",String(year));

  const headers:HeadersInit={Accept:"application/json"};
  if(process.env.FAOSTAT_API_KEY) headers["X-Subscription-Key"]=process.env.FAOSTAT_API_KEY;
  const payload=await fetchJson(url,{headers});
  const rows=extractRows(payload);
  const grouped=new Map<string,PartialRecord>();

  for(const row of rows){
    const area=textValue(row,["area","Area","area_name","Area Name"]);
    const recordYear=numeric(row.year??row.Year??row.year_code);
    const value=numeric(row.value??row.Value);
    const element=(textValue(row,["element","Element","element_name"])??"").toLowerCase();
    const elementCode=String(row.element_code??row["Element Code"]??"");
    if(!area||recordYear===null||value===null) continue;
    const key=`${area}:${recordYear}`;
    const current=grouped.get(key)??{country:area,m49:textValue(row,["area_code_m49","M49 Code"])??undefined,year:recordYear,source_url:url.origin+url.pathname};
    if(element.includes("production")||elementCode==="5510") current.production_tonnes=value;
    else if(element.includes("area harvested")||elementCode==="5312") current.area_harvested_ha=value;
    else if(element.includes("yield")||elementCode==="5419") current.yield_kg_ha=value;
    grouped.set(key,current);
  }

  const data=[...grouped.values()].filter((row):row is PartialRecord&{production_tonnes:number}=>row.production_tonnes!==undefined).map(row=>({...row,area_harvested_ha:row.area_harvested_ha??null,yield_kg_ha:row.yield_kg_ha??null,missing_data_flag:row.area_harvested_ha===undefined||row.yield_kg_ha===undefined?"Area or yield missing from live response":null}));
  if(!data.length) throw new Error("FAOSTAT returned no usable fonio production records");
  return {data,sourceTimestamp:new Date().toISOString()};
}

function extractRows(payload:unknown):Record<string,unknown>[] {
  if(Array.isArray(payload)) return payload.filter(isRecord);
  if(isRecord(payload)){
    for(const key of ["data","Data","results","value"]){
      const candidate=payload[key];
      if(Array.isArray(candidate)) return candidate.filter(isRecord);
    }
  }
  return [];
}

function isRecord(value:unknown):value is Record<string,unknown>{return Boolean(value)&&typeof value==="object"&&!Array.isArray(value)}
