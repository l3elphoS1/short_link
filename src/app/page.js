"use client";
import { useState } from "react";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShortUrl("");

    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    if (data.shortUrl) {
      setShortUrl(data.shortUrl);
    } else {
      alert(
        "Error: " + (data.error?.message || "ไม่สามารถสร้าง short link ได้")
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-300">
      <h1 className="text-2xl font-bold mb-4">Shortlink Generator</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          placeholder="กรอก URL ที่ต้องการย่อ"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border rounded p-2 w-80"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Shorten
        </button>
      </form>

      {shortUrl && (
        <div className="mt-4">
          <p className="text-green-600 font-semibold">Short URL:</p>
          <a
            href={shortUrl}
            className="text-blue-500 underline"
            target="_blank"
          >
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}
