export function optionalYear(request:Request):number|undefined{
  const value=new URL(request.url).searchParams.get("year");
  if(!value) return undefined;
  const year=Number(value);
  return Number.isInteger(year)&&year>=1961&&year<=2100?year:undefined;
}

export function optionalText(request:Request,key:string):string|undefined{
  const value=new URL(request.url).searchParams.get(key)?.trim();
  return value||undefined;
}

export function jsonResponse(data:unknown,status=200){
  return Response.json(data,{status,headers:{"Cache-Control":"public, s-maxage=300, stale-while-revalidate=86400"}});
}
