import type {ZodType} from "zod";
import {readCache,writeCache} from "./cache";
import type {ApiEnvelope} from "./contracts";

type Options<T>={
  cacheKey:string;
  source:string;
  staticData:T;
  staticTimestamp:string;
  schema:ZodType<T>;
  live?:()=>Promise<{data:T;sourceTimestamp:string}>;
  ttlMs?:number;
};

function countMissing(value:unknown):number{
  if(!Array.isArray(value)) return 0;
  return value.filter(row=>{
    if(!row||typeof row!=="object") return false;
    const record=row as Record<string,unknown>;
    return Object.values(record).some(item=>item===null||item===undefined||item==="")||Object.entries(record).some(([key,item])=>key.toLowerCase().includes("missing")&&Boolean(item));
  }).length;
}

function envelope<T>(data:T,status:"live"|"cached"|"static",source:string,sourceTimestamp:string,warnings:string[]):ApiEnvelope<T>{
  return {data,meta:{status,source,sourceTimestamp,retrievedAt:new Date().toISOString(),recordCount:Array.isArray(data)?data.length:1,missingDataCount:countMissing(data),warnings}};
}

export async function resolveDataset<T>(options:Options<T>):Promise<ApiEnvelope<T>>{
  const staticData=options.schema.parse(options.staticData);
  const liveEnabled=process.env.DATA_PROVIDER==="live"&&options.live;

  if(liveEnabled){
    try{
      const liveResult=await options.live!();
      const validated=options.schema.parse(liveResult.data);
      writeCache(options.cacheKey,validated,liveResult.sourceTimestamp,options.ttlMs??15*60*1000);
      return envelope(validated,"live",options.source,liveResult.sourceTimestamp,[]);
    }catch(error){
      const cached=readCache<T>(options.cacheKey);
      const warning=error instanceof Error?error.message:"Live provider failed";
      if(cached) return envelope(cached.value,"cached",options.source,cached.sourceTimestamp,[warning]);
      return envelope(staticData,"static",options.source,options.staticTimestamp,[`${warning}; validated snapshot returned`]);
    }
  }

  return envelope(staticData,"static",options.source,options.staticTimestamp,[]);
}
