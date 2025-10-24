import { useEffect, useState } from "react";
import './cadastro.css';

function Cadastro() {
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Mensagens de erro
    const [nomeError, setNomeError] = useState('');
    const [sobrenomeError, setSobrenomeError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

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
        if (password.length < 8) {
            return "A senha deve ter pelo menos 8 caracteres.";
        }
        if (!/[A-Z]/.test(password)) {
            return "A senha deve conter pelo menos 1 letra maiúscula.";
        }
        if (!/[0-9]/.test(password)) {
            return "A senha deve conter pelo menos 1 número.";
        }
        if (!/[!@#$%^&*]/.test(password)) {
            return "A senha deve conter pelo menos 1 caractere especial.";
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

    const handleSubmit = (e) => {
        e.preventDefault();

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

        console.log('Cadastro enviado!');
        console.log('Nome:', nome);
        console.log('Sobrenome:', sobrenome);
        console.log('Email:', email);
    };

    return (
        <div className="cadastro-container"> 
            <h1>Crie uma conta</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Nome" 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)} 
                />
                {nomeError && <span className="error-message">{nomeError}</span>}
                <input 
                    type="text" 
                    placeholder="Sobrenome"
                    value={sobrenome} 
                    onChange={(e) => setSobrenome(e.target.value)}
                />
                {sobrenomeError && <span className="error-message">{sobrenomeError}</span>}
                <input 
                    type="email" 
                    placeholder="E-mail" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                {emailError && <span className="error-message">{emailError}</span>}
                <input 
                    type="password" 
                    placeholder="Senha" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                {passwordError && <span className="error-message">{passwordError}</span>}
                <input 
                    type="password" 
                    placeholder="Confirmar Senha" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                {confirmPasswordError && <span className="error-message">{confirmPasswordError}</span>}

                <button type="submit">Criar conta</button>

            </form>
            <p> Já possui uma conta? <a href="/login">Fazer Login</a></p>
        </div>
    );
}

export default Cadastro;