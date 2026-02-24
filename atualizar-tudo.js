const fs = require('fs');
const path = require('path');

const IMAGENS_DIR = path.join(__dirname, 'IMAGENS');
const PRODUTOS_JSON = path.join(__dirname, 'produtos.json');

// Função para converter nome de arquivo em nome de produto
function nomeArquivoParaNomeProduto(nomeArquivo) {
    // Remove a extensão
    let nome = nomeArquivo.replace(/\.(jpeg|jpg)$/i, '');
    
    // Substitui hífens e underscores por espaços
    nome = nome.replace(/[-_]/g, ' ');
    
    // Se está tudo em maiúsculas, converte para formato título
    if (nome === nome.toUpperCase() && nome !== nome.toLowerCase()) {
        // Está em maiúsculas, converte para título
        nome = nome.toLowerCase()
            .split(' ')
            .map(palavra => {
                // Mantém palavras curtas em minúsculas (de, da, do, etc)
                const palavrasPequenas = ['de', 'da', 'do', 'e', 'o', 'a', 'em', 'no', 'na', 'para'];
                if (palavrasPequenas.includes(palavra.toLowerCase()) && nome.split(' ').indexOf(palavra) > 0) {
                    return palavra.toLowerCase();
                }
                return palavra.charAt(0).toUpperCase() + palavra.slice(1);
            })
            .join(' ');
    } else {
        // Já está em formato misto, apenas capitaliza
        nome = nome.split(' ')
            .map(palavra => {
                const palavrasPequenas = ['de', 'da', 'do', 'e', 'o', 'a', 'em', 'no', 'na', 'para'];
                if (palavrasPequenas.includes(palavra.toLowerCase()) && nome.split(' ').indexOf(palavra) > 0) {
                    return palavra.toLowerCase();
                }
                return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
            })
            .join(' ');
    }
    
    return nome;
}

// Lê todas as imagens disponíveis
const imagensDisponiveis = fs.readdirSync(IMAGENS_DIR)
    .filter(arquivo => {
        const lower = arquivo.toLowerCase();
        return (lower.endsWith('.jpeg') || lower.endsWith('.jpg')) && lower !== 'logo.jpeg';
    })
    .sort();

console.log('🔄 Atualizando produtos.json com as imagens e nomes...\n');
console.log(`📸 Total de imagens encontradas: ${imagensDisponiveis.length}\n`);

// Cria array de produtos atualizado
const produtosAtualizados = imagensDisponiveis.map((imagem, index) => {
    const nomeArquivo = path.basename(imagem, path.extname(imagem));
    const nomeProduto = nomeArquivoParaNomeProduto(nomeArquivo);
    
    return {
        id: index + 1,
        name: nomeProduto,
        category: "Limpeza", // Categoria padrão, pode ser ajustada depois
        image: `IMAGENS/${imagem}`
    };
});

// Salva o arquivo atualizado
fs.writeFileSync(PRODUTOS_JSON, JSON.stringify(produtosAtualizados, null, 4), 'utf8');

console.log('✅ Produtos atualizados com sucesso!\n');
console.log('📋 Resumo:');
console.log(`   - Total de produtos: ${produtosAtualizados.length}`);
console.log(`   - Arquivo salvo: ${PRODUTOS_JSON}\n`);

console.log('📝 Primeiros 10 produtos:');
produtosAtualizados.slice(0, 10).forEach((produto, i) => {
    console.log(`   ${i + 1}. ${produto.name} → ${produto.image}`);
});

if (produtosAtualizados.length > 10) {
    console.log(`   ... e mais ${produtosAtualizados.length - 10} produtos`);
}

console.log('\n✨ Atualização concluída!');
