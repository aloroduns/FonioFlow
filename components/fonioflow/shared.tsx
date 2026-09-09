import type { ReactNode } from "react";

export function EvidenceStatus({children="Evidence under review"}:{children?:ReactNode}){return <span className="status">{children}</span>}
export function Metric({label,value,note}:{label:string;value:string;note?:string}){return <div className="metric"><span>{label}</span><strong>{value}</strong>{note&&<small>{note}</small>}</div>}
export function ScreenTitle({code,title,text}:{code:string;title:string;text:string}){return <section className="page-title"><div><span>{code}</span><h1>{title}</h1></div><p>{text}</p><EvidenceStatus/></section>}
