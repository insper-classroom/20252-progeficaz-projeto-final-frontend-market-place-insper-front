import type { Route } from "./+types/register"
import { useState, type FormEvent, useEffect } from "react"
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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Criar conta - Marketplace Insper" },
    { name: "description", content: "Crie sua conta no marketplace" },
  ]
}

function GUarda_C(email: string, codigo: number) {
  const key = `verify_code_${email}`;
  // guarde código como string para permitir chamadas .toUpperCase()
  const payload = JSON.stringify({ codigo: codigo.toString(), ts: Date.now() });
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

// salva/recupera dados pendentes de registro
function salvaPendingRegistration(email: string, payload: { name: string; email: string; cellphone: string; password: string }) {
  const key = `pending_reg_${email}`;
  localStorage.setItem(key, JSON.stringify(payload));
}
function pegaPendingRegistration(email: string) {
  const key = `pending_reg_${email}`;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { name: string; email: string; cellphone: string; password: string };
  } catch {
    return null;
  }
}
function removePendingRegistration(email: string) {
  const key = `pending_reg_${email}`;
  localStorage.removeItem(key);
}

//KEYS PARA EMAILJS
const EMAILJS_SERVICE_ID = "service_lwlq9xm";
const EMAILJS_TEMPLATE_ID = "template_p7j6t4z";
const EMAILJS_PUBLIC_KEY = "GgVEoZbKfGJV9HuCR";

//CODIGO PRINCIPAL: FAZ O ENVIO COM BASE NO EMAILJS
async function manda_email(name: string, email: string, codigo: number) {
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

  // estado para guardar dados pendentes (no caso de refresh queremos recarregá-los)
  const [pendingRegistration, setPendingRegistration] = useState<{
    name: string;
    email: string;
    cellphone: string;
    password: string;
  } | null>(null);

  // Se houver um pending no localStorage ao montar, carregue (permite refresh)
  useEffect(() => {
    if (verificacaoEnviada) {
      const pending = pegaPendingRegistration(verificacaoEnviada);
      if (pending) setPendingRegistration(pending);
    }
  }, [verificacaoEnviada]);

  //criacao da chave de seguranca
  function criaCodigo() {
    const cod = Math.floor(Math.random()*1000000);
    console.log(cod)
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

    // NÃO chamamos register aqui — apenas guardamos os dados pendentes
    const codigo_seguranca = criaCodigo();
    GUarda_C(email, codigo_seguranca); //verificar

    // salva dados pendentes (state + localStorage)
    const pending = { name, email, cellphone, password };
    setPendingRegistration(pending);
    salvaPendingRegistration(email, pending);

    try {
      await manda_email(name, email, codigo_seguranca);
      toast.success("Código de segurança enviado com sucesso! Verifique seu email.");
      setverificacaoEnviada(email);
    } catch (err) {
      console.error(err);
      toast.error("Falha ao enviar e-mail. Tente novamente.");
      // caso falhe no envio, limpe o pending
      setPendingRegistration(null);
      removePendingRegistration(email);
      localStorage.removeItem(`verify_code_${email}`);
    } finally {
      setIsLoading(false)
    }
  }

  //funcao para verificar codigo
  const verifica = async () => {
    if (!verificacaoEnviada) return;
    setcarrega_verificacao(true);

    const stored = pegarCodigoArmazenado(verificacaoEnviada);

    // comparação de verificacao
    if (stored && stored.toUpperCase() === codeInput.trim().toUpperCase()) {
      // recupera dados pendentes
      const pending = pendingRegistration || pegaPendingRegistration(verificacaoEnviada);
      if (!pending) {
        toast.error("Dados de registro não encontrados. Por favor refaça o cadastro.");
        setcarrega_verificacao(false);
        return;
      }

      setIsLoading(true);
      try {
        // chame register somente APÓS verificação
        const result = await register({
          name: pending.name,
          email: pending.email,
          cellphone: pending.cellphone,
          password: pending.password,
        });
        if (!result.success) {
          toast.error(result.error || "Erro ao criar conta");
          setIsLoading(false);
          setcarrega_verificacao(false);
          return;
        }

        // remove pending e marque verificado
        removePendingRegistration(verificacaoEnviada);
        marcarVerificado(verificacaoEnviada);
        localStorage.removeItem(`verify_code_${verificacaoEnviada}`);

        toast.success("E-mail verificado! Bem vindo(a).");
        navigate("/");
      } catch (err) {
        console.error(err);
        toast.error("Erro ao completar o registro. Tente novamente.");
      } finally {
        setIsLoading(false);
        setcarrega_verificacao(false);
      }
    } else {
      toast.error("Código incorreto.");
      setcarrega_verificacao(false);
    }
  };

  // fim de qualquer acao password

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
          <CardAction>
            <Link to="/login">
              <Button variant="link">Já tenho conta</Button>
            </Link>
          </CardAction>
        </CardHeader>

        <CardContent>
          {/* Formulário de registro */} 
          {/* Se já enviou verificação, o formulário fica disponível para reenvio/edição se o usuário voltar */}
          <form onSubmit={handleSubmit} id="register-form">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="João Silva"
                  required
                  disabled={isLoading || !!verificacaoEnviada}
                  defaultValue={pendingRegistration?.name ?? ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu.nome@insper.edu.br"
                  required
                  disabled={isLoading || !!verificacaoEnviada}
                  defaultValue={pendingRegistration?.email ?? ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cellphone">Telefone (com código do país)</Label>
                <Input
                  id="cellphone"
                  name="cellphone"
                  type="tel"
                  placeholder="+5511999999999"
                  required
                  disabled={isLoading || !!verificacaoEnviada}
                  defaultValue={pendingRegistration?.cellphone ?? ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading || !!verificacaoEnviada}
                  defaultValue={pendingRegistration?.password ?? ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  disabled={isLoading || !!verificacaoEnviada}
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
                  disabled={carrega_verificacao}
                />
              </div>
              <div>
                <Button
                  onClick={verifica}
                  disabled={carrega_verificacao || !codeInput || isLoading}
                  className="w-full"
                >
                  {carrega_verificacao ? "Verificando..." : "Verificar código"}
                </Button>
              </div>
              <div>
                <Button
                  variant="link"
                  onClick={() => {
                    // limpar pending e voltar ao formulário
                    if (verificacaoEnviada) {
                      removePendingRegistration(verificacaoEnviada);
                      localStorage.removeItem(`verify_code_${verificacaoEnviada}`);
                    }
                    setPendingRegistration(null);
                    setverificacaoEnviada(null);
                    setCodeInput("");
                    toast("Voltando ao formulário")
                  }}
                >
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          {!verificacaoEnviada && (
            <Button
              type="submit"
              form="register-form"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
