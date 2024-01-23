# App Real State

## API desenvolvida em node Js + Prisma + Fastify

## 👨‍💻 Instalção de dependências

npm install

## 👨‍💻 Criar DB no Docker

docker compose up

## 👨‍💻 Gerar schema e Executar as migrations

npx prisma generate

npx prisma migrate dev

## Testes unitários ✅

## API Documentada com Swagger
Faltando ajustar algumas rotas na documentação

## RFs (Requisitos funcionais) ✅

- [x] Deve ser possível se cadastrar na aplicação
- [x] Deve ser possível se autenticar na aplicação
- [x] Deve ser possível obter o perfil de um usuário logado
- [x] Deve ser possível cadastrar imovel
- [x] Deve ser possível listar os imóveis cadastrados
- [x] Deve ser possível buscar imóveis disponíveis por (preço, tipo de contrato, quantidade de quartos)
- [x] Deve ser possível atualizar os dados do imóvel cadastrado
- [x] Deve ser possível excluir/desabilitar imovél

## RNs (Regras de negócio) ✅

- [x] Usuário não pode se cadastrar com email duplicado
- [x] Somente usuário corretor pode cadastrar imóveis
- [x] Somente usuário corretor pode desabilitar/excluir cadastro de imovel

## RNFs (Requisitos não-funcionais) ✅

- [x] A senha do usuário dever estar criptografada
- [x] Os Dados devem ser persistidos em banco postgres
- [x] Todas as listas de dados precisam estar paginadas com 10 itens por página
- [x] O usuário deve ser identificado por um JWT (JSON Web Token)
