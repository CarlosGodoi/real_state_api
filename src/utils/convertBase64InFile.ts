import fs from 'fs'
import { env } from '@/env'

export const saveFile = (id: string, base64: string): string => {
  const fileName = `${id}-profile.png`
  fs.writeFileSync(`public/images/immobiles/${fileName}`, base64, 'base64')
  return fileName
}

export const transformImageToUrl = (fileName: string): string => {
  return `${env.APP_HOST}/profile/${fileName}`
}

export const removeImageImmobile = (fileName: string) => {
  if (fs.existsSync(`public/images/immobiles/${fileName}`)) {
    fs.unlinkSync(`public/images/immobiles/${fileName}`)
  }
}

export const saveFileUpload = (id: string, base64: string): string => {
  const fileName = `${id}-imovel.png`
  fs.writeFileSync(`public/immobiles/${fileName}`, base64, 'base64')
  return fileName
}

export const isBase64 = (value: string) =>
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(
    value,
  )
