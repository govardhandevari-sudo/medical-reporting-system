import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const LabInvestigation = sequelize.define("patient_labinvestigation_opd", {
  LabInvestigationID: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  PatientID: DataTypes.BIGINT,
  InvestigationID: DataTypes.INTEGER,
  CentreID: DataTypes.INTEGER,
  DoctorID: DataTypes.INTEGER,
  ResultDate: DataTypes.DATE,
  Amount: DataTypes.DECIMAL(10,2)
});
export default LabInvestigation;
