import { notFound, redirect } from "next/navigation";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

async function fetchOriginalUrlByCode(shortCode) {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME || !AIRTABLE_API_KEY) {
    return null;
  }

  const filter = encodeURIComponent(`{ShortCode}='${shortCode}'`);
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    AIRTABLE_TABLE_NAME
  )}?maxRecords=1&filterByFormula=${filter}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const record = data.records?.[0];
  return record?.fields?.OriginalUrl || null;
}

export default async function ShortRedirectPage({ params }) {
  const originalUrl = await fetchOriginalUrlByCode(params.code);

  if (!originalUrl) {
    notFound();
  }

  redirect(originalUrl);
}


