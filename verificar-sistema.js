const fs = require('fs');
const path = require('path');

const IMAGENS_DIR = path.join(__dirname, 'IMAGENS');
const PRODUTOS_JSON = path.join(__dirname, 'produtos.json');

console.log('🔍 VERIFICAÇÃO COMPLETA DO SISTEMA\n');
console.log('═══════════════════════════════════════════════════\n');

// 1. Verificar produtos.json
console.log('1️⃣ Verificando produtos.json...');
let produtos = [];
try {
    const jsonContent = fs.readFileSync(PRODUTOS_JSON, 'utf8');
    produtos = JSON.parse(jsonContent);
    console.log(`   ✅ JSON válido - ${produtos.length} produtos encontrados\n`);
} catch (error) {
    console.log(`   ❌ ERRO: ${error.message}\n`);
    process.exit(1);
}

// 2. Verificar imagens na pasta
console.log('2️⃣ Verificando imagens na pasta IMAGENS...');
const imagensDisponiveis = fs.readdirSync(IMAGENS_DIR)
    .filter(arquivo => {
        const lower = arquivo.toLowerCase();
        return (lower.endsWith('.jpeg') || lower.endsWith('.jpg')) && lower !== 'logo.jpeg';
    })
    .map(arquivo => arquivo);

console.log(`   ✅ ${imagensDisponiveis.length} imagens encontradas\n`);

// 3. Verificar correspondência
console.log('3️⃣ Verificando correspondência entre produtos e imagens...');
let problemas = 0;
const imagensLower = imagensDisponiveis.map(img => img.toLowerCase());

produtos.forEach(produto => {
    const nomeArquivo = path.basename(produto.image);
    const existe = imagensLower.includes(nomeArquivo.toLowerCase());
    
    if (!existe) {
        console.log(`   ❌ Produto ID ${produto.id}: "${produto.name}"`);
        console.log(`      Imagem não encontrada: ${nomeArquivo}`);
        problemas++;
    }
});

if (problemas === 0) {
    console.log(`   ✅ Todas as ${produtos.length} imagens estão corretas!\n`);
} else {
    console.log(`   ⚠️  ${problemas} problema(s) encontrado(s)\n`);
}

// 4. Verificar estrutura do JSON
console.log('4️⃣ Verificando estrutura dos produtos...');
let estruturaOk = true;
produtos.forEach((produto, index) => {
    if (!produto.id || !produto.name || !produto.image || !produto.category) {
        console.log(`   ❌ Produto ${index + 1} está incompleto`);
        estruturaOk = false;
    }
});

if (estruturaOk) {
    console.log(`   ✅ Estrutura de todos os produtos está correta!\n`);
} else {
    console.log(`   ⚠️  Alguns produtos têm estrutura incompleta\n`);
}

// 5. Verificar index.html
console.log('5️⃣ Verificando index.html...');
const indexPath = path.join(__dirname, 'index.html');
if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    if (indexContent.includes('encodeImagePath') && indexContent.includes('loadProducts')) {
        console.log(`   ✅ index.html parece estar correto!\n`);
    } else {
        console.log(`   ⚠️  index.html pode ter problemas\n`);
    }
} else {
    console.log(`   ❌ index.html não encontrado!\n`);
}

// Resumo final
console.log('═══════════════════════════════════════════════════════');
console.log('📊 RESUMO FINAL:\n');
console.log(`   ✅ Produtos: ${produtos.length}`);
console.log(`   ✅ Imagens: ${imagensDisponiveis.length}`);
console.log(`   ${problemas === 0 ? '✅' : '⚠️ '} Problemas: ${problemas}\n`);

if (problemas === 0 && estruturaOk) {
    console.log('🎉 SISTEMA PRONTO PARA PUBLICAÇÃO!\n');
    console.log('📝 Próximos passos:');
    console.log('   1. Faça upload de todos os arquivos para o servidor');
    console.log('   2. Certifique-se de que a estrutura de pastas está correta');
    console.log('   3. Teste em um navegador');
    console.log('   4. Verifique se todas as imagens carregam\n');
} else {
    console.log('⚠️  CORRIJA OS PROBLEMAS ANTES DE PUBLICAR\n');
}
