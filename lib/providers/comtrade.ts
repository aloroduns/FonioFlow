import {fetchJson,numeric,textValue} from "@/lib/api/http";

export type TradeTotals={import_tonnes:number|null;export_tonnes:number|null;import_value_usd:number|null;missing_data_flag:string|null};

export async function fetchFonioTrade(reporterCode:string,year:number):Promise<{data:TradeTotals;sourceTimestamp:string}>{
  const base=process.env.COMTRADE_API_BASE_URL||"https://comtradeapi.un.org/public/v1/preview/C/A/HS";
  const url=new URL(base);
  url.searchParams.set("period",String(year));
  url.searchParams.set("reporterCode",reporterCode);
  url.searchParams.set("cmdCode","100840");
  url.searchParams.set("flowCode","M,X");
  url.searchParams.set("partnerCode","0");
  url.searchParams.set("partner2Code","0");
  url.searchParams.set("customsCode","C00");
  url.searchParams.set("motCode","0");
  url.searchParams.set("maxRecords","500");
  const headers:HeadersInit={Accept:"application/json"};
  if(process.env.COMTRADE_API_KEY) headers["Ocp-Apim-Subscription-Key"]=process.env.COMTRADE_API_KEY;
  const payload=await fetchJson(url,{headers});
  const rows=extractRows(payload);
  let importKg=0,exportKg=0,importValue=0,importFound=false,exportFound=false;
  for(const row of rows){
    const flow=(textValue(row,["flowDesc","FlowDesc","TradeFlow"])??"").toLowerCase();
    const flowCode=String(row.flowCode??row.FlowCode??"").toUpperCase();
    const weight=numeric(row.netWgt??row.NetWeight??row.netWeight);
    const value=numeric(row.primaryValue??row.TradeValue??row.tradeValue);
    if(flow.includes("import")||flowCode==="M"){
      importFound=true; importKg+=weight??0; importValue+=value??0;
    }else if(flow.includes("export")||flowCode==="X"){
      exportFound=true; exportKg+=weight??0;
    }
  }
  if(!rows.length) throw new Error(`UN Comtrade returned no HS 100840 records for reporter ${reporterCode} in ${year}`);
  return {data:{import_tonnes:importFound?importKg/1000:null,export_tonnes:exportFound?exportKg/1000:null,import_value_usd:importFound?importValue:null,missing_data_flag:!importFound||!exportFound?"Import or export flow absent from live response":null},sourceTimestamp:new Date().toISOString()};
}

function extractRows(payload:unknown):Record<string,unknown>[] {
  if(!payload||typeof payload!=="object") return [];
  const record=payload as Record<string,unknown>;
  const candidate=record.data??record.dataset??record.results;
  return Array.isArray(candidate)?candidate.filter((row):row is Record<string,unknown>=>Boolean(row)&&typeof row==="object"&&!Array.isArray(row)):[];
}
