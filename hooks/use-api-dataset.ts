"use client";

import {useEffect,useState} from "react";
import type {ApiEnvelope,ApiMetadata} from "@/lib/api/contracts";

const fallbackMetadata=(source:string):ApiMetadata=>({
  status:"static",
  source,
  sourceTimestamp:"Bundled demonstration dataset",
  retrievedAt:new Date(0).toISOString(),
  recordCount:0,
  missingDataCount:0,
  warnings:["API unavailable; bundled demonstration data is displayed."],
});

export function useApiDataset<T>(endpoint:string,initialData:T[],source:string){
  const [envelope,setEnvelope]=useState<ApiEnvelope<T[]>>({data:initialData,meta:{...fallbackMetadata(source),recordCount:initialData.length,warnings:[]}});
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const controller=new AbortController();
    fetch(endpoint,{signal:controller.signal})
      .then(async response=>{
        if(!response.ok) throw new Error(`FonioFlow API returned HTTP ${response.status}`);
        return response.json() as Promise<ApiEnvelope<T[]>>;
      })
      .then(result=>setEnvelope(result))
      .catch(error=>{
        if(error instanceof Error&&error.name==="AbortError") return;
        setEnvelope({data:initialData,meta:{...fallbackMetadata(source),recordCount:initialData.length}});
      })
      .finally(()=>setLoading(false));
    return ()=>controller.abort();
  },[endpoint,initialData,source]);

  return {...envelope,loading};
}
