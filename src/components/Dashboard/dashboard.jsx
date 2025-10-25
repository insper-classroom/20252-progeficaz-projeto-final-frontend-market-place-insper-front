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
    <div className="dashboard">
        <div className="btnregistrarproduto">
          <p>Registrar Produto</p>
        </div>
        <div className="subtitulo">
          <h2>Informações Pessoais</h2>
        </div>
        <div className="dados">
          {/* endereço, nome completo, idade, status, email */}
          <div class="dados">
          <div class="dadocontainer">
            <div class="titulodado">
              <h3 class="titulo">Nome Completo</h3>
              <p>{cliente.nome}</p>
            </div>
          </div>

          <div class="dadocontainer">
            <div class="dado">
              <h3 class="titulo">Status</h3>
              <p>{cliente.status}</p>
            </div>
          </div>

          <div class="dadocontainer">
            <div class="dado">
              <h3 class="titulo">Endereço</h3>
              <p>{cliente.email}</p>
            </div>
          </div>

          <div class="dadocontainer">
            <div class="dado">
              <h3 class="titulo">E-mail</h3>
              <p>{cliente.email}</p>
            </div>
          </div>

          <div class="dadocontainer">
            <div class="dado">
              <h3 class="titulo">Idade</h3>
              <p>{cliente.idade}</p>
            </div>
          </div>
        </div>
        </div>
    </div>

);
}