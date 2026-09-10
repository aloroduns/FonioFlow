import {timingSafeEqual} from "node:crypto";

function sameSecret(received:string,expected:string){
  const left=Buffer.from(received);const right=Buffer.from(expected);
  return left.length===right.length&&timingSafeEqual(left,right);
}

export function requireAdmin(request:Request):Response|null{
  const configured=process.env.ADMIN_API_TOKEN;
  if(!configured) return Response.json({error:"Administrative API is not configured."},{status:503});
  const header=request.headers.get("authorization")??"";
  const received=header.startsWith("Bearer ")?header.slice(7):"";
  if(!received||!sameSecret(received,configured)) return Response.json({error:"Unauthorized."},{status:401,headers:{"WWW-Authenticate":"Bearer"}});
  return null;
}
