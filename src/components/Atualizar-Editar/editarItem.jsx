import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./editarItem.css";

function EditarItem() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        condition: "Novo",
        image: null,
    });
    
    const [imagemAtual, setImagemAtual] = useState(""); 
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        const carregarItem = async () => {
            try {
                const base = import.meta.env.VITE_API_URL;
                const resposta = await fetch(`${base}/${id}`); 
                if (!resposta.ok) {
                    throw new Error("Erro ao carregar item");
                }
                const produto = await resposta.json();
                setFormData({
                    title: produto.title || "",
                    description: produto.description || "",
                    price: produto.price || "",
                    category: produto.category || "",
                    condition: produto.condition || "Novo",
                    image: null,
                });
                setImagemAtual(produto.images?.[0] || ""); 
            } catch (error) {
                setErro(error.message || "Erro ao carregar item");
            } finally {
                setCarregando(false);
            }
        };

        carregarItem(); 
    }, [id]); 

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");
        setErro("");

        try {
            const base = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");

            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("category", formData.category);
            data.append("condition", formData.condition);

            if (formData.image) {
                data.append("image", formData.image);
            }

            const resposta = await fetch(`${base}/item/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data,
            });

            if (!resposta.ok) {
                const errorData = await resposta.json();
                throw new Error(errorData.error || "Erro ao atualizar produto.");
            }

            setMensagem(`Produto "${formData.title}" atualizado com sucesso.`);
            
            setTimeout(() => {
                const userId = localStorage.getItem("user_id");
                navigate(`/user/${userId}/vendas`);
            }, 2000);

        } catch (error) {
            setErro(error.message || "Erro ao atualizar produto. Por favor, tente novamente.");
        }
    };

    if (carregando) return <p className="loading">Carregando dados do produto...</p>;
    if (erro && !formData.title) return <p className="loading">Erro: {erro}</p>;

    return (
        <div className="editar-container">
            <h1>Editar Produto</h1>
            <p>Atualize as informações do seu produto</p>

            {imagemAtual && !formData.image && (
                <div className="imagem-atual">
                    <p>Imagem atual:</p>
                    <img src={imagemAtual} alt="Produto atual" />
                </div>
            )}

            <form onSubmit={handleSubmit} className="editar-form">
                <label>
                    Título:
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Descrição:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Preço (R$):
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        required
                    />
                </label>

                <label>
                    Categoria:
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione</option>
                        <option value="Eletrônicos">Eletrônicos</option>
                        <option value="Eletrodomésticos">Eletrodomésticos</option>
                        <option value="Móveis">Móveis</option>
                        <option value="Outros">Outros</option>
                    </select>
                </label>

                <label>
                    Condição:
                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                    >
                        <option value="Novo">Novo</option>
                        <option value="Usado">Usado</option>
                    </select>
                </label>

                <label>
                    Trocar Foto (opcional):
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </label>

                <div className="botoes-form">
                    <button type="submit" className="btn-salvar">
                        Salvar Alterações
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)}
                        className="btn-cancelar"
                    >
                        Cancelar
                    </button>
                </div>
            </form>

            {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
            {erro && <p className="mensagem-erro">{erro}</p>}
        </div>
    );
}
export default EditarItem;