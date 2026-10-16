export default async function copiarLink(idPubli){
    try {
        if (import.meta.env.VITE_API_URL) await navigator.clipboard.writeText(`https://projeto-integrado-frontend-a74e.onrender.com/${idPubli}`)
        else await navigator.clipboard.writeText(`localhost:5173/${idPubli}`)
    } catch (error) {
        console.error("Não foi possível copiar o link...", error)
    }
}