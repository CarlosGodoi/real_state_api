import { makeUploadImmobilelUseCase } from "@/use-cases/factories/make-upload-immobile-use-case";
import cloudinary from "@/utils/cloudinary";
import { FastifyReply, FastifyRequest } from "fastify";
import { Readable } from "stream";


export async function uploadImmobile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  console.log(`Recebendo upload para o imóvel ID: ${id}`);

  try {
    // Certifique-se de que `files` está configurado corretamente
    const parts = request.files({ limits: { fileSize: 100 * 1024 * 1024 } });
    const images: { path: string }[] = [];

    // Adicione logs em cada parte do processo
    for await (const part of parts) {
      console.log(`Processando arquivo: ${part.filename}`);

      if (!part.file) {
        console.error("Erro: Parte sem arquivo detectada.");
        continue;  // Ignora partes que não contêm arquivos
      }

      try {
        const uploadResult = await new Promise<{ path: string }>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "imoveis",
              public_id: `${id}-${Date.now()}-${part.filename}`,
            },
            (error, result) => {
              if (error) {
                console.error(`Erro no upload do Cloudinary: ${error.message}`);
                reject(error);  // Rejeita a promessa em caso de erro
              } else {
                console.log(`Upload do Cloudinary bem-sucedido: ${result?.secure_url}`);
                resolve({ path: result?.secure_url || '' });
              }
            }
          );
          Readable.from(part.file).pipe(stream);  // Transmite o arquivo para o Cloudinary
        });
        images.push(uploadResult);  // Adiciona a imagem na lista de uploads
      } catch (error) {
        console.error(`Erro ao processar o arquivo ${part.filename}:`, error);
        throw error;  // Lança o erro para tratamento no catch principal
      }
    }

    console.log(`Total de imagens processadas: ${images.length}`);

    const uploadUseCase = makeUploadImmobilelUseCase();
    await uploadUseCase.execute({
      id,
      images,
    });

    return reply.status(200).send({ message: 'Upload concluído com sucesso.' });
  } catch (error) {
    console.error(`Erro no endpoint uploadImmobile: `, error);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
}
