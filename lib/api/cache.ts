type CacheEntry<T>={value:T;sourceTimestamp:string;expiresAt:number};

const globalCache=globalThis as typeof globalThis&{
  fonioflowCache?:Map<string,CacheEntry<unknown>>;
};

const cache=globalCache.fonioflowCache??new Map<string,CacheEntry<unknown>>();
globalCache.fonioflowCache=cache;

export function readCache<T>(key:string):CacheEntry<T>|null{
  const entry=cache.get(key) as CacheEntry<T>|undefined;
  if(!entry||entry.expiresAt<=Date.now()){
    if(entry) cache.delete(key);
    return null;
  }
  return entry;
}

export function writeCache<T>(key:string,value:T,sourceTimestamp:string,ttlMs:number){
  cache.set(key,{value,sourceTimestamp,expiresAt:Date.now()+ttlMs});
}
