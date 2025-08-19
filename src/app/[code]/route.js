import { NextResponse } from "next/server";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

async function fetchOriginalUrlByCode(shortCode) {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME || !AIRTABLE_API_KEY) {
    return null;
  }

  const filter = encodeURIComponent(`{ShortCode}="${shortCode}"`);
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    AIRTABLE_TABLE_NAME
  )}?maxRecords=1&filterByFormula=${filter}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = await response.json();
  const record = data.records?.[0];
  const original = record?.fields?.OriginalUrl || null;
  if (!original) return null;

  if (/^https?:\/\//i.test(original)) return original;
  return `https://${original}`;
}

export async function GET(_req, { params }) {
  const destination = await fetchOriginalUrlByCode(params.code);
  if (!destination) {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.redirect(destination, 302);
}


