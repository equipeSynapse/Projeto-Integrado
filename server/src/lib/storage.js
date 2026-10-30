import { randomUUID } from 'crypto'
import { supabase } from '../database/db.js'

export const BUCKET_IMAGENS = 'publicacoes_imgs'

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
  return path
}

export function urlImagem(path) {
  if (!path) return null
  const { data } = supabase.storage.from(BUCKET_IMAGENS).getPublicUrl(path)
  return data.publicUrl
}

export async function removerImagem(path) {
  if (path) await supabase.storage.from(BUCKET_IMAGENS).remove([path])
}