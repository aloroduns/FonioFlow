import {Factory,PackageSearch,Route,Scale,Sprout,Users} from "lucide-react";
import {fonioData} from "@/lib/data";
import {numberFormat} from "@/lib/format";
import {EvidenceStatus} from "./shared";

const cards=[
  {id:"H1",name:"Production",question:"Is supply sufficient and stable?",Icon:Sprout,color:"#D6A443",outcome:"Inconclusive",tone:"inconclusive",rationale:"Regional output increased, but there is no demand benchmark for judging whether supply is sufficient."},
  {id:"H2",name:"Processing",question:"Can processors meet buyer requirements?",Icon:Factory,color:"#C86D3C",outcome:"Inconclusive",tone:"inconclusive",rationale:"Facilities and capacity claims were found, but verified output, utilization and certification data remain limited."},
  {id:"H3",name:"Distribution",question:"Can fonio reach markets reliably?",Icon:Route,color:"#417C74",outcome:"Inconclusive",tone:"inconclusive",rationale:"Long inland routes are documented, but freight quotations and shipment-performance records are still missing."},
  {id:"H4",name:"Price",question:"Is fonio commercially competitive?",Icon:Scale,color:"#7C5D8E",outcome:"Preliminary support",tone:"partial",rationale:"Observed fonio retail prices exceed millet, rice and quinoa averages, although the sample is not fully verified."},
  {id:"H5",name:"Sourcing",question:"Can buyers find reliable sellers?",Icon:PackageSearch,color:"#2D6E8D",outcome:"Supported",tone:"supported",rationale:"Seller records exist, but recurring stock, delivery, origin, price and minimum-order gaps hinder reliable sourcing."},
  {id:"H6",name:"Demand",question:"Is consumer demand understood?",Icon:Users,color:"#A45147",outcome:"Partially supported",tone:"partial",rationale:"Responses from 150 unique individuals show low awareness and conditional purchase interest, while the survey sample still limits wider generalization."},
] as const;

export function OverviewScreen(){
  const total=fonioData.production.filter(d=>d.year===2024).reduce((sum,d)=>sum+d.production_tonnes,0);
  return <div className="page"><section className="intro"><div><p className="eyebrow">THE BOTTLENECK EXPLORER</p><h1>Where does fonio’s journey to market slow down?</h1><p>Explore six connected hypotheses. Each outcome reflects the evidence currently available and remains qualified where critical data is missing.</p></div><div className="big-number"><span>2024 regional production</span><strong>{numberFormat.format(total)}</strong><small>tonnes reported by FAOSTAT</small></div></section><div className="hyp-grid">{cards.map(({id,name,question,Icon,color,outcome,tone,rationale})=><article key={id} className="hyp-card" style={{"--accent":color} as React.CSSProperties}><Icon/><span>{id}</span><h2>{name}</h2><p>{question}</p><EvidenceStatus tone={tone}>{outcome}</EvidenceStatus><p className="evidence-rationale">{rationale}</p></article>)}</div><section className="callout"><strong>Current evidence decision</strong><p>H5 is supported as a reliable-sourcing bottleneck. H4 and H6 have preliminary or partial support. H1–H3 remain inconclusive—not rejected—because decisive evidence is still missing.</p></section></div>;
}
