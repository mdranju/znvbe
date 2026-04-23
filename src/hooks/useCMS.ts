"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;

export function useCMS() {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetadata() {
      if (!BASE_URL) return;
      try {
        const response = await axios.get(`${BASE_URL}/metadata`);
        if (response.data?.success && response.data?.data) {
          setMetadata(response.data.data);
        } else {
          setMetadata({});
        }
      } catch (error) {
        // Silently handle missing metadata to prevent breaking the UI
        console.warn("CMS Metadata not found, using defaults");
        setMetadata({});
      } finally {
        setLoading(false);
      }
    }
    fetchMetadata();
  }, []);

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("data:")) return path;

    const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL?.replace(
      /=+$/,
      "",
    );

    return `${IMAGE_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return { metadata, loading, getImageUrl };
}
