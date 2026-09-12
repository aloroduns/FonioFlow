"use client";
import {BarChart,Bar,CartesianGrid,ResponsiveContainer,Tooltip,XAxis,YAxis} from "recharts";
import {useApiDataset} from "@/hooks/use-api-dataset";
import type {AvailabilityRecord} from "@/lib/api/contracts";
import {fonioData} from "@/lib/data";
import type {SurveyRecord} from "@/lib/types";
import {DataStatus,Metric,ScreenTitle} from "./shared";

export function DemandScreen(){
  const availabilityApi=useApiDataset<AvailabilityRecord>("/api/trade-availability",fonioData.availability,"FAOSTAT | UN Comtrade | World Bank");
  const surveyApi=useApiDataset<SurveyRecord>("/api/survey",fonioData.survey,"Fonio Market Research Survey");
  const latest=Object.values(availabilityApi.data.reduce<Record<string,AvailabilityRecord>>((result,row)=>{if(!result[row.country]||row.year>result[row.country].year)result[row.country]=row;return result},{})).sort((a,b)=>b.availability_kg_per_person-a.availability_kg_per_person).slice(0,8);
  const count=(measure:string,options:string[])=>surveyApi.data.filter(item=>item.Measure===measure&&options.includes(item["Response option"])).reduce((sum,item)=>sum+item.Count,0);
  const submitted=count("Awareness",["Yes","No","Not sure"])||fonioData.surveyAudit.submitted_records;
  const share=(value:number)=>`${(value/submitted*100).toFixed(1)}%`;
  const aware=count("Awareness",["Yes"]);
  const eaten=count("Ever eaten",["Yes, within the past year","Yes, but more than one year ago"]);
  const purchaseIntent=count("Three-month purchase likelihood",["Very likely","Somewhat likely"]);
  const farmerInfluence=count("Farmer-support influence",["Much more likely to purchase","Slightly more likely"]);
  const keyFindings=[{label:"Aware of fonio",value:aware},{label:"Previously eaten fonio",value:eaten},{label:"Likely to purchase at an acceptable price",value:purchaseIntent},{label:"More likely when farmer support is disclosed",value:farmerInfluence}];
  return <div className="page">
    <ScreenTitle code="H6" title="Demand & Domestic Availability" text="Combine production, reported trade, population and survey evidence from 150 unique respondents."/>
    <div className="status-stack"><DataStatus meta={availabilityApi.meta} loading={availabilityApi.loading}/><DataStatus meta={surveyApi.meta} loading={surveyApi.loading}/></div>
    <div className="metric-grid four"><Metric label="Unique survey respondents" value={`${submitted}`}/><Metric label="Aware of fonio" value={share(aware)}/><Metric label="Likely purchase in 3 months" value={share(purchaseIntent)}/><Metric label="Farmer-support influence" value={share(farmerInfluence)}/></div>
    <div className="availability"><div className="chart-card"><h3>Latest availability per person</h3><ResponsiveContainer width="100%" height={330}><BarChart data={latest} layout="vertical"><CartesianGrid strokeDasharray="3 3"/><XAxis type="number"/><YAxis type="category" dataKey="country" width={90}/><Tooltip/><Bar dataKey="availability_kg_per_person" fill="#A45147" radius={[0,8,8,0]}/></BarChart></ResponsiveContainer></div><div className="survey-card"><h3>Survey findings</h3>{keyFindings.map(item=><div key={item.label}><span>{item.label}</span><strong>{share(item.value)}</strong></div>)}<p>Project-owner confirmation records all {submitted} entries as unique respondents. Identical answer rows are retained as matching responses from different individuals. Findings describe the surveyed sample.</p></div></div>
  </div>;
}
