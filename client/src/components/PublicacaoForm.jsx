import { useState, useRef } from 'react'
import { format, addMonths, isSameDay, isBefore, startOfDay, parse, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, CloudUpload, Image, X } from 'lucide-react'
import closeIcon from '../assets/icons/close.svg'
import infoIcon from '../assets/icons/info.svg'
import Button from './Button'
import gerarMatrizDias from '../utils/gerarMatrizDias'
import { createPub } from '../services/criarPublicacao'

const MAX_FILE_SIZE = 5 * 1024 * 1024
// Valores do enum public.categoria no banco
const CATEGORIAS = ['Avisos Administrativos', 'Bolsas', 'Comunidade', 'Divulgação', 'Estágios', 'Eventos']
const MSG_OBRIGATORIO = 'Preencha este campo'

const inputBase = 'bg-white border border-solid font-poppins font-normal leading-none outline-none rounded-[8px] text-[14px] text-[#3c4043] w-full placeholder:text-[#909090]'

function borda(erro) {
    return erro ? 'border-[#ea4335]' : 'border-[#e5e5e5] focus:border-[#8d8d8d]'
}

function Campo({ label, erro, children, className = '' }) {
    return (
        <div className={`flex flex-col gap-[12px] items-start w-full ${className}`}>
            {label && <span className="font-poppins font-medium leading-none text-[14px] text-[#3c4043] w-full">{label}</span>}
            {children}
            {erro && (
                <div className="flex gap-[8px] items-center">
                    <img src={infoIcon} className="size-[14px]" />
                    <p className="font-poppins text-[12px] leading-none text-[#ea4335]">{erro}</p>
                </div>
            )}
        </div>
    )
}

function Dropzone({ formatos, aceitos, arquivo, onArquivo }) {
    const inputRef = useRef(null)
    const [erro, setErro] = useState('')

    function receber(file) {
        if (!file) return
        if (!aceitos.includes(file.type)) return setErro(`Formato inválido. Aceitos: ${formatos}`)
        if (file.size > MAX_FILE_SIZE) return setErro('O arquivo deve ter até 5mb')
        setErro('')
        onArquivo(file)
    }

    return (
        <Campo erro={erro}>
            <div
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); receber(e.dataTransfer.files[0]) }}
                className="bg-white border border-dashed border-[#e5e5e5] flex flex-col gap-[20px] h-[192px] items-center justify-center p-[24px] rounded-[8px] w-full cursor-pointer"
            >
                <input ref={inputRef} type="file" accept={aceitos.join(',')} className="hidden" onChange={(e) => { receber(e.target.files[0]); e.target.value = '' }} />
                <div className="size-[48px] rounded-full bg-[#f2f2f2] flex items-center justify-center">
                    <CloudUpload className="size-[20px] text-[#3c4043]" />
                </div>
                {arquivo ? (
                    <div className="flex items-center gap-[8px] font-poppins text-[14px] text-[#3c4043]">
                        <span className="truncate max-w-[400px]">{arquivo.name}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); onArquivo(null) }}>
                            <X className="size-[16px]" />
                        </button>
                    </div>
                ) : (
                    <p className="font-poppins text-[14px] text-center text-[#3c4043] w-[208px] leading-[1.5]">
                        <span className="font-medium">Arraste e solte</span> ou <span className="font-medium">clique</span> para escolher o arquivo
                    </p>
                )}
                <p className="font-poppins text-[12px] leading-none text-[#909090]">Formatos aceitos: {formatos} até 5mb</p>
            </div>
        </Campo>
    )
}

function Radio({ label, checked, onClick }) {
    return (
        <button type="button" onClick={onClick} className="flex items-center gap-[8px] font-poppins text-[14px] text-[#3c4043] cursor-pointer">
            <span className={`size-[22px] rounded-full border flex items-center justify-center ${checked ? 'border-[#3c4043]' : 'border-[#c4c4c4]'}`}>
                {checked && <span className="size-[12px] rounded-full bg-[#3c4043]" />}
            </span>
            {label}
        </button>
    )
}

