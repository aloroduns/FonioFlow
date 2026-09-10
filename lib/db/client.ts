import {neon,type NeonQueryFunction} from "@neondatabase/serverless";

let client:NeonQueryFunction<false,false>|null=null;

export function databaseConfigured(){return Boolean(process.env.DATABASE_URL)}

export function db(){
  const connectionString=process.env.DATABASE_URL;
  if(!connectionString) throw new Error("DATABASE_URL is not configured");
  client??=neon(connectionString);
  return client;
}
