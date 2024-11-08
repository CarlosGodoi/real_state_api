import { makeUploadImmobilelUseCase } from "@/use-cases/factories/make-upload-immobile-use-case";
import cloudinary from "@/utils/cloudinary";
import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import { Readable } from "stream";

import { pipeline } from "stream/promises";

export async function uploadImmobile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  // try {
  //   const parts = request.files({ limits: { fileSize: 100 * 1024 * 1024 } });
  //   const images: { path: string }[] = [];

  //   for await (const part of parts) {
  //     const fileName = `${id}-${Date.now()}-${part.filename}`;
  //     await pipeline(
  //       part.file,
  //       fs.createWriteStream(`public/images/immobiles/${fileName}`)
  //     );
  //     images.push({ path: `public/images/immobiles/${fileName}` });
  //   }

  //   const uploadUseCase = makeUploadImmobilelUseCase();

  //   await uploadUseCase.execute({
  //     id,
  //     images,
  //   });
  //   return reply.status(200).send();
  // } catch (error) {
  //   return reply.status(500).send(error);
  // }

  try {
    const parts = request.files({ limits: { fileSize: 100 * 1024 * 1024 } });
    const images: { path: string }[] = [];

    for await (const part of parts) {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "immobiles", // Defina a pasta no Cloudinary
          public_id: `${id}-${Date.now()}-${part.filename}`,
        },
        (error, result) => {
          if (error) throw error;
          images.push({ path: result ? result.secure_url : '' }); // Armazena o URL seguro da imagem no Cloudinary
        }
      );
      Readable.from(part.file).pipe(stream); // Envia o arquivo para o Cloudinary
    }

    const uploadUseCase = makeUploadImmobilelUseCase();

    await uploadUseCase.execute({
      id,
      images,
    });
    return reply.status(200).send();
  } catch (error) {
    return reply.status(500).send(error);
  }
}
