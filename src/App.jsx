import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from "./components/Navbar/Navbar"

import Footer from './components/Footer/footer'
import Home from "./components/Home/home";
import axios from "axios"; // Para receber os dados da API
// TODO: Importar componentes


// Única função do sistema
function App() {

  const [produtosEmDestaque, setProdutosEmDestaque] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then((res) => {
        setProdutosEmDestaque(res.data.produtos);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
      });
  }, []);

  return (
    <>
     <Navbar />
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Footer />

      <hr />

      <div className="api-section">
        <h2>Teste de conexão com o backend (ping)</h2>
        <pre>
          {apiResposta
            ? JSON.stringify(apiResposta, null, 2)
            : "carregando..."}
        </pre>
        <p>API base usada: {import.meta.env.VITE_API_URL}</p>
      </div>

      <hr />

      <Home />
    </>
  );
}

export default App;

//   // const [count, setCount] = useState(0);
//   // const [apiResposta, setApiResposta] = useState(null);

//   // useEffect(() => {
//   //   const base = import.meta.env.VITE_API_URL || "";
//   //   fetch(`${base}/api/ping`)
//   //     .then((res) => res.json())
//   //     .then((data) => setApiResposta(data))
//   //     .catch((err) => setApiResposta({ erro: err.message }));
//   // }, []);

//   return (
//     <>
//       {/* <div>
//         <a href="https://vite.dev" target="_blank" rel="noreferrer">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank" rel="noreferrer">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>

//       <h1>Vite + React</h1>

//       <div className="card">
//         <button onClick={() => setCount((c) => c + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>

//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>

//       <hr />

//       <div className="api-section">
//         <h2>Teste de conexão com o backend (ping)</h2>
//         <pre>
//           {apiResposta
//             ? JSON.stringify(apiResposta, null, 2)
//             : "carregando..."}
//         </pre>
//         <p>API base usada: {import.meta.env.VITE_API_URL}</p>
//       </div>

//       <hr /> */}

//       <Home />
//     </>
//   );
// }

// export default App;
