import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const Investigation = sequelize.define("investigation_master", {
  InvestigationID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  InvestigationName: DataTypes.STRING,
  Method: DataTypes.STRING,
  IsActive: DataTypes.BOOLEAN
});
export default Investigation;
