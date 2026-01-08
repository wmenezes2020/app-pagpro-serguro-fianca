# Como resolver o problema do CSS não carregar

O CSS global pode não estar sendo carregado devido ao cache do Next.js. Siga estes passos:

## 1. Limpar o cache do Next.js

```bash
cd frontend
rm -rf .next
# ou no Windows:
rmdir /s /q .next
```

## 2. Limpar o cache do npm (opcional)

```bash
npm cache clean --force
```

## 3. Reinstalar dependências (se necessário)

```bash
rm -rf node_modules
npm install
```

## 4. Reiniciar o servidor de desenvolvimento

```bash
npm run dev
```

## 5. Verificar no navegador

1. Abra o DevTools (F12)
2. Vá para a aba "Network"
3. Filtre por "CSS"
4. Recarregue a página (Ctrl+Shift+R ou Cmd+Shift+R para hard refresh)
5. Verifique se `globals.css` aparece na lista

## Se ainda não funcionar:

Verifique se o arquivo `postcss.config.mjs` está configurado corretamente:

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

E certifique-se de que o `globals.css` está sendo importado no `layout.tsx`:

```typescript
import "./globals.css";
```
