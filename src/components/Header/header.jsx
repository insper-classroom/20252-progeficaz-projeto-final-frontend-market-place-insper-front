import { useEffect, useState } from "react";
import "./header.css";
import { useParams } from "react-router-dom";

export default function Header() {
  const { id } = useParams();

  const [cliente, setCliente] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const base = "http://localhost:5000";
    // AJEITAR URL
    fetch(`${base}/api/usuario/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao conectar ao backend");
        return res.json();
      })
      .then((data) => setCliente(data))
      .catch((err) => setErro(err.message));
  }, [id]);

  if (erro) return <p>Erro: {erro}</p>;
  if (!cliente) return <p>Carregando Dados</p>;

  return (
    <div className="header">
        <div className="fotoperfil">
          <img src={cliente.img  || "/pessoacinza.png"} />
        </div>
        <div className="textoheader">
            <h1>Olá {cliente.nome}!</h1>
            <p>{cliente.status} Insper</p>
        </div>
    </div>
);
}