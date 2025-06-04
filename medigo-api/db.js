import sql from "mssql";
import "dotenv/config";

const pool = new sql.ConnectionPool({
  user: "admin1234",
  password: "Medigo1234",
  server: "medigo.database.windows.net", // do NOT include `tcp:` or port in this string
  database: "medigo",
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
  port: 1433,
});

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
