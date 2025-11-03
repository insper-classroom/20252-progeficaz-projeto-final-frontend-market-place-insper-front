import type { Route } from "./+types/register"
import { useState, type FormEvent } from "react"
import { useAuth } from "~/contexts/auth.context"
import { useNavigate, Link } from "react-router"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

import * as emailjs from "@emailjs/browser"

import "../auth/register.css"


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Criar conta - Marketplace Insper" },
    { name: "description", content: "Crie sua conta no marketplace" },
  ]
}

function GUarda_C(email: string, codigo: number) {
  const key = `verify_code_${email}`;
  const payload = JSON.stringify({ codigo, ts: Date.now() });
  localStorage.setItem(key, payload);
}

function pegarCodigoArmazenado(email: string) {
  const key = `verify_code_${email}`;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw) as { codigo: string; ts: number };
    const EXP_MS = 15 * 60 * 1000; // checa prazo de 15 min
    if (Date.now() - obj.ts > EXP_MS) { localStorage.removeItem(key); return null; } //se nn esquece
    return obj.codigo;
  } catch {
    return null;
  }
}

function marcarVerificado(email: string) {
  const key = `verified_${email}`;
  localStorage.setItem(key, "true");
}
//KEYS PARA EMAILJS
const EMAILJS_SERVICE_ID = "service_lwlq9xm"; 
const EMAILJS_TEMPLATE_ID = "template_p7j6t4z"; 
const EMAILJS_PUBLIC_KEY = "GgVEoZbKfGJV9HuCR"; 

//CODIGO PRINCIPAL: FAZ O ENVIO COM BASE NO EMAILJS
async function manda_email(name: string, email: string, codigo: number) {
  console.log('funcionou <<<')
  try {
    if ((emailjs as any).init) (emailjs as any).init(EMAILJS_PUBLIC_KEY);
  } catch (e) {}
  const templateParams = {
    to_name: name,
    to_email: email,
    code: codigo,
    verify_link: window.location.origin,
  };
  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
}


export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  //stados da verificação do codigo
  const [verificacaoEnviada, setverificacaoEnviada] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [carrega_verificacao, setcarrega_verificacao] = useState(false);

  // Estado para armazenar os dados do registro temporariamente
  const [registrationData, setRegistrationData] = useState<{
    name: string;
    email: string;
    cellphone: string;
    password: string;
  } | null>(null);

  //criacao da chave de seguranca
  function criaCodigo() {
    const cod = Math.floor(Math.random()*1000000);
    return cod; 
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const cellphone = formData.get("cellphone") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    // Armazenar os dados temporariamente sem registrar no banco ainda
    setRegistrationData({ name, email, cellphone, password });

    const codigo_seguranca = criaCodigo();
    GUarda_C(email, codigo_seguranca); //verificar
    try {
      await manda_email(name, email, codigo_seguranca);
      toast.success("Código de segurança enviado com sucesso! Verifique seu email.");
      setverificacaoEnviada(email);
    } finally {
      setIsLoading(false)
    }
  }
  //funcao para verificar codigo
  const verifica = async () => {
    if (!verificacaoEnviada || !registrationData) return;
    setcarrega_verificacao(true);

    const stored = pegarCodigoArmazenado(verificacaoEnviada);

    // comparação de verificacao
    if (stored && stored.toUpperCase() === codeInput.trim().toUpperCase()) {
      // Agora registrar no banco de dados após verificação
      const result = await register(registrationData);

      if (!result.success) {
        toast.error(result.error || "Erro ao criar conta");
        setcarrega_verificacao(false);
        return;
      }

      marcarVerificado(verificacaoEnviada);
      toast.success("E-mail verificado! Conta criada com sucesso. Bem vindo(a).");
      navigate("/");
    } else {
      toast.error("Código incorreto.");
    }

    setcarrega_verificacao(false);
  };


  // fim de qualquer acao password

  return (
    <div className="register-container">
      <Card className="register-card">
        <CardHeader className="register-header">
          <CardTitle className="register-title">Criar conta</CardTitle>
          <CardDescription className="register-description">
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
          <CardAction className="register-action">
            <Link to="/login">
              <Button variant="link" className="register-link">Já tenho conta</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="register-content">
          <form onSubmit={handleSubmit} id="register-form">
            <div className="flex flex-col gap-6">
              <div className="register-field">
                <Label htmlFor="name" className="register-label">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="João Silva"
                  required
                  disabled={isLoading}
                  className="register-input"
                />
              </div>
              <div className="register-field">
                <Label htmlFor="email" className="register-label">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu.nome@insper.edu.br"
                  required
                  disabled={isLoading}
                  className="register-input"
                />
              </div>
              <div className="register-field">
                <Label htmlFor="cellphone" className="register-label">Telefone (com código do país)</Label>
                <Input
                  id="cellphone"
                  name="cellphone"
                  type="tel"
                  placeholder="+5511999999999"
                  required
                  disabled={isLoading}
                  className="register-input"
                />
              </div>
              <div className="register-field">
                <Label htmlFor="password" className="register-label">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                  className="register-input"
                />
              </div>
              <div className="register-field">
                <Label htmlFor="confirmPassword" className="register-label">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  disabled={isLoading}
                  className="register-input"
                />
              </div>
            </div>
          </form>

          {/* Área de verificação do código */}
          {verificacaoEnviada && (
            <div className="flex flex-col gap-4 mt-6">
              <p>
                Enviamos um código para <strong>{verificacaoEnviada}</strong>. Insira-o abaixo para continuar.
              </p>
              <div className="grid gap-2">
                <Label htmlFor="code">Código de verificação</Label>
                <Input
                  id="code"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Ex: 3F4A1B"
                />
              </div>
              <div>
                <Button
                  onClick={verifica}
                  disabled={carrega_verificacao || !codeInput}
                  className="w-full"
                >
                  {carrega_verificacao ? "Verificando..." : "Verificar código"}
                </Button>
              </div>
              <div>
                <Button
                  variant="link"
                  onClick={() => {
                    setverificacaoEnviada(null)
                    setRegistrationData(null)
                    toast("Voltando ao formulário")
                  }}
                >
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="register-footer">
          <Button
            type="submit"
            form="register-form"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )}