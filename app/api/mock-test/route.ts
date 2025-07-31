// pages/api/mock-data.js
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export  async  function GET() {
  const filePath = path.resolve('public/testweather.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return  NextResponse.json(JSON.parse(jsonData));
}

