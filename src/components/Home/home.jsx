import { useEffect, useState } from "react";

export default function Home() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "";
    fetch(`${base}/api/home`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao conectar ao backend");
        return res.json();
      })
      .then((data) => setDados(data))
      .catch((err) => setErro(err.message));
  }, []);

  if (erro) return <p style={{ color: "red" }}>Erro: {erro}</p>;
  if (!dados) return <p>Carregando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{dados.titulo}</h1>
      <p>{dados.mensagem}</p>
    </div>
  );
}
