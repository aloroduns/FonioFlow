"use client";
import {useMemo,useState} from "react";
import {AreaChart,Area,CartesianGrid,ResponsiveContainer,Tooltip,XAxis,YAxis} from "recharts";
import {useApiDataset} from "@/hooks/use-api-dataset";
import type {ProductionRecord} from "@/lib/api/contracts";
import {fonioData} from "@/lib/data";
import {numberFormat} from "@/lib/format";
import {DataStatus,Metric,ScreenTitle} from "./shared";
export function ProductionScreen(){
 const {data,meta,loading}=useApiDataset<ProductionRecord>("/api/production",fonioData.production,"FAOSTAT");
 const years=useMemo(()=>Array.from(new Set(data.map(row=>row.year))).sort(),[data]);
 const [year,setYear]=useState(2024);const [country,setCountry]=useState("Guinea");
 const effectiveYear=years.includes(year)?year:(years.at(-1)??2024);
 const rows=data.filter(row=>row.year===effectiveYear).sort((a,b)=>b.production_tonnes-a.production_tonnes);
 const selected=rows.find(row=>row.country===country)??rows[0];
 const trend=data.filter(row=>row.country===country).map(row=>({year:row.year,production:row.production_tonnes}));
 return <div className="page"><ScreenTitle code="H1" title="Production Time Machine" text="Move through time, select a country, and compare production, harvested area and yield."/><DataStatus meta={meta} loading={loading}/><div className="controls"><label>Year <strong>{effectiveYear}</strong><input aria-label="Production year" type="range" min={years[0]} max={years.at(-1)} value={effectiveYear} onChange={event=>setYear(+event.target.value)}/></label><label>Country<select value={country} onChange={event=>setCountry(event.target.value)}>{rows.map(row=><option key={row.country}>{row.country}</option>)}</select></label></div><div className="two-col"><div className="map-card"><div className="map-title"><span>West African production</span><small>Circle size represents tonnes • {effectiveYear}</small></div><div className="bubble-map">{rows.map((row,index)=><button aria-label={`View ${row.country}`} key={row.country} onClick={()=>setCountry(row.country)} className={country===row.country?"bubble active":"bubble"} style={{left:`${10+(index%4)*24}%`,top:`${10+Math.floor(index/4)*27}%`,width:`${Math.max(28,Math.sqrt(row.production_tonnes||1)*.12)}px`,height:`${Math.max(28,Math.sqrt(row.production_tonnes||1)*.12)}px`}}><span>{row.country}</span></button>)}</div></div><div><div className="metric-grid"><Metric label="Production" value={`${numberFormat.format(selected?.production_tonnes||0)} t`}/><Metric label="Harvested area" value={`${numberFormat.format(selected?.area_harvested_ha||0)} ha`}/><Metric label="Yield" value={`${numberFormat.format(selected?.yield_kg_ha||0)} kg/ha`}/></div><div className="chart-card"><h3>{country} production trend</h3><ResponsiveContainer width="100%" height={260}><AreaChart data={trend}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="year"/><YAxis/><Tooltip/><Area dataKey="production" stroke="#B67B21" fill="#E9C982"/></AreaChart></ResponsiveContainer></div></div></div></div>;
}
