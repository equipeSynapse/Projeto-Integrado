import { useEffect, useState } from "react";
import { LogOut, Pencil, Settings, TableConfig, User } from "lucide-react";
import Header from "../../components/Header";
import isUserLoggedIn from "../../utils/auth";
import { EditProfileForm } from "../../components/EditProfileForm";
import ApagarContaForm from "../../components/ApagarContaForm";
import { getPublicacoes } from "../../services/publicacoes";
import { PubliCard } from "../../components/publicacoes/PubliCard";
import { useNavigate } from "react-router-dom";

export default function PerfilPage() {
    const navigate = useNavigate();

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isApagarContaOpen, setIsApagarContaOpen] = useState(false);

    const [publicacoes, setPublicacoes] = useState([]);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    useEffect(() => {
        const fetchPublicacoes = async () => {
            try {
                const data = await getPublicacoes();
                setPublicacoes(data);
            } catch (error) {
                console.error("Erro ao buscar publicações:", error);
            }
        };
        fetchPublicacoes();
    }, []);

    const filtradas = publicacoes.filter(
        (p) =>
            p.nome_usuario === isUserLoggedIn().usuario
    )


    return (
        <div className="min-h-screen bg-white">
            <Header className="fixed z-2">
                <div className="flex items-center gap-6 w-full">
                    <div> Logo </div>
                </div>


                <div className="flex justify-between gap-12">
                    <div className="flex gap-6">
                        <div> Início </div>
                        <div> Notificações </div>
                    </div>
                    <div className="relative">
                        <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex justify-center items-center bg-[#22D3EE] size-[50px] rounded-[50px]">
                            <span className="text-[20px] font-medium text-[#073061]"> {isUserLoggedIn().usuario[0].toUpperCase()} </span>
                        </button>
                        {isUserMenuOpen &&
                            <div className="absolute flex flex-col items-start top-[80px] right-0 bg-white w-[230px] rounded-[8px] shadow-lg shadow-black/20">
                                <button
                                    onClick={() => navigate("/perfil")}
                                    className="p-[16px] w-full text-left flex items-center gap-[12px] hover:bg-[rgba(60,64,67,0.06)]"
                                >
                                    <User className="stroke-[#909090] size-[16px]" />
                                    <span className="text-[#909090]"> Minha Conta </span> </button>

                                <div className="w-full flex justify-center"> <hr className="border border-[#e5e5e5] w-[84%]" /> </div>

                                <button
                                    onClick={() => { localStorage.removeItem("token"), window.location.reload() }}
                                    className="p-[16px] w-full text-left flex items-center gap-[12px] hover:bg-[rgba(60,64,67,0.06)]"
                                >
                                    <LogOut className="stroke-[#ea4335] size-[16px]" />
                                    <span className="text-[#ea4335]"> Sair </span>
                                </button>
                            </div>}
                    </div>
                </div>

            </Header>

            <main className="relative flex justify-center gap-[48px] px-[60px] py-[130px] mx-auto font-poppins">
                <section className="w-[778px] flex flex-col gap-[32px]">
                    <section className="overflow-hidden rounded-[10px] border border-[#e5e5e5]">
                        <div className="bg-[#bababa] h-[260px] w-full" />
                        <div className="px-[40px]">
                            <div className="flex w-full justify-between">
                                <div className="relative flex justify-center items-center top-[-100px] bg-[#22D3EE] size-[190px] rounded-[50%]">
                                    <span className="text-[90px] font-medium text-[#073061]"> {isUserLoggedIn().usuario[0].toUpperCase()}</span>
                                </div>
                                <button onClick={() => setIsEditProfileOpen(true)} className="relative top-[-50px]">
                                    <Settings className="size-[24px] stroke-[#3c4043]" />
                                </button>
                            </div>
                            <div className="relative top-[-60px] flex flex-col gap-[12px]">
                                <span className="text-[20px] font-bold"> {isUserLoggedIn().usuario} </span>
                                <p className="text-[16px] text-[#434343]"> Exemplo de Bio </p>
                            </div>
                        </div>
                    </section>

                    <section className="max-w-[778px] flex flex-col gap-[24px]">
                        <h2 className="text-[20px] font-semibold font-poppins"> Minhas Publicações </h2>
                        <section className="flex flex-col">
                            {filtradas.map((p) => (
                                <PubliCard
                                    key={p.id}
                                    id={p.id}
                                    criadoEm={p.criado_em}
                                    categoria={p.categoria}
                                    imagem={p.imagem ?? null}
                                    titulo={p.titulo ?? "Sem Título"}
                                    descricao={p.descricao ?? "Sem descrição"}
                                    link={p.link}
                                    autor={p.nome_usuario}
                                    email={p.email}
                                    anexo={p.anexo}
                                    qtdVisualizacoes={p.qtd_visualizacoes}
                                    expiracao={p.expiracao}

                                    onClickExcluir={() => console.log()}
                                />
                            ))}
                        </section>
                    </section>
                </section>
            </main>

            {
                isEditProfileOpen && <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                    <EditProfileForm
                        onClickX={() => setIsEditProfileOpen(false)}
                        onClickApagarConta={() => { setIsEditProfileOpen(false), setIsApagarContaOpen(true) }}
                    />
                </div>
            }

            {
                isApagarContaOpen && <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                    <ApagarContaForm onClickX={() => { setIsApagarContaOpen(false), setIsEditProfileOpen(true) }} />
                </div>
            }
        </div >
    );
}