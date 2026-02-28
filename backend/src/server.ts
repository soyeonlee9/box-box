import app from './app';
import { startWeeklyReportCron } from './jobs/weeklyReport.job';

const port = process.env.PORT || 5001;

// Initialize Cron Jobs
startWeeklyReportCron();

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
