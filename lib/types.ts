export type ProductionRecord = {country:string;year:number;production_tonnes:number;area_harvested_ha:number;yield_kg_ha:number};
export type ProcessorRecord = {record_id:string;name:string;country_coverage:string;location:string;evidence_strength:string;processing_stages:string;capacity_evidence:string;missing_indicators:string};
export type RouteRecord = {route_id:string;origin_location:string;destination_port:string};
export type RoadRouteRecord = {"Route ID":string;Origin:string;Destination:string;"Distance km":number;"Driving time":string;"International borders":number};
export type PriceRecord = {Grain:string;"Average USD/kg":number;"Comparable products":number;"Evidence status":string};
export type SellerRecord = {seller_id:string;seller_name:string;market:string;channel:string;product_form:string;verification_status:string;availability_status:string;origin:string;source_url:string;verified_date:string};
export type AvailabilityRecord = {country:string;year:number;availability_kg_per_person:number};
export type SurveyRecord = {Measure:string;"Response option":string;"% of respondents":number};
