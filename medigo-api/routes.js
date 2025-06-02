/* routes.js – Medigo API (ES-module) */
import { Router } from "express";
import sql from "mssql";
import { query } from "./db.js";

const router = Router();

/* turn "", undefined, null, 123  ⇒  null | trimmed string */
const sqlValue = (v) =>
  v === undefined || v === null || v === "" ? null : String(v).trim();

/* ─────────────── PACIENȚI ─────────────── */

/* all patients */
router.get("/patients", async (_req, res) => {
  try {
    const rows = await query(`
      SELECT ID_pacient AS id, nume, prenume, CNP,
             adresa, telefon, salon, pat
        FROM dbo.pacienti`);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* one patient */
router.get("/patients/:id", async (req, res) => {
  const id = +req.params.id;
  try {
    const rows = await query(
      `SELECT ID_pacient AS id, nume, prenume, CNP,
              adresa, telefon, salon, pat
         FROM dbo.pacienti
        WHERE ID_pacient = @id`,
      (r) => r.input("id", sql.Int, id)
    );
    if (!rows.length) return res.status(404).send("Not found");
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* create */
router.post("/patients", async (req, res) => {
  const { nume, prenume, CNP } = req.body;
  if (!nume || !prenume || !CNP)
    return res.status(400).send("nume, prenume și CNP sunt obligatorii");

  try {
    await query(
      `INSERT INTO dbo.pacienti
         (nume, prenume, CNP, adresa, telefon, salon, pat)
       VALUES
         (@nume,@prenume,@CNP,@adresa,@telefon,@salon,@pat)`,
      (r) =>
        r
          .input("nume", sql.VarChar(100), nume)
          .input("prenume", sql.VarChar(100), prenume)
          .input("CNP", sql.Char(13), CNP)
          .input("adresa", sql.VarChar(255), sqlValue(req.body.adresa))
          .input("telefon", sql.VarChar(20), sqlValue(req.body.telefon))
          .input("salon", sql.VarChar(10), sqlValue(req.body.salon))
          .input("pat", sql.VarChar(10), sqlValue(req.body.pat))
    );
    res.status(201).send("Inserted");
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* update */
router.put("/patients/:id", async (req, res) => {
  const id = +req.params.id;
  const { nume, prenume, CNP } = req.body;
  if (!nume || !prenume || !CNP)
    return res.status(400).send("nume, prenume și CNP sunt obligatorii");

  try {
    await query(
      `UPDATE dbo.pacienti
          SET nume    = @nume,
              prenume = @prenume,
              CNP     = @CNP,
              adresa  = @adresa,
              telefon = @telefon,
              salon   = @salon,
              pat     = @pat
        WHERE ID_pacient = @id`,
      (r) =>
        r
          .input("id", sql.Int, id)
          .input("nume", sql.VarChar(100), nume)
          .input("prenume", sql.VarChar(100), prenume)
          .input("CNP", sql.Char(13), CNP)
          .input("adresa", sql.VarChar(255), sqlValue(req.body.adresa))
          .input("telefon", sql.VarChar(20), sqlValue(req.body.telefon))
          .input("salon", sql.VarChar(10), sqlValue(req.body.salon))
          .input("pat", sql.VarChar(10), sqlValue(req.body.pat))
    );
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* delete – manual cascade chain */
router.delete("/patients/:id", async (req, res) => {
  const id = +req.params.id;

  try {
    /* 1 ▸ delete comenzi_robot rows (depend on prescription) */
    await query(
      `DELETE cr
         FROM dbo.comenzi_robot cr
         JOIN dbo.prescriptii p ON p.ID_prescriptie = cr.ID_prescriptie
        WHERE p.ID_pacient = @id`,
      (r) => r.input("id", sql.Int, id)
    );

    /* 2 ▸ delete prescriptii_medicamente */
    await query(
      `DELETE pm
         FROM dbo.prescriptii_medicamente pm
         JOIN dbo.prescriptii p ON p.ID_prescriptie = pm.ID_prescriptie
        WHERE p.ID_pacient = @id`,
      (r) => r.input("id", sql.Int, id)
    );

    /* 3 ▸ delete prescriptii */
    await query(
      `DELETE FROM dbo.prescriptii WHERE ID_pacient = @id`,
      (r) => r.input("id", sql.Int, id)
    );

    /* 4 ▸ delete patient */
    await query(
      `DELETE FROM dbo.pacienti WHERE ID_pacient = @id`,
      (r) => r.input("id", sql.Int, id)
    );

    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* ─────────────── MEDICAMENTE ─────────────── */

/* all medications - matches your React component's API call */
router.get("/medicamente", async (_req, res) => {
  try {
    const rows = await query(`
      SELECT ID_medicament, denumire, descriere, RFID, stoc_curent
        FROM dbo.medicamente
       ORDER BY denumire`);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* alternative endpoint with English name */
router.get("/medications", async (_req, res) => {
  try {
    const rows = await query(`
      SELECT ID_medicament, denumire, descriere, RFID, stoc_curent
        FROM dbo.medicamente
       ORDER BY denumire`);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* one medication */
router.get("/medications/:id", async (req, res) => {
  const id = +req.params.id;
  try {
    const rows = await query(
      `SELECT ID_medicament, denumire, descriere, RFID, stoc_curent
         FROM dbo.medicamente
        WHERE ID_medicament = @id`,
      (r) => r.input("id", sql.Int, id)
    );
    if (!rows.length) return res.status(404).send("Not found");
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* create medication */
router.post("/medications", async (req, res) => {
  const { denumire, stoc_curent } = req.body;
  if (!denumire || stoc_curent === undefined)
    return res.status(400).send("denumire și stoc_curent sunt obligatorii");

  try {
    await query(
      `INSERT INTO dbo.medicamente
         (denumire, descriere, RFID, stoc_curent)
       VALUES
         (@denumire, @descriere, @RFID, @stoc_curent)`,
      (r) =>
        r
          .input("denumire", sql.VarChar(255), denumire)
          .input("descriere", sql.VarChar(500), sqlValue(req.body.descriere))
          .input("RFID", sql.VarChar(50), sqlValue(req.body.RFID))
          .input("stoc_curent", sql.Int, +stoc_curent)
    );
    res.status(201).send("Inserted");
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* update medication */
router.put("/medications/:id", async (req, res) => {
  const id = +req.params.id;
  const { denumire, stoc_curent } = req.body;
  if (!denumire || stoc_curent === undefined)
    return res.status(400).send("denumire și stoc_curent sunt obligatorii");

  try {
    await query(
      `UPDATE dbo.medicamente
          SET denumire    = @denumire,
              descriere   = @descriere,
              RFID        = @RFID,
              stoc_curent = @stoc_curent
        WHERE ID_medicament = @id`,
      (r) =>
        r
          .input("id", sql.Int, id)
          .input("denumire", sql.VarChar(255), denumire)
          .input("descriere", sql.VarChar(500), sqlValue(req.body.descriere))
          .input("RFID", sql.VarChar(50), sqlValue(req.body.RFID))
          .input("stoc_curent", sql.Int, +stoc_curent)
    );
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* delete medication – with cascade check */
router.delete("/medications/:id", async (req, res) => {
  const id = +req.params.id;

  try {
    /* Check if medication is used in any prescriptions */
    const prescriptionCheck = await query(
      `SELECT COUNT(*) as count
         FROM dbo.prescriptii_medicamente
        WHERE ID_medicament = @id`,
      (r) => r.input("id", sql.Int, id)
    );

    if (prescriptionCheck[0].count > 0) {
      return res.status(400).send("Nu se poate șterge medicamentul - este folosit în prescripții");
    }

    /* Delete medication */
    await query(
      `DELETE FROM dbo.medicamente WHERE ID_medicament = @id`,
      (r) => r.input("id", sql.Int, id)
    );

    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* ─────────────── PRESCRIPȚII (read-only) ─────────────── */

router.get("/patients/:id/prescriptions", async (req, res) => {
  const id = +req.params.id;
  try {
    const rows = await query(
      `SELECT p.ID_prescriptie          AS prescriptionId,
              p.data_prescriptiei       AS issuedAt,
              u.nume + ' ' + u.prenume  AS doctor,
              m.ID_medicament           AS medId,
              m.denumire                AS medName,
              pm.doza,
              pm.frecventa
         FROM dbo.prescriptii             p
         JOIN dbo.utilizatori             u  ON u.ID_utilizator   = p.ID_medic
         JOIN dbo.prescriptii_medicamente pm ON pm.ID_prescriptie = p.ID_prescriptie
         JOIN dbo.medicamente             m  ON m.ID_medicament   = pm.ID_medicament
        WHERE p.ID_pacient = @id
        ORDER BY p.data_prescriptiei DESC`,
      (r) => r.input("id", sql.Int, id)
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* ─────────────── UTILIZATORI & LOGIN (unchanged) ─────────────── */

router.get("/utilizatori", async (_req, res) => {
  try {
    const rows = await query(`
      SELECT ID_utilizator AS id, nume, prenume, rol,
             username, email, parola, status
        FROM dbo.utilizatori`);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

router.get("/utilizatori/:id", async (req, res) => {
  const id = +req.params.id;
  try {
    const rows = await query(
      `SELECT ID_utilizator AS id, nume, prenume, rol,
              username, email, parola, status
         FROM dbo.utilizatori
        WHERE ID_utilizator = @id`,
      (r) => r.input("id", sql.Int, id)
    );
    if (!rows.length) return res.status(404).send("Not found");
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

router.post("/login", async (req, res) => {
  const { email: userRaw, password } = req.body;
  if (!userRaw || !password) return res.status(400).send("Missing fields");

  try {
    const rows = await query(
      `SELECT ID_utilizator AS id,
              LOWER(email) AS email,
              nume, prenume, rol
         FROM dbo.utilizatori
        WHERE (LOWER(email)=@u OR LOWER(username)=@u)
          AND  LTRIM(RTRIM(parola))=@p`,
      (r) =>
        r
          .input("u", sql.VarChar(255), userRaw.trim().toLowerCase())
          .input("p", sql.VarChar(255), password.trim())
    );
    if (!rows.length) return res.status(401).send("Invalid credentials");
    res.json({ user: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/**
 * Primită de robot când o comandă dă eroare.
 * Body JSON: { idComanda: 123, descriere?: "mesaj opţional" }
 */
router.post("/robot/error", async (req, res) => {
  // 1) Citim doar descrierea, nu mai căutăm idComanda
  const descriere = sqlValue(req.body.descriere);

  try {
    // 2) Inserăm în tabela 'alarme' cu ID_comanda = 1, indiferent ce trimite clientul
    await query(
      `
      INSERT INTO dbo.alarme
             (tip_alarma, descriere, data_ora, status, ID_comanda)
      VALUES
             ('EROARE_ROBOT', @descriere, SYSDATETIME(), 'noua', 1)
      `,
      (r) =>
        r
          .input(
            "descriere",
            sql.VarChar(255),
            descriere ?? "Eroare standard robot"
          )
    );

    return res.status(201).send("Alarmă înregistrată");
  } catch (e) {
    console.error(">>> [POST /robot/error] DB error:", e);
    return res.status(500).send("DB error");
  }
});

export default router;