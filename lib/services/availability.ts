import h6 from "@/data/generated/h6-demand.json";
import {availabilityRecordsSchema,type AvailabilityRecord} from "@/lib/api/contracts";
import {resolveDataset} from "@/lib/api/resolve-dataset";
import {filterEnvelope} from "@/lib/api/filter-envelope";
import {fetchFaostatProduction} from "@/lib/providers/faostat";
import {fetchFonioTrade} from "@/lib/providers/comtrade";
import {fetchPopulation} from "@/lib/providers/world-bank";
import {countryCodes} from "@/lib/providers/country-codes";

export async function getAvailability(country?:string,year?:number){
  const codes=country?countryCodes(country):null;
  const canUseLive=Boolean(country&&year&&codes);
  const envelope=await resolveDataset({
    cacheKey:`availability:${country??"all"}:${year??"all"}`,
    source:"FAOSTAT | UN Comtrade | World Bank",
    staticData:h6.availability as AvailabilityRecord[],
    staticTimestamp:"2026-09-08",
    schema:availabilityRecordsSchema,
    live:canUseLive?async()=>{
      const [productionResult,tradeResult,populationResult]=await Promise.all([
        fetchFaostatProduction(country,year),
        fetchFonioTrade(codes!.m49,year!),
        fetchPopulation(codes!.iso3,year!),
      ]);
      const production=productionResult.data.find(row=>row.country.toLowerCase()===country!.toLowerCase()&&row.year===year);
      if(!production) throw new Error("Live production record could not be matched to the requested country and year");
      const imports=tradeResult.data.import_tonnes;
      const exports=tradeResult.data.export_tonnes;
      const domestic=Math.max(0,production.production_tonnes+(imports??0)-(exports??0));
      const missing=[production.missing_data_flag,tradeResult.data.missing_data_flag].filter(Boolean).join("; ")||null;
      const row:AvailabilityRecord={
        country:production.country,iso3:codes!.iso3,year:year!,production_tonnes:production.production_tonnes,
        import_tonnes:imports,export_tonnes:exports,estimated_domestic_availability_tonnes:domestic,
        population:populationResult.population,availability_kg_per_person:domestic*1000/populationResult.population,
        import_value_usd:tradeResult.data.import_value_usd,
        import_unit_value_usd_kg:imports&&tradeResult.data.import_value_usd?tradeResult.data.import_value_usd/(imports*1000):null,
        trade_completeness:missing?"Partial live trade record":"Live import and export flows",
        missing_data_flag:missing,
        source:"FAOSTAT | UN Comtrade HS 100840 | World Bank SP.POP.TOTL",
      };
      return {data:[row],sourceTimestamp:[productionResult.sourceTimestamp,tradeResult.sourceTimestamp,populationResult.sourceTimestamp].sort().at(-1)!};
    }:undefined,
  });
  return filterEnvelope(envelope,row=>(!country||row.country.toLowerCase()===country.toLowerCase())&&(!year||row.year===year));
}
