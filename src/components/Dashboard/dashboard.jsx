import { useEffect, useState } from "react";
import "./dashboard.css";

export default function Dashboard() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "";
    fetch(`${base}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao conectar ao backend");
        return res.json();
      })
      .then((data) => setDados(data))
      .catch((err) => setErro(err.message));
  }, []);

  if (erro) return <p>Erro: {erro}</p>;
  if (!dados) return <p>Carregando Dados</p>;

// DASHBOARD = HEADER + NAV BAR + SIDE BAR + DASHBOARD + FOOTER
  return (
    <div className="tudo">
        
    </div>

);
}