import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const endpoints=["production","processing","routes","prices","sellers","trade-availability","survey"];

test("all documented internal API endpoints have route handlers",()=>{
  for(const endpoint of endpoints) assert.ok(fs.existsSync(`app/api/${endpoint}/route.ts`),`missing /api/${endpoint}`);
});

test("example environment defaults to validated static snapshots",()=>{
  const env=fs.readFileSync(".env.example","utf8");
  assert.match(env,/^DATA_PROVIDER=static$/m);
  assert.match(env,/^DATA_REQUEST_TIMEOUT_MS=8000$/m);
});

test("all hypothesis screens expose API provenance",()=>{
  const screens=["production","processing","routes","price","sellers","demand"];
  for(const screen of screens){
    const source=fs.readFileSync(`components/fonioflow/${screen}-screen.tsx`,"utf8");
    assert.match(source,/DataStatus/,`${screen} does not display API status`);
    assert.match(source,/useApiDataset/,`${screen} does not use the internal API`);
  }
});

test("fallback labels and missing-data warnings are visible",()=>{
  const shared=fs.readFileSync("components/fonioflow/shared.tsx","utf8");
  for(const label of ["Live data","Validated snapshot","Fallback active","Last updated","Source organization","Missing-data records"]){
    assert.ok(shared.includes(label),`missing interface label: ${label}`);
  }
});

test("maintainable record schema preserves verification and review history",()=>{
  const schema=fs.readFileSync("database/schema.sql","utf8");
  for(const table of ["sellers","seller_verifications","wholesale_inquiries","demand_submissions","source_reviews"]){
    assert.match(schema,new RegExp(`create table if not exists ${table}`));
  }
});
