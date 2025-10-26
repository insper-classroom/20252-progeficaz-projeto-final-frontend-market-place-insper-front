import { useEffect, useState } from "react";
import "./dashboard.css";
import { useParams } from "react-router-dom";

export default function Dashboard() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const base = "http://localhost:5000";
    fetch(`${base}/api/usuarios/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao conectar ao backend");
        return res.json();
      })
      .then((data) => setCliente(data))
      .catch((err) => setErro(err.message));
  }, [id]);

  if (erro) return <p>Erro: {erro}</p>;
  if (!cliente) return <p>Carregando Dados</p>;

// DASHBOARD = HEADER + NAV BAR + SIDE BAR + DASHBOARD + FOOTER
// VER COMO QUE AS INFORMAÇÕES SÃO PASSADAS DO BACK
  return (
    <div className="dashboard">
        <div className="btnregistrarproduto">
          <p>Registrar Produto</p>
        </div>
        <div className="subtitulo">
          <h2>Informações Pessoais</h2>
        </div>
        <div className="dados">
          {/* endereço, nome completo, idade, status, email */}
          <div className="dadocontainer">
            <div className="titulodado">
              <h3 className="titulo">Nome Completo</h3>
              <p>{cliente.nome}</p>
            </div>
          </div>

          <div className="dadocontainer">
            <div className="dado">
              <h3 className="titulo">Status</h3>
              <p>{cliente.status}</p>
            </div>
          </div>

          <div className="dadocontainer">
            <div className="dado">
              <h3 className="titulo">Endereço</h3>
              <p>{cliente.endereco}</p>
            </div>
          </div>

          <div className="dadocontainer">
            <div className="dado">
              <h3 className="titulo">E-mail</h3>
              <p>{cliente.email}</p>
            </div>
          </div>

          <div className="dadocontainer">
            <div className="dado">
              <h3 className="titulo">Idade</h3>
              <p>{cliente.idade}</p>
            </div>
          </div>
        </div>
    </div>

);
}