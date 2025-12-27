import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const Doctor = sequelize.define("doctor_referal", {
  DoctorID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  DoctorName: DataTypes.STRING,
  Mobile: DataTypes.STRING,
  Email: DataTypes.STRING,
  CityID: DataTypes.INTEGER,
  CentreID: DataTypes.INTEGER,
  IsActive: DataTypes.BOOLEAN
});
export default Doctor;
