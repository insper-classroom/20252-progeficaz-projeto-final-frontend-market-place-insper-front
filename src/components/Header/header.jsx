import { useEffect, useState } from "react";
import "./header.css";

export default function Header() {
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

  return (
    <div className="header">
        <div className="fotoperfil">
          <img src={pessoa.img} alt="public/pessoacinza.png"/>
        </div>
        <div className="textoheader">
            <h1>Olá {pessoa.nome}!</h1>
            <p>{pessoa.status} Insper</p>
        </div>
    </div>
);
}