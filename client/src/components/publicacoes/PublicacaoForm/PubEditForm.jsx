import { useMemo, useState } from 'react'
import { format, isBefore, parseISO, startOfDay } from 'date-fns'
import { Calendar, CircleHelp, Image } from 'lucide-react'
import closeIcon from '../../../assets/icons/close.svg'
import Button from '../../Button'
import Campo from './Campo'
import Dropzone from './Dropzone'
import SeletorData from './SeletorData'
import Radio from './Radio'
import mascararData from '../../../utils/mascararData'
import mascararTelefone from '../../../utils/mascararTelefone'
import parseData from '../../../utils/parseData'
import UploadedFile from './UploadedFile'
import SeletorCategoria from './SeletorCategoria'

// Valores do enum public.categoria no banco
const CATEGORIAS = ['Avisos Administrativos', 'Bolsas', 'Comunidade', 'Divulgação', 'Estágios', 'Eventos']
const MSG_OBRIGATORIO = 'Preencha este campo'

const inputBase = 'bg-white border border-solid font-poppins font-normal leading-none outline-none rounded-[8px] text-[14px] text-[#3c4043] w-full placeholder:text-[#909090]'

function borda(erro) {
    return erro ? 'border-[#ea4335]' : 'border-[#e5e5e5] focus:border-[#8d8d8d]'
}

