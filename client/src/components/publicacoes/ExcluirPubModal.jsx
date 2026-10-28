import closeIcon from "../../assets/icons/close.svg";
import { Trash } from "lucide-react";
import Button from "../Button";
import { excluirPublicacao } from "../../services/excluirPublicacao";


export default function ExcluirPubModal( {onClickX, pubId, onSucesso} ) {

    async function handleExcluir() {
        try {
            await excluirPublicacao(pubId); // Chama a API com o ID
            if (onSucesso) onSucesso(); // Fecha o modal e atualiza a tela
        } catch (error) {
            alert("Erro ao excluir a publicação.");
            console.log(error);
        }
    }

    return (
        <div className="w-[564px] bg-white rounded-[16px] p-[32px] font-poppins">
            <div className="flex justify-end"> <button onClick={onClickX}> <img src={closeIcon} /> </button> </div>

            <div className="flex flex-col gap-[24px] justify-center items-center mb-[48px]">
                <div className=" flex justify-center items-center bg-[#d9d9d9] size-[80px] rounded-[50px]">
                    <Trash className="size-[40px] stroke-[#8d8d8d]" />
                </div>
                <div className="flex flex-col gap-[24px] items-center">
                    <span className="font-semibold text-[28px]"> Você quer excluir? </span>
                    <span className="text-[16px] text-center"> 
                        Tem certeza de que quer remover esta publicação permanentemente?
                    </span>
                </div>
            </div>

            <div className="flex justify-between">
                <Button onClick={onClickX}> Cancelar </Button>
                <Button variant="cta"  onClick={handleExcluir}> Excluir </Button>
            </div>
        </div>
    )
}