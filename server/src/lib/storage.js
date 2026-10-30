import { randomUUID } from 'crypto'
import { supabase } from '../database/db.js'

export const BUCKET_IMAGENS = 'publicacoes_imgs'
export const BUCKET_ANEXOS = 'publicacoes_anexos'

const EXTENSOES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

export async function enviarImagem(file) {
  const ext = EXTENSOES[file.mimetype]
  if (!ext) throw new Error('Tipo de arquivo não permitido')

  const path = `${randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET_IMAGENS)
    .upload(path, file.buffer, { contentType: file.mimetype })

  if (error) throw error
  return {
    path,
    titulo: Buffer.from(file.originalname, 'latin1').toString('utf8'),
    tipo: ext,
    tamanho: Math.round(file.size/1024),
  }
}

export async function enviarAnexo(file) {
  if (file.mimetype !== 'application/pdf') {
    throw new Error('Tipo de arquivo não permitido')
  }

  const path = `${randomUUID()}.pdf`

  const { error } = await supabase.storage
    .from(BUCKET_ANEXOS)
    .upload(path, file.buffer, { contentType: 'application/pdf' })

  if (error) throw error

  return {
    path,
    titulo: Buffer.from(file.originalname, 'latin1').toString('utf8'),
    tipo: 'pdf',
    tamanho: Math.round(file.size/1024)
  }
}

export function urlImagem(imagem) {
  if (!imagem?.path) return null
  const { data } = supabase.storage.from(BUCKET_IMAGENS).getPublicUrl(imagem.path)
  return { ...imagem, url: data.publicUrl }
}

export function urlAnexo(anexo) {
  if (!anexo?.path) return null

  const { data } = supabase.storage
    .from(BUCKET_ANEXOS)
    .getPublicUrl(anexo.path)

  return { ...anexo, url: data.publicUrl }
}

export async function removerImagem(path) {
  if (path) await supabase.storage.from(BUCKET_IMAGENS).remove([path])
}

export async function removerAnexo(path) {
  if (path) await supabase.storage.from(BUCKET_ANEXOS).remove([path])
}