const fs = require('fs');
const path = require('path');

const IMAGENS_DIR = path.join(__dirname, 'IMAGENS');
const PRODUTOS_JSON = path.join(__dirname, 'produtos.json');

// Lista arquivos reais
const arquivosReais = fs.readdirSync(IMAGENS_DIR)
    .filter(f => f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.jpg'))
    .map(f => f.toLowerCase());

console.log('📁 Arquivos reais na pasta IMAGENS:');
arquivosReais.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
console.log(`\nTotal: ${arquivosReais.length} arquivos\n`);

// Lê produtos.json
const produtos = JSON.parse(fs.readFileSync(PRODUTOS_JSON, 'utf8'));

console.log('🔍 Verificando caminhos no produtos.json:\n');

let problemas = 0;
produtos.forEach(produto => {
    const caminhoArquivo = path.basename(produto.image).toLowerCase();
    const existe = arquivosReais.includes(caminhoArquivo);
    
    if (!existe) {
        console.log(`❌ ID ${produto.id}: "${produto.name}"`);
        console.log(`   Caminho no JSON: ${produto.image}`);
        console.log(`   Arquivo não encontrado: ${caminhoArquivo}`);
        problemas++;
    }
});

if (problemas === 0) {
    console.log('✅ Todos os caminhos estão corretos!');
} else {
    console.log(`\n⚠️  Encontrados ${problemas} problema(s) de caminho.`);
}
