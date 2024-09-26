import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],  // Especifica o arquivo de entrada
  outDir: 'dist',            // Especifica o diretório de saída
  format: ['cjs'],           // Especifica o formato
});
