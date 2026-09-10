import {z} from "zod";

const short=z.string().trim().min(1).max(200);
const optionalShort=z.string().trim().max(500).optional().nullable();

export const verificationSubmissionSchema=z.object({
  seller_id:short,verified_at:z.string().datetime().optional(),verified_by:optionalShort,
  availability_status:optionalShort,delivery_coverage:optionalShort,
  price_observed:z.number().nonnegative().optional().nullable(),currency:z.string().trim().length(3).toUpperCase().optional().nullable(),
  evidence_url:z.string().url().max(2000).optional().nullable(),notes:z.string().trim().max(2000).optional().nullable(),
}).strict();

export const wholesaleInquirySchema=z.object({
  seller_id:short,sent_at:z.string().datetime(),response_at:z.string().datetime().optional().nullable(),
  destination_market:short,requested_quantity_kg:z.number().positive().max(1_000_000).optional().nullable(),
  quoted_price:z.number().nonnegative().optional().nullable(),quoted_currency:z.string().trim().length(3).toUpperCase().optional().nullable(),
  minimum_order_kg:z.number().nonnegative().optional().nullable(),delivery_terms:optionalShort,
  information_completeness:optionalShort,notes:z.string().trim().max(2000).optional().nullable(),
}).strict();

export const demandSubmissionSchema=z.object({
  country:short,city:optionalShort,product_form:optionalShort,
  desired_quantity_kg:z.number().positive().max(100_000).optional().nullable(),purchase_frequency:optionalShort,
  willingness_to_pay:z.number().nonnegative().max(1_000_000).optional().nullable(),currency:z.string().trim().length(3).toUpperCase().optional().nullable(),
  consent_to_research:z.literal(true),
}).strict();
