import type {ApiEnvelope} from "./contracts";

export function filterEnvelope<T>(envelope:ApiEnvelope<T[]>,predicate:(row:T)=>boolean):ApiEnvelope<T[]>{
  const data=envelope.data.filter(predicate);
  return {...envelope,data,meta:{...envelope.meta,recordCount:data.length,missingDataCount:data.filter(hasMissingData).length}};
}

function hasMissingData(row:unknown){
  if(!row||typeof row!=="object") return false;
  const record=row as Record<string,unknown>;
  return Object.entries(record).some(([key,value])=>key.toLowerCase().includes("missing")&&Boolean(value))||Object.values(record).some(value=>value===null||value===undefined||value==="");
}
