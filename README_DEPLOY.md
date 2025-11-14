# Deploy do Frontend - PagPro Seguro Fiança

## Dockerfile

O Dockerfile foi criado com multi-stage build para otimizar o tamanho da imagem final.

### Estrutura

1. **Stage 1 (deps)**: Instala todas as dependências
2. **Stage 2 (builder)**: Compila a aplicação Next.js
3. **Stage 3 (runner)**: Imagem final de produção com apenas o necessário

### Variáveis de Ambiente

O Dockerfile aceita os seguintes build args:

- `NEXT_PUBLIC_API_URL` - URL da API backend (obrigatório)
- `NEXT_PUBLIC_FRONTEND_URL` - URL do frontend (opcional)

### Exemplo de Build

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.pagproseguro.com.br/api \
  --build-arg NEXT_PUBLIC_FRONTEND_URL=https://app.pagproseguro.com.br \
  -t pagpro-frontend .
```

### Exemplo de Run

```bash
docker run -p 3000:3000 pagpro-frontend
```

## Coolify

O Dockerfile está configurado para funcionar com Coolify automaticamente. O Coolify irá:

1. Clonar o repositório
2. Passar as variáveis de ambiente como build args
3. Construir a imagem
4. Executar o container

### Variáveis Necessárias no Coolify

Certifique-se de configurar no Coolify:

- `NEXT_PUBLIC_API_URL` - URL da API (ex: `https://api.pagproseguro.com.br/api`)
- `NEXT_PUBLIC_FRONTEND_URL` - URL do frontend (ex: `https://app.pagproseguro.com.br`)

## Notas

- A aplicação roda na porta 3000 por padrão
- O modo standalone do Next.js está habilitado para otimização
- A imagem usa Alpine Linux para reduzir tamanho
- O container roda como usuário não-root por segurança

