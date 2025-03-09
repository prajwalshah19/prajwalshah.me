import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'kp6s20e6',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: "2024-01-01",
  useCdn: true,
});