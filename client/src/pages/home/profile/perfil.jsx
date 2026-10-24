import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import Header from "../../../components/Header";
import isUserLoggedIn from "../../../utils/auth";
import { EditProfileForm } from "../../../components/EditProfileForm";
import ApagarContaForm from "../../../components/ApagarContaForm";

export default function PerfilPage() {
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isApagarContaOpen, setIsApagarContaOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            <Header>
                <div className="flex items-center gap-6 w-full">
                    <div> Logo </div>
                </div>


                <div className="flex justify-between gap-12">
                    <div className="flex gap-6">
                        <div> Início </div>
                        <div> Notificações </div>
                    </div>
                    <div className="flex justify-center items-center bg-[#e5e5e5] size-[50px] rounded-[50px]">
                        {isUserLoggedIn().usuario[0].toUpperCase()}
                    </div>
                </div>


            </Header>

            <main className="relative flex justify-center gap-[48px] px-[60px] py-[48px] mx-auto font-poppins">
                <section className="pt-[60px]">
                    <div className="bg-[#bababa] h-[300px] w-[80dvw]" />
                    <div className="pl-[100px]">
                        <div className="flex w-full justify-between">
                            <div className="relative top-[-100px] bg-[#d9d9d9] size-[280px] rounded-[50%]" />
                            <button onClick={() => setIsEditProfileOpen(true)} className="relative top-[-50px]"> 
                                <Pencil className="size-[24px] stroke-[#3c4043]" /> 
                            </button>
                        </div>
                        <div className="relative top-[-30px] flex flex-col gap-[12px]">
                            <span className="text-[40px] font-bold"> {isUserLoggedIn().usuario} </span>
                            <p className="text-[20px] text-[#434343]"> Exemplo de Bio </p>
                        </div>
                    </div>
                </section>
            </main>

            {isEditProfileOpen && <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                <EditProfileForm 
                    onClickX={() => setIsEditProfileOpen(false)} 
                    onClickApagarConta={() => {setIsEditProfileOpen(false), setIsApagarContaOpen(true)}}
                />
            </div>}

            {isApagarContaOpen && <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                <ApagarContaForm onClickX={() => {setIsApagarContaOpen(false), setIsEditProfileOpen(true)}}/>
            </div>}
        </div>
    );
}