export default function PublicacaoEditForm({ onClickX, onSucess, onErro, ref, dadosPub }) {
    const inicial = useMemo(() => ({
        titulo: dadosPub.titulo,
        descricao: dadosPub.descricao,
        categorias: dadosPub.categoria,
        expiracao: format(parseISO(dadosPub.expiracao), 'dd/MM/yyyy'),
        email: dadosPub.email ?? '',
        telefone: dadosPub.telefone ?? '',
        link: dadosPub.link ?? '',
    }), [dadosPub])

    const [dados, setDados] = useState(inicial)

    const [tocados, setTocados] = useState({})

    const [calendarioAberto, setCalendarioAberto] = useState(false)
    const [tipoImagem, setTipoImagem] = useState('anexar')
    const [modeloSelecionado, setModeloSelecionado] = useState(null)
    const [imagem, setImagem] = useState(dadosPub.imagem)
    const [anexo, setAnexo] = useState(dadosPub.anexo)
    const [enviando, setEnviando] = useState(false)

    const mudouCampos = Object.keys(inicial).some((k) => {
        if (k === 'categorias') {
            const a = [...dados.categorias].sort()
            const b = [...inicial.categorias].sort()
            return a.length !== b.length || a.some((v, i) => v !== b[i])
        }
        return dados[k] !== inicial[k]
    })

    const mudouArquivos = imagem !== dadosPub.imagem || anexo !== dadosPub.anexo

    const houveMudanca = mudouCampos || mudouArquivos

    const hoje = startOfDay(new Date())
    const dataDigitada = parseData(dados.expiracao)
    const dataExpiracao = dataDigitada && !isBefore(dataDigitada, hoje) ? dataDigitada : null

    let erroExpiracao = false
    if (!dados.expiracao.trim()) erroExpiracao = MSG_OBRIGATORIO
    else if (!dataDigitada) erroExpiracao = 'Data inválida'
    else if (!dataExpiracao) erroExpiracao = 'A data não pode ser anterior a hoje'

    const erros = {
        titulo: !dados.titulo.trim() && MSG_OBRIGATORIO,
        descricao: !dados.descricao.trim() && MSG_OBRIGATORIO,
        categorias: dados.categorias.length === 0 && MSG_OBRIGATORIO,
        expiracao: erroExpiracao,
    }
    const formValido = !Object.values(erros).some(Boolean)
    const erroVisivel = (campo) => tocados[campo] && erros[campo]

    const alterar = (campo) => (e) => setDados((prev) => ({ ...prev, [campo]: e.target.value }))
    const tocar = (campo) => () => setTocados((prev) => ({ ...prev, [campo]: true }))

    function alternarCategoria(c) {
        setDados((prev) => ({
            ...prev,
            categorias: prev.categorias.includes(c) ? prev.categorias.filter((x) => x !== c) : [...prev.categorias, c],
        }))
        setTocados((prev) => ({ ...prev, categorias: true }))
    }

    async function handleSubmit() {
        if (!formValido || enviando) return
        setEnviando(true)
        try {
            const formPub = new FormData()

            formPub.append('titulo', dados.titulo)
            formPub.append('descricao', dados.descricao)
            formPub.append('expiracao', format(dataExpiracao, 'yyyy-MM-dd'))
            dados.categorias.forEach((c) => formPub.append('categoria', c))

            if (dados.email) formPub.append('email', dados.email)
            if (dados.telefone) formPub.append('telefone', dados.telefone)
            if (dados.link) formPub.append('link', dados.link)

            if (imagem instanceof File) formPub.append('imagem', imagem)
            if (anexo instanceof File) formPub.append('anexo', anexo)

            //await createPub(formPub)
            //onSucess?.()
        } catch (error) {
            //onErro?.(error.response?.data?.mensagem || error.response?.data?.error || 'Não foi possível criar a publicação.')
            // console.log(error)
        } finally {
            // setEnviando(false)
        }
    }

    return (
        <div ref={ref} className="bg-[#fcfcfc] border border-[#e5e5e5] rounded-[16px] w-full max-w-[726px] max-h-[90vh] flex flex-col overflow-hidden font-poppins text-[#3c4043]">
            <header className="bg-white border-b border-[#e5e5e5] p-[32px] flex items-center justify-between shrink-0">
                <h2 className="text-[20px] font-semibold">Editar publicação</h2>
                <button type="button" onClick={onClickX} className="size-[24px] cursor-pointer"><img src={closeIcon} /></button>
            </header>

            <div className="flex flex-col gap-[24px] p-[32px] overflow-y-auto">
                <Campo label="Título *" erro={erroVisivel('titulo')}>
                    <input
                        value={dados.titulo}
                        onChange={alterar('titulo')}
                        onBlur={tocar('titulo')}
                        placeholder="Título"
                        className={`${inputBase} ${borda(erroVisivel('titulo'))} h-[48px] px-[16px] py-[10px]`}
                    />
                </Campo>

                <Campo label="Descrição *" erro={erroVisivel('descricao')}>
                    <textarea
                        value={dados.descricao}
                        onChange={alterar('descricao')}
                        onBlur={tocar('descricao')}
                        placeholder="Descrição"
                        className={`${inputBase} ${borda(erroVisivel('descricao'))} h-[90px] p-[16px] leading-[1.5] resize-none`}
                    />
                </Campo>

                <Campo label="Selecionar categoria *" erro={erroVisivel('categorias')}>
                    <SeletorCategoria valor={dados.categorias} opcoes={CATEGORIAS} onAlternar={alternarCategoria} erro={erroVisivel('categorias')} />
                </Campo>

                <Campo label={<span className="flex items-center gap-[8px]">Exibir até... * <CircleHelp className="size-[14px]" /></span>} erro={erroVisivel('expiracao')}>
                    <div className="relative w-full">
                        <input
                            value={dados.expiracao}
                            onChange={(e) => setDados((prev) => ({ ...prev, expiracao: mascararData(e.target.value) }))}
                            onBlur={tocar('expiracao')}
                            placeholder="dd/mm/aaaa"
                            inputMode="numeric"
                            maxLength={10}
                            className={`${inputBase} ${borda(erroVisivel('expiracao'))} h-[48px] pl-[16px] pr-[48px] py-[10px]`}
                        />
                        <button type="button" onClick={() => setCalendarioAberto((a) => !a)} className="absolute right-[16px] top-1/2 -translate-y-1/2 cursor-pointer">
                            <Calendar className="size-[16px]" />
                        </button>
                        {calendarioAberto && (
                            <SeletorData
                                valor={dataExpiracao}
                                onSelecionar={(d) => {
                                    setDados((prev) => ({ ...prev, expiracao: format(d, 'dd/MM/yyyy') }))
                                    setTocados((prev) => ({ ...prev, expiracao: true }))
                                    setCalendarioAberto(false)
                                }}
                            />
                        )}
                    </div>
                </Campo>

                <div className="bg-[#e5e5e5] h-px w-full shrink-0" />

                <p className="text-[16px] font-medium">Informações adicionais <span className="text-[#909090]">(opcionais)</span></p>

                <div className="flex flex-col gap-[12px]">
                    <span className="text-[14px] font-medium">Imagem de destaque</span>
                    <div className="flex gap-[24px]">
                        <Radio label="Anexar imagem" checked={tipoImagem === 'anexar'} onClick={() => setTipoImagem('anexar')} />
                        <Radio label="Modelos do mural" checked={tipoImagem === 'modelos'} onClick={() => setTipoImagem('modelos')} />
                    </div>
                    {tipoImagem === 'anexar' ?
                        imagem ?
                            <UploadedFile file={imagem} onClickTrash={() => setImagem(null)}/> :
                            <Dropzone formatos="JPG, JPEG ou PNG" aceitos={['image/jpeg', 'image/png']} arquivo={imagem} onArquivo={setImagem} />
                        : (
                            <div className="grid grid-cols-2 gap-[12px]">
                                {[0, 1, 2, 3].map((i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setModeloSelecionado(i)}
                                        className="relative bg-[#e5e5e5] border-[1.5px] border-[#e5e5e5] rounded-[8px] h-[139px] flex items-center justify-center cursor-pointer"
                                    >
                                        <Image className="size-[32px] text-[#909090]" />
                                        <span className={`absolute top-[10px] left-[10px] size-[22px] rounded-full border bg-white flex items-center justify-center ${modeloSelecionado === i ? 'border-[#3c4043]' : 'border-[#c4c4c4]'}`}>
                                            {modeloSelecionado === i && <span className="size-[12px] rounded-full bg-[#3c4043]" />}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                </div>

                <Campo label="E-mail">
                    <input value={dados.email} onChange={alterar('email')} placeholder="exemplo@email.com" className={`${inputBase} ${borda(false)} h-[48px] px-[16px] py-[10px]`} />
                </Campo>

                <Campo label="Telefone/Celular">
                    <input
                        value={dados.telefone}
                        onChange={(e) => setDados((prev) => ({ ...prev, telefone: mascararTelefone(e.target.value) }))}
                        placeholder="(00) 00000-0000"
                        inputMode="tel"
                        maxLength={15}
                        className={`${inputBase} ${borda(false)} h-[48px] px-[16px] py-[10px]`}
                    />
                </Campo>

                <Campo label="Link externo">
                    <input value={dados.link} onChange={alterar('link')} placeholder="https://exemplo.com" className={`${inputBase} ${borda(false)} h-[48px] px-[16px] py-[10px]`} />
                </Campo>

                <div className="flex flex-col gap-[12px]">
                    <span className="text-[14px] font-medium">Anexar arquivo</span>

                    {anexo ?
                        <UploadedFile file={anexo} onClickTrash={() => setAnexo(null)}/>
                        : <Dropzone formatos="PDF" aceitos={['application/pdf']} arquivo={anexo} onArquivo={setAnexo} />
                    }
                </div>
            </div>

            <footer className="bg-white border-t border-[#e5e5e5] p-[32px] flex items-center justify-between shrink-0">
                <Button type="button" variant="text" className="h-[45px] text-[#3c4043]" onClick={onClickX}>Cancelar</Button>
                <Button type="button" variant="cta" className="h-[45px]" disabled={!formValido || enviando || !houveMudanca} onClick={handleSubmit}>Salvar alterações</Button>
            </footer>
        </div>
    )
}