import { NowRequest, NowResponse } from "@vercel/node";
import { getMonthProgress } from "../src/month-progress";

// https://github.com/moriyuu/month-progress
// https://month-progress.moriyuu.vercel.app/api/progress
// https://vercel.com/docs/solutions/cron-jobs

export default (request: NowRequest, response: NowResponse) => {
  const { progressBar, percentage } = getMonthProgress();
  response.status(200).json({
    progressBar,
    percentage,
  });
};
