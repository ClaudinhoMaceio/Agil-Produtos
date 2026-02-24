# 🛒 Catálogo Digital - Agil Produtos

Sistema de catálogo digital para produtos de limpeza com carrinho de compras integrado ao WhatsApp.

## 📋 Estrutura do Projeto

```
ARGIL/
├── index.html          # Página principal
├── produtos.json       # Banco de dados dos produtos
├── IMAGENS/           # Pasta com todas as imagens dos produtos
│   ├── logo.jpeg      # Logo da empresa
│   └── [37 imagens de produtos]
└── README.md          # Este arquivo
```

## 🚀 Como Publicar

### Opção 1: GitHub Pages (Gratuito)

1. Crie uma conta no [GitHub](https://github.com)
2. Crie um novo repositório
3. Faça upload de todos os arquivos:
   - `index.html`
   - `produtos.json`
   - Pasta `IMAGENS/` completa
4. Vá em Settings > Pages
5. Selecione a branch `main` e salve
6. Seu site estará disponível em: `https://seu-usuario.github.io/nome-do-repositorio/`

### Opção 2: Netlify (Gratuito)

1. Acesse [Netlify](https://www.netlify.com)
2. Faça login ou crie uma conta
3. Arraste a pasta do projeto para a área de deploy
4. Pronto! Seu site estará online

### Opção 3: Vercel (Gratuito)

1. Acesse [Vercel](https://vercel.com)
2. Faça login com GitHub
3. Importe o projeto
4. Deploy automático!

### Opção 4: Servidor Próprio

1. Faça upload de todos os arquivos via FTP
2. Mantenha a estrutura de pastas:
   ```
   public_html/
   ├── index.html
   ├── produtos.json
   └── IMAGENS/
       └── [todas as imagens]
   ```

## ✅ Checklist Antes de Publicar

- [x] Todas as 37 imagens estão na pasta IMAGENS
- [x] O arquivo produtos.json está atualizado
- [x] O logo está em IMAGENS/logo.jpeg
- [x] Todos os caminhos das imagens estão corretos
- [x] O número do WhatsApp está correto (linha 540 do index.html)

## 🔧 Funcionalidades

- ✅ Catálogo de produtos com imagens
- ✅ Busca por categoria
- ✅ Carrinho de compras
- ✅ Visualização ampliada de imagens (clique na foto)
- ✅ Envio de pedido via WhatsApp
- ✅ Design responsivo (funciona em celular e computador)
- ✅ 37 produtos cadastrados

## 📱 Como Usar

1. **Adicionar ao Carrinho**: Clique no botão "ADICIONAR" em qualquer produto
2. **Ver Imagem Maior**: Clique na foto do produto
3. **Ver Carrinho**: Clique no ícone do carrinho no canto superior direito
4. **Finalizar Pedido**: Clique em "FINALIZAR NO WHATSAPP"

## 🛠️ Manutenção

### Adicionar Novo Produto

1. Adicione a imagem na pasta `IMAGENS/`
2. Abra `produtos.json`
3. Adicione um novo objeto no array:
```json
{
    "id": 38,
    "name": "Nome do Produto",
    "category": "Limpeza",
    "image": "IMAGENS/NOME-DA-IMAGEM.jpeg"
}
```

### Editar Nome de Produto

1. Abra `produtos.json`
2. Encontre o produto pelo `id`
3. Altere o campo `name`
4. Salve o arquivo

## 📞 Suporte

Para alterar o número do WhatsApp, edite a linha 540 do `index.html`:
```javascript
const phone = "5511960435545"; // Altere aqui
```

## 🎨 Personalização

- **Cores**: Edite as classes `bg-agil` e `text-agil` no CSS (linha 12-13)
- **Logo**: Substitua `IMAGENS/logo.jpeg`
- **Título**: Edite na linha 57 do `index.html`

## ✨ Sistema Verificado e Pronto!

✅ 37 produtos cadastrados
✅ 37 imagens mapeadas corretamente
✅ Todos os caminhos funcionando
✅ Código sem erros
✅ Pronto para publicação!
