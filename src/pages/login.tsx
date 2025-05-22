import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../App";

interface Props {
  onLogin: (u: User) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post("/api/login", { email, password });
      onLogin(data.user);
      navigate("/");
    } catch (err) {
      console.error(err); // <-- now it's “used”
      setError("Email/utilizator sau parolă incorecte");
    }
  };

  return (
    <main className="login">
      <h1>Autentificare</h1>
      <form onSubmit={submit} className="login__form">
        <label>
          Email sau utilizator
          <input
            type="text"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Parolă
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPass(e.target.value)}
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit">Conectare</button>
      </form>
    </main>
  );
};

export default LoginPage;
