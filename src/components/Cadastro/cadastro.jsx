import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './cadastro.css';

function Cadastro() {
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [carregando, setCarregando] = useState(false);

    // Mensagens de erro
    const [nomeError, setNomeError] = useState('');
    const [sobrenomeError, setSobrenomeError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [erroGeral, setErroGeral] = useState('');
    const navigate = useNavigate();

    const validaNome = (nome) => {
        if (!nome) {
            return "O nome é obrigatório.";
        }
        if (nome.length < 2) {
            return "Nome inválido. O nome deve ter pelo menos 2 caracteres.";
        }
        return '';
    };

    const validaEmail = (email) => {
        if (!email) {
            return "O e-mail é obrigatório.";
        }
        if (!email.endsWith("@insper.edu.br") && !email.endsWith("@al.insper.edu.br")) {
            return "E-mail inválido. Utilize seu e-mail institucional Insper.";
        }
        return '';  
    }

    const validaSenha = (password) => {
        if (!password) {
            return "A senha é obrigatória.";
        }
        if (password.length < 6) {
            return "A senha deve ter pelo menos 6 caracteres.";
        }
        return '';

    };

    const validaConfirmacaoSenha = (password, confirmPassword) => {
        if (!confirmPassword) {
            return "Confirme sua senha";
        }
        if (password !== confirmPassword) {
            return "As senhas não coincidem.";
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErroGeral('');

        // Valida os campos 
        const nomeErr = validaNome(nome);
        const sobrenomeErr = validaNome(sobrenome);
        const emailErr = validaEmail(email);
        const passwordErr = validaSenha(password);
        const confirmPasswordErr = validaConfirmacaoSenha(password, confirmPassword);

        setNomeError(nomeErr);
        setSobrenomeError(sobrenomeErr);
        setEmailError(emailErr);
        setPasswordError(passwordErr);
        setConfirmPasswordError(confirmPasswordErr);

        if (nomeErr || sobrenomeErr || emailErr || passwordErr || confirmPasswordErr) {
            console.log('Formulário com erro!');
            return;
        }

        setCarregando(true);

        try {
            const nomeCompleto = `${nome} ${sobrenome}`;
            const resposta = await authService.register(nomeCompleto, email, password);
            console.log('Cadastro realizado com sucesso!', resposta);
            alert(`Cadastro realizado com sucesso! Bem-vindo ao Marketplace Insper, ${resposta.user.name}!`);
            navigate('/');

        } catch (error) {
            setErroGeral(error.error || 'Erro ao criar conta. Por favor, tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="cadastro-container"> 
            <h1>Crie uma conta</h1>

            {erroGeral && (
                <div className="error-message">
                    {erroGeral}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Nome" 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)} 
                    disabled={carregando}
                />
                {nomeError && <span className="error-message">{nomeError}</span>}
                <input 
                    type="text" 
                    placeholder="Sobrenome"
                    value={sobrenome} 
                    onChange={(e) => setSobrenome(e.target.value)}
                    disabled={carregando}
                />
                {sobrenomeError && <span className="error-message">{sobrenomeError}</span>}
                <input 
                    type="email" 
                    placeholder="E-mail" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    disabled={carregando}
                />
                {emailError && <span className="error-message">{emailError}</span>}
                <input 
                    type="password" 
                    placeholder="Senha" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    disabled={carregando}
                />
                {passwordError && <span className="error-message">{passwordError}</span>}
                <input 
                    type="password" 
                    placeholder="Confirmar Senha" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    disabled={carregando}
                />
                {confirmPasswordError && <span className="error-message">{confirmPasswordError}</span>}

                <button type="submit" disabled={carregando}>
                    {carregando ? 'Realizando cadastro...' : 'Criar Conta'}
                </button>

            </form>
            <p> Já possui uma conta? <a href="/login">Fazer Login</a></p>
        </div>
    );
}

export default Cadastro;