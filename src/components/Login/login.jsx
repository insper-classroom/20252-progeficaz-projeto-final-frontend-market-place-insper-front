import { useEffect, useState } from "react";
import './login.css';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', email);
    };

    return (
        <div className="login-container">
            <h1>Entrar no Marketplace Insper</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Entrar</button>
            </form>
            <p>Novo no MarketInsper? <a href="/cadastro">Criar conta</a></p>
        </div>
    );
}
export default Login;