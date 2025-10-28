import { useEffect, useState } from "react";
import "./dashboard.css";
import { useParams } from "react-router-dom";

export default function Dashboard() {
  const { user_id } = useParams();
  const [user, setUser] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL;
    fetch(`${base}/user${user_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao conectar ao backend");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => setErro(err.message));
  }, [user_id]);

  if (erro) return <p>Erro: {erro}</p>;
  if (!user) return <p>Carregando Dados</p>;

// DASHBOARD = HEADER + NAV BAR + SIDE BAR + DASHBOARD + FOOTER
  return (
    <div className="dashboard">
        <div className="btnregistrarproduto">
          <p>Registrar Produto</p>
        </div>
        <div className="subtitulo">
          <h2>Informações Pessoais</h2>
        </div>
        <div className="dados">
          {/* endereço, nome completo, telefone, status, email */}
          <div className="dadocontainer">
            <div className="titulodado">
              <h3 className="titulo">Nome Completo</h3>
              <p>{user.name}</p>
            </div>
          </div>

          <div className="dadocontainer">
            <div className="dado">
              <h3 className="titulo">Status</h3>
              <p>{user.status}</p>
            </div>
          </div>

          <div className="dadocontainer">
            <div className="dado">
              <h3 className="titulo">Endereço</h3>
              <p>{user.address}</p>
            </div>
          </div>

          <div className="dadocontainer">
            <div className="dado">
              <h3 className="titulo">E-mail</h3>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="dadocontainer">
            <div className="dado">
              <h3 className="titulo">Telefone</h3>
              <p>{user.phone}</p>
            </div>
          </div>
        </div>
    </div>

);
}