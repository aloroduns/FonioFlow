import type { ReactNode } from "react";
import {AlertTriangle,CheckCircle2,Cloud,Database} from "lucide-react";
import type {ApiMetadata} from "@/lib/api/contracts";

export function EvidenceStatus({children="Evidence reviewed",tone="reviewed"}:{children?:ReactNode;tone?:"supported"|"partial"|"inconclusive"|"reviewed"}){return <span className={`status status-${tone}`}>{children}</span>}
export function Metric({label,value,note}:{label:string;value:string;note?:string}){return <div className="metric"><span>{label}</span><strong>{value}</strong>{note&&<small>{note}</small>}</div>}
export function ScreenTitle({code,title,text}:{code:string;title:string;text:string}){return <section className="page-title"><div><span>{code}</span><h1>{title}</h1></div><p>{text}</p><EvidenceStatus/></section>}

export function DataStatus({meta,loading=false}:{meta:ApiMetadata;loading?:boolean}){
  const fallback=meta.status==="cached"||meta.warnings.some(warning=>/fallback|unavailable|aborted|failed|timeout/i.test(warning));
  const label=loading?"Checking data source":fallback?"Fallback active":meta.status==="live"?"Live data":"Validated snapshot";
  const Icon=loading?Cloud:fallback?AlertTriangle:meta.status==="live"?Cloud:CheckCircle2;
  const updated=meta.sourceTimestamp||meta.retrievedAt;
  return <aside className={`data-status data-status-${fallback?"fallback":meta.status}`} aria-live="polite">
    <div className="data-status-heading"><Icon/><strong>{label}</strong></div>
    <dl>
      <div><dt>Last updated</dt><dd>{updated}</dd></div>
      <div><dt>Source organization</dt><dd>{meta.source}</dd></div>
      <div><dt>Records</dt><dd>{meta.recordCount}</dd></div>
      <div><dt>Missing-data records</dt><dd>{meta.missingDataCount}</dd></div>
    </dl>
    {meta.warnings.length>0&&<div className="data-warnings"><Database/><span>{meta.warnings.join(" ")}</span></div>}
  </aside>;
}
