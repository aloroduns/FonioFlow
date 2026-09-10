"use client";
import {MapPin} from "lucide-react";
import {useApiDataset} from "@/hooks/use-api-dataset";
import {fonioData} from "@/lib/data";
import type {ProcessorRecord} from "@/lib/types";
import {DataStatus,EvidenceStatus,Metric,ScreenTitle} from "./shared";
export function ProcessingScreen(){const {data,meta,loading}=useApiDataset<ProcessorRecord>("/api/processing",fonioData.processors,"Validated public facility and initiative sources");return <div className="page"><ScreenTitle code="H2" title="Processing Landscape" text="Review identified facilities, processing stages, reported capacity and unresolved evidence gaps."/><DataStatus meta={meta} loading={loading}/><div className="metric-grid four"><Metric label="Initiatives" value={`${data.length}`}/><Metric label="Capacity observations" value={`${fonioData.capacities.length}`}/><Metric label="Current capacity records" value="2"/><Metric label="Decision" value="Not concluded"/></div><div className="card-list">{data.map(processor=><article key={processor.record_id}><div><EvidenceStatus>{processor.evidence_strength} evidence</EvidenceStatus><h3>{processor.name}</h3><p><MapPin/> {processor.location} • {processor.country_coverage}</p></div><p>{processor.processing_stages}</p><strong>{processor.capacity_evidence}</strong><small>Missing: {processor.missing_indicators}</small></article>)}</div></div>}
