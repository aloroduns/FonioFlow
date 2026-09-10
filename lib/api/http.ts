const DEFAULT_TIMEOUT_MS=Number(process.env.DATA_REQUEST_TIMEOUT_MS??"8000");

export async function fetchJson(url:URL,init:RequestInit={},timeoutMs=DEFAULT_TIMEOUT_MS):Promise<unknown>{
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),timeoutMs);
  try{
    const response=await fetch(url,{...init,signal:controller.signal,cache:"no-store"});
    if(!response.ok) throw new Error(`Provider request failed with HTTP ${response.status}`);
    return await response.json();
  }finally{
    clearTimeout(timeout);
  }
}

export function numeric(value:unknown):number|null{
  if(value===null||value===undefined||value==="") return null;
  const parsed=typeof value==="number"?value:Number(String(value).replaceAll(",",""));
  return Number.isFinite(parsed)?parsed:null;
}

export function textValue(row:Record<string,unknown>,keys:string[]):string|null{
  for(const key of keys){
    const value=row[key];
    if(value!==null&&value!==undefined&&String(value).trim()) return String(value).trim();
  }
  return null;
}
