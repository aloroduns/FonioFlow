import {z} from "zod";

export const productionRecordSchema=z.object({
  country:z.string().min(1),
  m49:z.string().optional(),
  year:z.number().int(),
  production_tonnes:z.number().nonnegative(),
  area_harvested_ha:z.number().nonnegative().nullable().optional(),
  yield_kg_ha:z.number().nonnegative().nullable().optional(),
  production_flag:z.string().nullable().optional(),
  area_flag:z.string().nullable().optional(),
  yield_flag:z.string().nullable().optional(),
  has_non_official_value:z.boolean().optional(),
  missing_data_flag:z.string().nullable().optional(),
  source_url:z.string().url().optional(),
});

export const availabilityRecordSchema=z.object({
  country:z.string().min(1),
  iso3:z.string().length(3).optional(),
  year:z.number().int(),
  production_tonnes:z.number().nonnegative().optional(),
  import_tonnes:z.number().nonnegative().nullable().optional(),
  export_tonnes:z.number().nonnegative().nullable().optional(),
  estimated_domestic_availability_tonnes:z.number().nonnegative().optional(),
  population:z.number().int().positive().optional(),
  availability_kg_per_person:z.number().nonnegative(),
  import_value_usd:z.number().nonnegative().nullable().optional(),
  import_unit_value_usd_kg:z.number().nonnegative().nullable().optional(),
  trade_completeness:z.string().optional(),
  missing_data_flag:z.string().nullable().optional(),
  source:z.string().optional(),
});

export const productionRecordsSchema=z.array(productionRecordSchema).min(1);
export const availabilityRecordsSchema=z.array(availabilityRecordSchema).min(1);

export type ProductionRecord=z.infer<typeof productionRecordSchema>;
export type AvailabilityRecord=z.infer<typeof availabilityRecordSchema>;

export type DataStatus="live"|"cached"|"static";

export type ApiMetadata={
  status:DataStatus;
  source:string;
  sourceTimestamp:string;
  retrievedAt:string;
  recordCount:number;
  missingDataCount:number;
  warnings:string[];
};

export type ApiEnvelope<T>={data:T;meta:ApiMetadata};
