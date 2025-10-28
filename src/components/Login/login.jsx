import { useEffect, useState } from "react";
import authService from '../../services/authService';
import './login.css';
import { useNavigate } from 'react-router-dom';


function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setErro('');
        setCarregando(true);
        
        if (!email || !password) {
            setErro('Por favor, preencha os campos indicados');
            setCarregando(false);
            return;
        }
        try {

            const resposta = await authService.login(email, password);
            const id = resposta.user.id
            console.log('Login realizado com sucesso!', resposta);
            alert(`Bem-vindo ao Marketplace Insper, ${resposta.user.name}!`);
            console.log(id)
            navigate(`/user/${id}`);

        } catch (error) {
            setErro(error.error || 'Erro ao realizar login. Por favor, tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="login-container">
            <h1>Entrar no Marketplace Insper</h1>

            {erro && (
                <div className="error-message">
                    {erro}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={carregando}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={carregando}
                />
                <button type="submit" disabled={carregando}>
                    {carregando ? 'Entrando...' : 'Entrar'} 
                </button>
            </form>
            <p>Novo no MarketInsper? <a href="/register">Criar conta</a></p>
            
        </div>
    );
}
export default Login;