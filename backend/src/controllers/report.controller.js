import sequelize from "../config/db.js";

export const getRevenueReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    const [rows] = await sequelize.query(
      `
      SELECT 
          c.Centre AS Centre,
          COALESCE(e.Name, c.UnitHead, 'Unassigned') AS BDHead,
          DATE_FORMAT(l.Date, '%d-%b') AS DayLabel,
          SUM(l.Amount) AS DailyAmount
      FROM 
          patient_labinvestigation_opd l
          JOIN centre_master c ON c.CentreID = l.CentreID
          LEFT JOIN employee_master e ON e.Employee_ID = c.UnitHeadID
      WHERE 
          DATE(l.Date) BETWEEN :from AND :to
      GROUP BY 
          c.Centre, e.Name, c.UnitHead, DayLabel
      ORDER BY 
          c.Centre, MIN(l.Date);
      `,
      { replacements: { from, to },logging: console.log }
    );

    // ✅ Pivot transformation
    const pivotMap = new Map();
    const dateSet = new Set();

    rows.forEach((r) => {
      const key = `${r.Centre}-${r.BDHead}`;
      dateSet.add(r.DayLabel);
      if (!pivotMap.has(key)) {
        pivotMap.set(key, {
          Centre: r.Centre,
          BDHead: r.BDHead,
          Total: 0,
        });
      }
      const rec = pivotMap.get(key);
      rec[r.DayLabel] = (r.DailyAmount || 0);
      rec.Total += r.DailyAmount || 0;
      pivotMap.set(key, rec);
    });

    const dateColumns = Array.from(dateSet).sort((a, b) => {
      const [aDay] = a.split("-");
      const [bDay] = b.split("-");
      return parseInt(aDay) - parseInt(bDay);
    });

    const data = Array.from(pivotMap.values());

    // ✅ Add grand total row
    const grandTotal = { Centre: "GRAND TOTAL", BDHead: "", Total: 0 };
    dateColumns.forEach((d) => (grandTotal[d] = 0));

    data.forEach((row) => {
      dateColumns.forEach((d) => {
        grandTotal[d] += row[d] || 0;
      });
      grandTotal.Total += row.Total || 0;
    });
    data.push(grandTotal);

    return res.json({ success: true, data, dateColumns });
  } catch (err) {
    console.error("❌ Revenue Report Error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getDoctorShareReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    console.log("📅 Incoming query:", from, to);

    const [data] = await sequelize.query(
      `
      SELECT 
          d.Name AS DoctorName,
          COUNT(l.Test_ID) AS total_tests,
          SUM(l.Amount) AS total_amount,
          ROUND(SUM(l.Amount) * 0.15, 2) AS commission
      FROM 
          doctor_referal d
          JOIN patient_labinvestigation_opd l 
              ON l.ForwardToDoctor = d.Doctor_ID
      WHERE 
          DATE(l.Date) BETWEEN :from AND :to
      GROUP BY 
          d.Doctor_ID
      ORDER BY 
          total_amount DESC;
      `,
      { replacements: { from, to } }
    );

    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ SQL Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


/* ================================================
   Additional Reports
   ================================================ */
export const getServiceWiseReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const [data] = await sequelize.query(
      `
      SELECT 
        i.Name AS ServiceName,
        COUNT(l.Test_ID) AS total_tests,
        SUM(l.Amount) AS total_amount
      FROM 
        patient_labinvestigation_opd l
        JOIN investigation_master i 
            ON i.Investigation_Id = l.Investigation_ID
      WHERE 
        DATE(l.Date) BETWEEN :from AND :to
      GROUP BY 
        l.Investigation_ID
      ORDER BY 
        total_amount DESC;
      `,
      { replacements: { from, to } }
    );
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Service Wise Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getPanelSummaryReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const [data] = await sequelize.query(
      `
      SELECT 
        p.PanelName,
        COUNT(l.Test_ID) AS total_tests,
        SUM(l.Amount) AS total_amount
      FROM 
        panel_master p
        JOIN patient_labinvestigation_opd l ON p.Panel_ID = l.Panel_ID
      WHERE 
        DATE(l.Date) BETWEEN :from AND :to
      GROUP BY 
        p.Panel_ID
      ORDER BY 
        total_amount DESC;
      `,
      { replacements: { from, to } }
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getWeeklyTrendReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const [data] = await sequelize.query(
      `
      SELECT 
        YEARWEEK(l.Date, 1) AS week_number,
        DATE_FORMAT(MIN(l.Date), '%Y-%m-%d') AS start_date,
        DATE_FORMAT(MAX(l.Date), '%Y-%m-%d') AS end_date,
        SUM(l.Amount) AS total_amount,
        COUNT(l.Test_ID) AS total_tests
      FROM 
        patient_labinvestigation_opd l
      WHERE 
        DATE(l.Date) BETWEEN :from AND :to
      GROUP BY 
        YEARWEEK(l.Date, 1)
      ORDER BY 
        week_number ASC;
      `,
      { replacements: { from, to } }
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTopTestsReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const [data] = await sequelize.query(
      `
      SELECT 
        i.Name AS TestName,
        COUNT(l.Test_ID) AS total_tests,
        SUM(l.Amount) AS total_amount
      FROM 
        patient_labinvestigation_opd l
        JOIN investigation_master i 
            ON i.Investigation_Id = l.Investigation_ID
      WHERE 
        DATE(l.Date) BETWEEN :from AND :to
      GROUP BY 
        l.Investigation_ID
      ORDER BY 
        total_tests DESC
      LIMIT 10;
      `,
      { replacements: { from, to } }
    );
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Top Tests Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getFinancialSummaryReport = async (req, res) => {
  try {
    const [data] = await sequelize.query(
      `
      SELECT 
        ReportMonth,
        TotalRevenue,
        TotalTests,
        TotalCommission
      FROM 
        financial_summary
      ORDER BY 
        ReportMonth ASC;
      `
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const locationHdSummary = async (req, res) => {
  try {
    const { date_from, date_to } = req.query;

    if (!date_from || !date_to) {
      return res.status(400).json({ message: "date_from and date_to required" });
    }

    const sql = `
      SELECT
        cm.Centre AS centre,

        SUM(
          CASE 
            WHEN (
              CASE
                WHEN UPPER(scm.Name) IN (
                  'XRAY','X-RAY','CT','MRI','USG','ULTRASOUND',
                  'MAMMOGRAPHY','DEXA'
                ) THEN 'RAD'
                ELSE 'LAB'
              END
            ) = 'LAB'
            THEN CASE WHEN plo.IsRefund = 1 THEN -plo.Amount ELSE plo.Amount END
            ELSE 0
          END
        ) AS lab,

        SUM(
          CASE 
            WHEN (
              CASE
                WHEN UPPER(scm.Name) IN (
                  'XRAY','X-RAY','CT','MRI','USG','ULTRASOUND',
                  'MAMMOGRAPHY','DEXA'
                ) THEN 'RAD'
                ELSE 'LAB'
              END
            ) = 'RAD'
            THEN CASE WHEN plo.IsRefund = 1 THEN -plo.Amount ELSE plo.Amount END
            ELSE 0
          END
        ) AS rad,

        SUM(
          CASE WHEN plo.IsRefund = 1 THEN -plo.Amount ELSE plo.Amount END
        ) AS total

      FROM f_ledgertransaction fl
      JOIN centre_master cm ON cm.CentreID = fl.CentreID
      JOIN patient_labinvestigation_opd plo
        ON plo.LedgerTransactionNo = fl.LedgerTransactionNo
      JOIN f_subcategorymaster scm
        ON scm.SubCategoryID = plo.SubCategoryID

      WHERE fl.Date BETWEEN :date_from AND :date_to
      GROUP BY cm.CentreID
      ORDER BY cm.Centre
    `;

    const [rows] = await sequelize.query(sql, {
      replacements: { date_from, date_to }
    });

    const grandTotal = rows.reduce(
      (acc, r) => ({
        lab: acc.lab + Number(r.lab || 0),
        rad: acc.rad + Number(r.rad || 0),
        total: acc.total + Number(r.total || 0)
      }),
      { lab: 0, rad: 0, total: 0 }
    );

    res.json({ rows, grandTotal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

