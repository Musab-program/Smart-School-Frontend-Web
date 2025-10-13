"use server";
import * as fs from "fs/promises";
import path from "path";

function getDataPath(fileName: string) {
  return path.join(process.cwd(), "src/data", fileName);
}

export async function readJsonFile<T>(fileName: string): Promise<T> {
  const filePath = getDataPath(fileName);
  const fileContent = await fs.readFile(filePath, { encoding: "utf-8" });
  return JSON.parse(fileContent) as T;
}


