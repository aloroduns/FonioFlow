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
