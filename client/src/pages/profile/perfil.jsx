import { useEffect, useState } from "react";
import { LogOut, Pencil, Settings, TableConfig, User } from "lucide-react";
import Header from "../../components/Header";
import isUserLoggedIn from "../../utils/auth";
import { EditProfileForm } from "../../components/EditProfileForm";
import ApagarContaForm from "../../components/ApagarContaForm";
import { getPublicacoes } from "../../services/publicacoes";
import { PubliCard } from "../../components/publicacoes/PubliCard";
import { useNavigate } from "react-router-dom";
import Feed from "../../components/publicacoes/Feed";

export default function PerfilPage() {
    const { busca, dataInicio, dataFim, ComponenteHeader} = Header({showSearch: true, 
                                                                        onClickEntre: () => setIsLoginOpen(true), 
                                                                        onClickCadastro: () => setIsCadastroOpen(true)
                                                                })

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
            p.nome_usuario === isUserLoggedIn().usuario &&
            (p.titulo.toLowerCase().includes(busca.toLowerCase())) &&
            (!dataInicio || new Date(dataInicio) <= new Date(p.criado_em)) &&
            (!dataFim || new Date(dataFim) >= new Date(p.criado_em))
    )


    return (
        <div className="min-h-screen bg-white">
            {ComponenteHeader}

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
                        <Feed list={filtradas}/>
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