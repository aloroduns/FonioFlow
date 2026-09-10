import type { ReactNode } from "react";

export function EvidenceStatus({children="Evidence reviewed",tone="reviewed"}:{children?:ReactNode;tone?:"supported"|"partial"|"inconclusive"|"reviewed"}){return <span className={`status status-${tone}`}>{children}</span>}
export function Metric({label,value,note}:{label:string;value:string;note?:string}){return <div className="metric"><span>{label}</span><strong>{value}</strong>{note&&<small>{note}</small>}</div>}
export function ScreenTitle({code,title,text}:{code:string;title:string;text:string}){return <section className="page-title"><div><span>{code}</span><h1>{title}</h1></div><p>{text}</p><EvidenceStatus/></section>}
