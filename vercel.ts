import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  // Hobby plan allows at most one cron run per day; the public blog queries already treat a
  // SCHEDULED post whose publishedAt has passed as visible, so this only needs to flip the DB
  // status label periodically, not in near-real-time.
  crons: [{ path: "/api/cron/publish-scheduled", schedule: "0 6 * * *" }],
};
