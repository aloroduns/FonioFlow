import assert from "node:assert/strict";import fs from "node:fs";import test from "node:test";import path from "node:path";
const read=name=>JSON.parse(fs.readFileSync(path.join("data/generated",name),"utf8"));
test("all six data contracts contain records",()=>{for(const file of fs.readdirSync("data/generated").filter(x=>x.endsWith(".json"))){const payload=read(file);for(const [key,rows] of Object.entries(payload))assert.ok(rows.length>0,`${file}:${key} is empty`)}});
test("production years and values are numeric",()=>{for(const row of read("h1-production.json").production){assert.equal(typeof row.year,"number");assert.equal(typeof row.production_tonnes,"number")}});
test("published seller records retain evidence links",()=>{for(const seller of read("h5-sellers.json").sellers){assert.ok(seller.source_url?.startsWith("http"));assert.ok(seller.verification_status)}});
