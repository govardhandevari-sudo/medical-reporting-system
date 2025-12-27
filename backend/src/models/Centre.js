import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const Centre = sequelize.define("centre_master", {
  CentreID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  CentreName: DataTypes.STRING,
  CityID: DataTypes.INTEGER,
  Address: DataTypes.TEXT,
  IsActive: DataTypes.BOOLEAN,
  logging: console.log
});
export default Centre;
