import { useEffect, useLayoutEffect, useRef } from "react";

// Modais abertos no momento, do mais antigo para o mais recente. Só o do topo responde ao Esc.
const pilhaDeModais = [];

// Deixa "inerte" (fora do alcance do Tab e do leitor de tela) tudo o que não é o modal:
// sobe do modal até o <body> e marca os irmãos de cada nível. Devolve a função que desfaz.
function isolarModal(modal) {
    const alterados = [];
    let atual = modal;

    while (atual && atual.parentElement && atual !== document.body) {
        for (const irmao of atual.parentElement.children) {
            if (irmao !== atual && !irmao.inert && irmao.tagName !== "SCRIPT" && irmao.tagName !== "STYLE") {
                irmao.inert = true;
                alterados.push(irmao);
            }
        }
        atual = atual.parentElement;
    }

    return () => alterados.forEach((el) => { el.inert = false; });
}

// Garante que o leitor de tela anuncie o modal como diálogo, com o título dele como nome.
function anunciarComoDialogo(modal) {
    if (!modal.getAttribute("role")) modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    if (!modal.getAttribute("aria-label") && !modal.getAttribute("aria-labelledby")) {
        const titulo = modal.querySelector("h1, h2, h3");
        if (titulo) {
            if (!titulo.id) titulo.id = `titulo-modal-${Math.random().toString(36).slice(2, 8)}`;
            modal.setAttribute("aria-labelledby", titulo.id);
        }
    }
}

// Hook dos modais: dá foco ao abrir, fecha com Esc, bloqueia o resto da página enquanto
// está aberto e devolve o foco ao elemento que abriu o modal quando ele fecha.
// Exportado como padrão (importado como "closeModal" nos componentes) e também como "useModal".
export default function useModal(modalRef, closeFunc) {
    // Guarda sempre a versão mais recente da função de fechar, sem refazer o efeito a cada
    // renderização do componente pai (refazer o efeito tirava o foco do campo em edição).
    const fecharRef = useRef(closeFunc);
    useLayoutEffect(() => { fecharRef.current = closeFunc; });

    useEffect(() => {
        const modal = modalRef.current;
        const previouslyFocusedElement = document.activeElement;
        let desfazerIsolamento = () => {};

        if (modal) {
            anunciarComoDialogo(modal);
            desfazerIsolamento = isolarModal(modal);
            modal.focus();
        }

        const id = {};
        pilhaDeModais.push(id);

        const handleKeyDown = (e) => {
            if (e.key === "Escape" && pilhaDeModais[pilhaDeModais.length - 1] === id) {
                fecharRef.current?.();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            pilhaDeModais.splice(pilhaDeModais.indexOf(id), 1);
            desfazerIsolamento();
            if (previouslyFocusedElement && previouslyFocusedElement.isConnected) {
                previouslyFocusedElement.focus();
            }
        };
    }, [modalRef]);
}

export { useModal };
