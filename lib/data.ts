import h1 from "@/data/generated/h1-production.json";
import h2 from "@/data/generated/h2-processing.json";
import h3 from "@/data/generated/h3-routes.json";
import h4 from "@/data/generated/h4-prices.json";
import h5 from "@/data/generated/h5-sellers.json";
import h6 from "@/data/generated/h6-demand.json";
import type {AvailabilityRecord,PriceRecord,ProcessorRecord,ProductionRecord,RoadRouteRecord,RouteRecord,SellerRecord,SurveyAudit,SurveyRecord} from "./types";

export const fonioData={
 production:h1.production as ProductionRecord[],
 processors:h2.processors as ProcessorRecord[], capacities:h2.capacities,
 routes:h3.routes as RouteRecord[], roadRoutes:h3.roadRoutes as RoadRouteRecord[],
 prices:h4.prices as PriceRecord[], retail:h4.retail,
 sellers:h5.sellers as SellerRecord[], failures:h5.failures,
 availability:h6.availability as AvailabilityRecord[], survey:h6.survey as SurveyRecord[], surveyAudit:h6.surveyAudit as SurveyAudit,
};
