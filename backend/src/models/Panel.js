import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const Panel = sequelize.define("panel_master", {
  PanelID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  PanelName: DataTypes.STRING,
  IsActive: DataTypes.BOOLEAN
});
export default Panel;
