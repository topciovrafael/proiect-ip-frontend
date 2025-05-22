import { Router } from "express";
import sql from "mssql";
import { query } from "./db.js";

const router = Router();

/* ───────────── pacienti ──────────────────────────────────────────────── */
// GET /patients  → all rows
router.get("/patients", async (_req, res) => {
  try {
    const rows = await query(
      `SELECT ID_pacient AS id,
              nume,
              prenume,
              CNP,
              adresa,
              telefon,
              salon,
              pat
         FROM dbo.pacienti`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

// GET /patients/:id → single patient
router.get("/patients/:id", async (req, res) => {
  const id = +req.params.id;
  try {
    const rows = await query(
      `SELECT ID_pacient AS id,
              nume,
              prenume,
              CNP,
              adresa,
              telefon,
              salon,
              pat
         FROM dbo.pacienti
        WHERE ID_pacient = @id`,
      r => r.input("id", sql.Int, id)
    );
    if (!rows.length) return res.status(404).send("Not found");
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* ───────────── prescriptii ───────────────────────────────────────────── */
// GET /patients/:id/prescriptions → patient’s prescriptions + meds
router.get("/patients/:id/prescriptions", async (req, res) => {
  const id = +req.params.id;
  try {
    const rows = await query(
      `SELECT  p.ID_prescriptie          AS prescriptionId,
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
      r => r.input("id", sql.Int, id)
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* ───────────── utilizatori ───────────────────────────────────────────── */
// GET /utilizatori → all users
router.get("/utilizatori", async (_req, res) => {
  try {
    const rows = await query(
      `SELECT  ID_utilizator AS id,
              nume,
              prenume,
              rol,
              username,
              email,
              parola,
              status
         FROM dbo.utilizatori`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

// GET /utilizatori/:id → single user
router.get("/utilizatori/:id", async (req, res) => {
  const id = +req.params.id;
  try {
    const rows = await query(
      `SELECT  ID_utilizator AS id,
              nume,
              prenume,
              rol,
              username,
              parola,
              email,
              status
         FROM dbo.utilizatori
        WHERE ID_utilizator = @id`,
      r => r.input("id", sql.Int, id)
    );
    if (!rows.length) return res.status(404).send("Not found");
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).send("DB error");
  }
});

/* ───────────── auth (login) ──────────────────────────────────────────── */
// POST /login  { email | username, password }
router.post("/login", async (req, res) => {
  let { email: userInput, password } = req.body;
  if (!userInput || !password) return res.status(400).send("Missing fields");

  userInput = userInput.trim().toLowerCase();
  password  = password.trim();

  try {
    const rows = await query(
      `SELECT  ID_utilizator AS id,
              LOWER(email)   AS email,
              nume,
              prenume,
              rol
         FROM dbo.utilizatori
        WHERE (LOWER(email)    = @user OR LOWER(username) = @user)
          AND  LTRIM(RTRIM(parola)) = @pwd`,
      r => r
        .input("user", sql.VarChar(255), userInput)
        .input("pwd",  sql.VarChar(255), password)
    );

    if (!rows.length) return res.status(401).send("Invalid credentials");
    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});

export default router;
