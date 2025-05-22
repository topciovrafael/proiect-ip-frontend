import sql from "mssql";
import "dotenv/config";

const pool = new sql.ConnectionPool(process.env.SQL_CONN);
const poolConnect = pool.connect();   // kicks off the initial handshake

/**
 * Runs a parameterised query and returns recordset[]
 *
 * @param {string} text  – SQL text with @params
 * @param {(req: sql.Request) => void} bind – callback to add .input(...)
 */
export async function query(text, bind = () => {}) {
  await poolConnect;                 // wait until connected
  const req = pool.request();
  bind(req);                         // attach parameters
  const { recordset } = await req.query(text);
  return recordset;
}
