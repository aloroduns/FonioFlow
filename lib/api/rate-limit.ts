type Entry={count:number;resetAt:number};
const attempts=new Map<string,Entry>();

export function rateLimit(request:Request,scope:string,limit=10,windowMs=60_000):Response|null{
  const forwarded=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key=`${scope}:${forwarded||"unknown"}`;const now=Date.now();
  const current=attempts.get(key);
  if(!current||current.resetAt<=now){attempts.set(key,{count:1,resetAt:now+windowMs});return null}
  if(current.count>=limit)return Response.json({error:"Too many requests. Please try again later."},{status:429,headers:{"Retry-After":String(Math.ceil((current.resetAt-now)/1000))}});
  current.count+=1;return null;
}
