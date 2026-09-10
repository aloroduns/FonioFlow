import {fetchJson,numeric} from "@/lib/api/http";

export async function fetchPopulation(iso3:string,year:number):Promise<{population:number;sourceTimestamp:string}>{
  const base=process.env.WORLD_BANK_API_BASE_URL||"https://api.worldbank.org/v2";
  const url=new URL(`${base.replace(/\/$/,"")}/country/${encodeURIComponent(iso3)}/indicator/SP.POP.TOTL`);
  url.searchParams.set("date",String(year));
  url.searchParams.set("format","json");
  url.searchParams.set("per_page","1");
  const payload=await fetchJson(url);
  const row=Array.isArray(payload)&&Array.isArray(payload[1])?payload[1][0]:null;
  const population=row&&typeof row==="object"?numeric((row as Record<string,unknown>).value):null;
  if(population===null||population<=0) throw new Error(`World Bank returned no population for ${iso3} in ${year}`);
  const updated=Array.isArray(payload)&&payload[0]&&typeof payload[0]==="object"?String((payload[0] as Record<string,unknown>).lastupdated??new Date().toISOString()):new Date().toISOString();
  return {population:Math.round(population),sourceTimestamp:updated};
}
