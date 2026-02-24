const fs = require('fs');
const path = require('path');

const PRODUTOS_JSON = path.join(__dirname, 'produtos.json');
const IMAGENS_DIR = path.join(__dirname, 'IMAGENS');

// Lê todas as imagens disponíveis
const imagens = fs.readdirSync(IMAGENS_DIR)
    .filter(arquivo => arquivo.toLowerCase().endsWith('.jpeg') || arquivo.toLowerCase().endsWith('.jpg'))
    .sort()
    .map(arquivo => `IMAGENS/${arquivo}`);

console.log(`📸 Encontradas ${imagens.length} imagens na pasta IMAGENS\n`);

// Lê o arquivo produtos.json
const produtos = JSON.parse(fs.readFileSync(PRODUTOS_JSON, 'utf8'));

console.log(`📦 Encontrados ${produtos.length} produtos no JSON\n`);

// Atualiza os caminhos das imagens
let atualizados = 0;
produtos.forEach((produto, index) => {
    if (index < imagens.length) {
        const imagemAntiga = produto.image;
        produto.image = imagens[index];
        
        // Atualiza o nome do produto baseado no nome da imagem (remove extensão e formata)
        const nomeImagem = path.basename(imagens[index], '.jpeg').replace(/-/g, ' ');
        if (produto.name === 'Produto de Limpeza' || produto.name === 'Produto de LimpezaL') {
            // Capitaliza a primeira letra de cada palavra
            produto.name = nomeImagem
                .split(' ')
                .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
                .join(' ');
        }
        
        console.log(`✅ Produto ${produto.id}: ${imagemAntiga} → ${produto.image}`);
        console.log(`   Nome: ${produto.name}`);
        atualizados++;
    } else {
        console.log(`⚠️  Produto ${produto.id}: Sem imagem disponível`);
    }
});

// Salva o arquivo atualizado
fs.writeFileSync(PRODUTOS_JSON, JSON.stringify(produtos, null, 4), 'utf8');

console.log(`\n✨ Atualização concluída! ${atualizados} produtos atualizados.`);
console.log(`📁 Arquivo salvo: ${PRODUTOS_JSON}`);
