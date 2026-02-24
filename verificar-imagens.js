const fs = require('fs');
const path = require('path');

const PRODUTOS_JSON = path.join(__dirname, 'produtos.json');
const IMAGENS_DIR = path.join(__dirname, 'IMAGENS');

// Lê todas as imagens disponíveis
const imagensDisponiveis = fs.readdirSync(IMAGENS_DIR)
    .filter(arquivo => arquivo.toLowerCase().endsWith('.jpeg') || arquivo.toLowerCase().endsWith('.jpg'))
    .map(arquivo => arquivo.toLowerCase())
    .sort();

// Lê os produtos
const produtos = JSON.parse(fs.readFileSync(PRODUTOS_JSON, 'utf8'));

// Extrai as imagens usadas nos produtos
const imagensUsadas = produtos.map(p => {
    const nomeArquivo = path.basename(p.image).toLowerCase();
    return nomeArquivo;
});

console.log('📊 RELATÓRIO DE IMAGENS\n');
console.log(`Total de imagens na pasta: ${imagensDisponiveis.length}`);
console.log(`Total de produtos no JSON: ${produtos.length}`);
console.log(`Total de imagens usadas: ${imagensUsadas.length}\n`);

// Verifica imagens não usadas
const imagensNaoUsadas = imagensDisponiveis.filter(img => !imagensUsadas.includes(img));
if (imagensNaoUsadas.length > 0) {
    console.log('⚠️  IMAGENS NÃO USADAS:');
    imagensNaoUsadas.forEach(img => console.log(`   - ${img}`));
    console.log('');
}

// Verifica se há produtos sem imagem válida
const produtosSemImagem = produtos.filter(p => {
    const nomeArquivo = path.basename(p.image).toLowerCase();
    return !imagensDisponiveis.includes(nomeArquivo);
});

if (produtosSemImagem.length > 0) {
    console.log('❌ PRODUTOS COM IMAGEM INVÁLIDA:');
    produtosSemImagem.forEach(p => console.log(`   - ID ${p.id}: ${p.name} → ${p.image}`));
    console.log('');
}

// Verifica duplicatas
const imagensDuplicadas = imagensUsadas.filter((img, index) => imagensUsadas.indexOf(img) !== index);
if (imagensDuplicadas.length > 0) {
    console.log('⚠️  IMAGENS DUPLICADAS:');
    [...new Set(imagensDuplicadas)].forEach(img => console.log(`   - ${img}`));
    console.log('');
}

if (imagensNaoUsadas.length === 0 && produtosSemImagem.length === 0 && imagensDuplicadas.length === 0) {
    console.log('✅ Tudo correto! Todas as imagens estão mapeadas corretamente.');
} else {
    console.log('\n💡 AÇÕES NECESSÁRIAS:');
    if (imagensNaoUsadas.length > 0) {
        console.log(`   - Adicionar ${imagensNaoUsadas.length} imagem(ns) não usada(s) ao produtos.json`);
    }
    if (produtosSemImagem.length > 0) {
        console.log(`   - Corrigir ${produtosSemImagem.length} produto(s) com imagem inválida`);
    }
}