function SeletorData({ valor, onSelecionar }) {
    const [mes, setMes] = useState(valor || new Date())
    const dias = gerarMatrizDias(mes)
    const hoje = startOfDay(new Date())
    const mesAtual = startOfDay(new Date(hoje.getFullYear(), hoje.getMonth(), 1))
    const podeVoltar = !isBefore(addMonths(mes, -1), mesAtual)

    return (
        <div className="absolute z-10 top-[calc(100%+8px)] left-0 bg-white border border-[#e5e5e5] rounded-[8px] shadow-lg shadow-black/10 p-[16px] font-poppins text-[14px] text-[#3c4043]">
            <div className="flex items-center justify-between mb-[12px]">
                <button
                    type="button"
                    disabled={!podeVoltar}
                    onClick={() => setMes((m) => addMonths(m, -1))}
                    className={podeVoltar ? '' : 'opacity-30 cursor-not-allowed'}
                >
                    <ChevronLeft size="18px" />
                </button>
                <span className="font-semibold capitalize">{format(mes, 'MMMM yyyy', { locale: ptBR })}</span>
                <button type="button" onClick={() => setMes((m) => addMonths(m, 1))}><ChevronRight size="18px" /></button>
            </div>
            <div className="grid grid-cols-7">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map((d) => (
                    <span key={d} className="flex justify-center items-center w-10 h-10 text-[12px] text-[#909090]">{d}</span>
                ))}
                {dias.map((data, i) => {
                    if (!data) return <div key={i} />
                    const passado = isBefore(data, hoje)
                    const selecionado = valor && isSameDay(data, valor)
                    return (
                        <button
                            key={i}
                            type="button"
                            disabled={passado}
                            onClick={() => onSelecionar(data)}
                            className={`flex justify-center items-center w-10 h-10 rounded-[10px] ${selecionado ? 'bg-[#3c4043] text-white' : passado ? 'text-[#c4c4c4] cursor-not-allowed' : 'hover:bg-[#e5e5e5] cursor-pointer'}`}
                        >
                            {data.getDate()}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function mascaraData(texto) {
    const n = texto.replace(/\D/g, '').slice(0, 8)
    if (n.length > 4) return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`
    if (n.length > 2) return `${n.slice(0, 2)}/${n.slice(2)}`
    return n
}

function mascaraTelefone(texto) {
    const n = texto.replace(/\D/g, '').slice(0, 11)
    if (n.length > 10) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
    if (n.length > 6) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`
    if (n.length > 2) return `(${n.slice(0, 2)}) ${n.slice(2)}`
    if (n.length > 0) return `(${n}`
    return ''
}

function parseData(texto) {
    if (texto.length !== 10) return null
    const d = parse(texto, 'dd/MM/yyyy', new Date())
    return isValid(d) ? d : null
}

export default function PublicacaoForm({ onClickX, onSucess, onErro, ref }) {
    const [dados, setDados] = useState({ titulo: '', descricao: '', categorias: [], expiracao: '', email: '', telefone: '', link: '' })
    const [tocados, setTocados] = useState({})
    const [categoriasAbertas, setCategoriasAbertas] = useState(false)
    const [calendarioAberto, setCalendarioAberto] = useState(false)
    const [tipoImagem, setTipoImagem] = useState('anexar')
    const [modeloSelecionado, setModeloSelecionado] = useState(null)
    const [imagem, setImagem] = useState(null)
    const [anexo, setAnexo] = useState(null)
    const [enviando, setEnviando] = useState(false)

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
            // O backend aceita uma única categoria por enquanto
            await createPub({
                titulo: dados.titulo,
                descricao: dados.descricao,
                categoria: dados.categorias[0],
                expiracao: format(dataExpiracao, 'yyyy-MM-dd'),
                email: dados.email,
                telefone: dados.telefone,
                link: dados.link,
            })
            onSucess?.()
        } catch (error) {
            onErro?.(error.response?.data?.mensagem || error.response?.data?.error || 'Não foi possível criar a publicação.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div ref={ref} className="bg-[#fcfcfc] border border-[#e5e5e5] rounded-[16px] w-full max-w-[726px] max-h-[90vh] flex flex-col overflow-hidden font-poppins text-[#3c4043]">
            <header className="bg-white border-b border-[#e5e5e5] p-[32px] flex items-center justify-between shrink-0">
                <h2 className="text-[20px] font-semibold">Criar publicação</h2>
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
                    <div className="relative w-full">
                        <div
                            onClick={() => setCategoriasAbertas((a) => !a)}
                            className={`bg-white border border-solid rounded-[8px] ${erroVisivel('categorias') ? 'border-[#ea4335]' : 'border-[#e5e5e5]'} flex items-center gap-[8px] px-[16px] py-[10px] min-h-[48px] cursor-pointer`}
                        >
                            <div className="flex flex-wrap gap-[4px] flex-1">
                                {dados.categorias.length === 0 && <span className="text-[14px] text-[#909090]">Selecione uma ou mais opções</span>}
                                {dados.categorias.map((c) => (
                                    <span key={c} className="bg-[#e7e7e7] rounded-[50px] px-[8px] py-[6px] flex items-center gap-[8px] text-[12px] leading-none">
                                        {c}
                                        <button type="button" onClick={(e) => { e.stopPropagation(); alternarCategoria(c) }}><X className="size-[16px]" /></button>
                                    </span>
                                ))}
                            </div>
                            <ChevronDown className="size-[16px] shrink-0" />
                        </div>
                        {categoriasAbertas && (
                            <div className="absolute z-10 top-[calc(100%+4px)] left-0 w-full bg-white border border-[#e5e5e5] rounded-[8px] shadow-lg shadow-black/10 py-[8px]">
                                {CATEGORIAS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => alternarCategoria(c)}
                                        className={`w-full text-left px-[16px] py-[10px] text-[14px] hover:bg-[rgba(60,64,67,0.06)] ${dados.categorias.includes(c) ? 'font-medium' : ''}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </Campo>

                <Campo label={<span className="flex items-center gap-[8px]">Exibir até... * <CircleHelp className="size-[14px]" /></span>} erro={erroVisivel('expiracao')}>
                    <div className="relative w-full">
                        <input
                            value={dados.expiracao}
                            onChange={(e) => setDados((prev) => ({ ...prev, expiracao: mascaraData(e.target.value) }))}
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
                    {tipoImagem === 'anexar' ? (
                        <Dropzone formatos="JPG, JPEG ou PNG" aceitos={['image/jpeg', 'image/png']} arquivo={imagem} onArquivo={setImagem} />
                    ) : (
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
                        onChange={(e) => setDados((prev) => ({ ...prev, telefone: mascaraTelefone(e.target.value) }))}
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
                    <Dropzone formatos="PDF" aceitos={['application/pdf']} arquivo={anexo} onArquivo={setAnexo} />
                </div>
            </div>

            <footer className="bg-white border-t border-[#e5e5e5] p-[32px] flex items-center justify-between shrink-0">
                <Button type="button" variant="text" className="h-[45px] text-[#3c4043]" onClick={onClickX}>Cancelar</Button>
                <Button type="button" variant="cta" className="h-[45px]" disabled={!formValido || enviando} onClick={handleSubmit}>Criar publicação</Button>
            </footer>
        </div>
    )
}