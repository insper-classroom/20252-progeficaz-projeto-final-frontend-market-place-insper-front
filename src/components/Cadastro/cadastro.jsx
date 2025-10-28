import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import authService from '../../services/authService';
import cepService from '../../services/cepService';
import './cadastro.css';

function Cadastro() {
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [carregando, setCarregando] = useState(false);

    // Telefone (novo)
    const [telefone, setTelefone] = useState('');
    const [telefoneError, setTelefoneError] = useState('');

    // Endereço
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');

    // Mensagens de erro
    const [nomeError, setNomeError] = useState('');
    const [sobrenomeError, setSobrenomeError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [cepError, setCepError] = useState('');
    const [erroGeral, setErroGeral] = useState('');
    const navigate = useNavigate();

    // Ref para debounce
    const cepDebounceRef = useRef(null);

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

    const validaTelefone = (telefone) => {
        const cleaned = telefone.replace(/\D/g, '');
        if (!cleaned) return 'O telefone é obrigatório.';
        if (cleaned.length < 10 || cleaned.length > 11) return 'Telefone inválido. Use 10 ou 11 dígitos (DDDNÚM).';
        return '';
    };

    // Validação simples do CEP: apenas dígitos e 8 caracteres
    const validaCepFormato = (cep) => {
        const cleaned = cep.replace(/\D/g, '');
        if (!cleaned) return "O CEP é obrigatório.";
        if (cleaned.length !== 8) return "CEP inválido. Deve ter 8 dígitos.";
        return '';
    };

    // Função que chama seu cepService
    const buscarCepNaApi = async (cepParaBuscar) => {
        setCepError('');
        try {
            const cleaned = String(cepParaBuscar).replace(/\D/g, '');
            if (!cleaned) {
                setCepError('CEP inválido.');
                return;
            }

            const dataOrResponse = await cepService.buscarCep(cleaned);
            const payload = dataOrResponse?.data ? dataOrResponse.data : dataOrResponse;

            if (!payload) {
                setCepError('Resposta inválida da API de CEP.');
                return;
            }
            if (payload.erro || payload.error || payload.message) {
                const mensagem = payload.erro || payload.error || payload.message;
                setCepError(mensagem);
                return;
            }

            const rua = payload.logradouro || payload.rua || payload.address || '';
            const bairroApi = payload.bairro || '';
            const cidadeApi = payload.localidade || payload.cidade || payload.city || '';
            const estadoApi = payload.uf || payload.estado || payload.state || '';

            if (!rua && !bairroApi && !cidadeApi && !estadoApi) {
                setCepError('CEP não retornou dados de endereço.');
                return;
            }

            setLogradouro(rua);
            setBairro(bairroApi);
            setCidade(cidadeApi);
            setEstado(estadoApi);
            setCep(payload.cep || cleaned);
        } catch (err) {
            const msg = err?.response?.data?.erro || err?.response?.data?.error || err?.message;
            setCepError(msg || 'Erro ao consultar o CEP. Tente novamente.');
            console.error('Erro buscarCepNaApi:', err);
        }
    };

    // Debounce: quando o usuário digita CEP, espera 600ms antes de consultar
    useEffect(() => {
        const cleaned = cep.replace(/\D/g, '');
        setCepError('');

        if (cepDebounceRef.current) {
            clearTimeout(cepDebounceRef.current);
        }

        if (cleaned.length === 8) {
            cepDebounceRef.current = setTimeout(() => {
                buscarCepNaApi(cleaned);
            }, 600);
        }

        return () => {
            if (cepDebounceRef.current) clearTimeout(cepDebounceRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cep]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErroGeral('');

        // Valida os campos 
        const nomeErr = validaNome(nome);
        const sobrenomeErr = validaNome(sobrenome);
        const emailErr = validaEmail(email);
        const passwordErr = validaSenha(password);
        const confirmPasswordErr = validaConfirmacaoSenha(password, confirmPassword);
        const telefoneErr = validaTelefone(telefone);
        const cepFormatErr = validaCepFormato(cep);

        setNomeError(nomeErr);
        setSobrenomeError(sobrenomeErr);
        setEmailError(emailErr);
        setPasswordError(passwordErr);
        setConfirmPasswordError(confirmPasswordErr);
        setTelefoneError(telefoneErr);
        setCepError(cepFormatErr);

        if (nomeErr || sobrenomeErr || emailErr || passwordErr || confirmPasswordErr || telefoneErr || cepFormatErr) {
            console.log('Formulário com erro!');
            return;
        }

        setCarregando(true);

        try {
            const nomeCompleto = `${nome} ${sobrenome}`;

            // limpa telefone (apenas dígitos) antes de enviar
            const telefoneClean = telefone.replace(/\D/g, '');

            // Monta objeto de cadastro incluindo endereço e telefone obrigatório
            const cadastroPayload = {
                name: nomeCompleto,
                email,
                password,
                phone: telefoneClean,
                endereco: {
                    cep: cep.replace(/\D/g, ''),
                    logradouro,
                    numero,
                    complemento,
                    bairro,
                    cidade,
                    estado
                }
            };

            // Envia o payload completo para a rota /register
            const resposta = await authService.register(cadastroPayload);

            console.log('Cadastro realizado com sucesso!', resposta);
            navigate('/login');
            alert(`Cadastro realizado com sucesso! Bem-vindo ao Marketplace Insper, ${resposta.user?.name || nomeCompleto}!`);
        } catch (error) {
            setErroGeral(error.error || error.message || 'Erro ao criar conta. Por favor, tente novamente.');
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

                {/* campo de telefone obrigatório */}
                <input
                    type="tel"
                    placeholder="Telefone (somente números)"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    disabled={carregando}
                />
                {telefoneError && <span className="error-message">{telefoneError}</span>}

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

                {/* Bloco de endereço */}
                <input
                    type="text"
                    placeholder="CEP (somente números)"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    disabled={carregando}
                />
                {cepError && <span className="error-message">{cepError}</span>}

                <input
                    type="text"
                    placeholder="Logradouro (Rua)"
                    value={logradouro}
                    onChange={(e) => setLogradouro(e.target.value)}
                    disabled={carregando}
                />

                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="Número"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        disabled={carregando}
                        style={{ flex: '0 0 120px' }}
                    />
                    <input
                        type="text"
                        placeholder="Complemento"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                        disabled={carregando}
                        style={{ flex: '1' }}
                    />
                </div>

                <input
                    type="text"
                    placeholder="Bairro"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    disabled={carregando}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="Cidade"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        disabled={carregando}
                        style={{ flex: '1' }}
                    />
                    <input
                        type="text"
                        placeholder="Estado (UF)"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        disabled={carregando}
                        style={{ width: '90px' }}
                    />
                </div>

                <button type="submit" disabled={carregando}>
                    {carregando ? 'Realizando cadastro...' : 'Criar Conta'}
                </button>

            </form>
            <p> Já possui uma conta? <a href="/login">Fazer Login</a></p>
        </div>
    );
}

export default Cadastro;
