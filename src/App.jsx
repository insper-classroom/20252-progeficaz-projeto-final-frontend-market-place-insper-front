import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Homepage/home";
import Login from "./components/Login/login";
import Cadastro from "./components/Cadastro/cadastro";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
