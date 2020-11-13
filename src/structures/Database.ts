import { ConnectionManager } from "typeorm";

import { dbName } from "../Config";
import path from "path";

import { Settings } from "../models/Settings";
import { Banlist } from "../models/Banlist";

const connectionManager: ConnectionManager = new ConnectionManager();

connectionManager.create({
  name: dbName,
  type: "sqlite",
  database: path.resolve(__dirname, "../../db.sqlite"),
  entities: [Settings, Banlist],
  logger: "debug",
});

export default connectionManager;
