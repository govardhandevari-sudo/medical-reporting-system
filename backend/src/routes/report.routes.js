import express from "express";
import {
  getDoctorShareReport,
  getServiceWiseReport,
  getPanelSummaryReport,
  getWeeklyTrendReport,
  getTopTestsReport,
  getFinancialSummaryReport,
  getRevenueReport,locationHdSummary
} from "../controllers/report.controller.js";



const router = express.Router();
router.get("/doctor-share", getDoctorShareReport);

router.get("/service-wise", getServiceWiseReport);
router.get("/panel-summary", getPanelSummaryReport);
router.get("/weekly-trend", getWeeklyTrendReport);
router.get("/top-tests", getTopTestsReport);
router.get("/financial-summary", getFinancialSummaryReport);
router.get("/revenue-report", getRevenueReport);
router.get("/location-hd-summary", locationHdSummary);

export default router;
