import { Bell } from "lucide-react";
import { useState } from "react"
import isUserLoggedIn from "../utils/auth";
import { seguirCategoria } from "../services/categorias/seguirCategoria";
import { obterCategoriasSeguidas } from "../services/categorias/obterCategoriasSeguidas";
import { useEffect } from "react";
import { desseguirCategoria } from "../services/categorias/desseguirCategoria";

export default function CategoriaCard({ texto, onClick }) {
    const usuario = isUserLoggedIn()?.usuario

    const [cardClicado, setCardClicado] = useState(false);
    const [isBellHovered, setIsBellHovered] = useState(false);
    const [isCategoriaSeguida, setIsCategoriaSeguida] = useState(null);

    //Atualiza os cards para carregar as categorias seguidas por um usuário quando houver autenticação
    useEffect(() => {
        async function carregarCategorias() {
            try {
                if (isUserLoggedIn()) {
                    const categoriasObtidas = await obterCategoriasSeguidas(isUserLoggedIn().usuario)

                    setIsCategoriaSeguida(categoriasObtidas.categorias.includes(texto))
                }
            } catch (error) {
                console.log(error)
            }
        }

        carregarCategorias()
    }, [usuario])

    return (
        <div className="relative font-poppins">
            <div
                onClick={() => { setCardClicado(!cardClicado), onClick() }}
                className={`relative flex items-center h-[100px] max-w-[250px] px-[24px] py-[12px] text-left border ${cardClicado ? 'border-[#8d8d8d]' : 'border-[#e5e5e5]'}
            rounded-[12px] overflow-hidden hover:cursor-pointer hover:border-[#8d8d8d] hover:shadow-xl hover:scale-104 transition-all duration-300`}
            >
                <span className="font-poppins font-medium block max-w-[130px]"> {texto} </span>
                <div className="absolute bg-[#e5e5e5] size-[100px] right-[-40px] bottom-[-50px] rounded-[50px]" />
            </div>
            {isUserLoggedIn() && isCategoriaSeguida !== null && <div className="absolute right-[12px] top-[12px]">
                <button
                    onClick={async (e) => {
                        e.stopPropagation();
                        setIsCategoriaSeguida(!isCategoriaSeguida);
                        isCategoriaSeguida ?
                            await desseguirCategoria(usuario, texto.replace(/["']/g, ""))
                            :
                            await seguirCategoria(usuario, texto.replace(/["']/g, ""))
                    }}
                    className=" size-[20px] flex items-center justify-center rounded-[50%] hover:bg-gray-200"
                >
                    <Bell
                        onMouseEnter={() => setIsBellHovered(true)}
                        onMouseLeave={() => setIsBellHovered(false)}
                        className={`size-[16px] stroke-[#8d8d8d] ${isCategoriaSeguida ? 'fill-[#8d8d8d]' : ''}`}
                    />
                </button>

                {isBellHovered && <div className="z-2 absolute top-[36px] left-[-138px] w-[300px] p-[8px] rounded-[8px] bg-[#3c4043] text-white text-center">
                    <span className="text-[14px]"> {isCategoriaSeguida ? "Ao desabilitar, você não receberá mais notificações desta categoria." : "Ao habilitar, você receberá notificações desta categoria."} </span>
                </div>}

            </div>}
        </div>
    )
}