const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

const IMAGENS_DIR = path.join(__dirname, 'IMAGENS');

// Palavras-chave de produtos comuns para identificar títulos
const palavrasChave = [
    'pano', 'sabonete', 'desengordurante', 'desinfetante', 'água sanitária', 'água-sanitária',
    'cloro', 'amaciante', 'limpa', 'limpeza', 'escova', 'saco de lixo', 'saco-de-lixo',
    'detergente', 'limpador', 'perfumado', 'aromatizador', 'alvejante', 'shampoo',
    'pasta', 'brilho', 'vidros', 'móveis', 'pedras', 'alumínio', 'multi uso', 'multi-uso',
    'pinho', 'gel', 'óleo', 'aromatizador', 'ambiente'
];

// Função para extrair título principal do texto
function extrairTitulo(texto) {
    if (!texto) return null;
    
    // Divide em linhas e remove linhas muito curtas ou com muitos números
    const linhas = texto
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 3 && l.length < 100)
        .filter(l => {
            // Remove linhas com muitos números (provavelmente são lotes, datas, etc)
            const numeros = (l.match(/\d/g) || []).length;
            return numeros < l.length * 0.3;
        });
    
    // Procura por linhas que contenham palavras-chave
    for (const linha of linhas) {
        const linhaLower = linha.toLowerCase();
        for (const palavra of palavrasChave) {
            if (linhaLower.includes(palavra.toLowerCase())) {
                // Pega as primeiras 2-4 palavras dessa linha
                const palavras = linha.split(/\s+/).filter(p => p.length > 1);
                if (palavras.length >= 2) {
                    return palavras.slice(0, 4).join(' ');
                }
            }
        }
    }
    
    // Se não encontrou palavra-chave, pega a primeira linha significativa
    if (linhas.length > 0) {
        const primeira = linhas[0];
        const palavras = primeira.split(/\s+/).filter(p => p.length > 1);
        // Pega apenas as primeiras 3 palavras para evitar texto muito longo
        return palavras.slice(0, 3).join(' ');
    }
    
    return null;
}

// Função para sanitizar o nome do arquivo (remover caracteres inválidos)
function sanitizeFileName(text) {
    if (!text) return 'sem-nome';
    
    // Remove caracteres especiais, números de lote, datas, etc
    let sanitized = text
        .trim()
        .toLowerCase()
        // Remove padrões comuns de lote/data: LOTE: 123, VAL: 123, 15/04/25, etc
        .replace(/\b(lote|val|validade|data):\s*\S+/gi, '')
        .replace(/\d{2}\/\d{2}\/\d{2,4}/g, '') // Remove datas
        .replace(/\d{4,}/g, '') // Remove números longos (provavelmente lotes)
        // Remove caracteres especiais inválidos
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
        .replace(/[»«”“„‚'"]/g, '') // Remove aspas especiais
        .replace(/[^\w\s-áàâãéêíóôõúç]/g, '') // Mantém apenas letras, números, espaços, hífens e acentos
        .replace(/\s+/g, '-') // Substitui espaços por hífen
        .replace(/-+/g, '-') // Remove hífens duplicados
        .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
    
    // Limita o tamanho do nome (máximo 60 caracteres para nomes mais limpos)
    if (sanitized.length > 60) {
        sanitized = sanitized.substring(0, 60);
        // Remove o último hífen se cortou no meio de uma palavra
        sanitized = sanitized.replace(/-+$/, '');
    }
    
    return sanitized || 'sem-nome';
}

// Função para processar uma imagem
async function processarImagem(arquivo) {
    const caminhoCompleto = path.join(IMAGENS_DIR, arquivo);
    const extensao = path.extname(arquivo);
    
    console.log(`\n📸 Processando: ${arquivo}`);
    
    try {
        // Faz OCR na imagem
        const { data: { text } } = await Tesseract.recognize(caminhoCompleto, 'por', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    process.stdout.write(`\r   Progresso: ${Math.round(m.progress * 100)}%`);
                }
            }
        });
        
        // Limpa o texto extraído
        const textoLimpo = text.trim();
        
        if (!textoLimpo || textoLimpo.length < 2) {
            console.log(`\n   ⚠️  Não foi possível extrair texto. Mantendo nome original.`);
            return;
        }
        
        // Extrai o título principal usando palavras-chave
        const titulo = extrairTitulo(textoLimpo);
        const nomeArquivo = sanitizeFileName(titulo || textoLimpo);
        const novoNome = `${nomeArquivo}${extensao}`;
        const novoCaminho = path.join(IMAGENS_DIR, novoNome);
        
        // Verifica se já existe um arquivo com esse nome
        let nomeFinal = novoNome;
        let contador = 1;
        while (fs.existsSync(path.join(IMAGENS_DIR, nomeFinal)) && nomeFinal !== arquivo) {
            const nomeSemExt = nomeArquivo;
            nomeFinal = `${nomeSemExt}-${contador}${extensao}`;
            contador++;
        }
        
        // Renomeia o arquivo
        if (nomeFinal !== arquivo) {
            fs.renameSync(caminhoCompleto, path.join(IMAGENS_DIR, nomeFinal));
            console.log(`\n   ✅ Renomeado para: ${nomeFinal}`);
            console.log(`   📝 Texto extraído: "${textoLimpo.substring(0, 80)}${textoLimpo.length > 80 ? '...' : ''}"`);
        } else {
            console.log(`\n   ℹ️  Nome já está correto ou similar.`);
        }
        
    } catch (error) {
        console.error(`\n   ❌ Erro ao processar ${arquivo}:`, error.message);
    }
}

// Função principal
async function main() {
    console.log('🚀 Iniciando renomeação de imagens usando OCR...\n');
    console.log(`📁 Pasta: ${IMAGENS_DIR}\n`);
    
    // Lista todos os arquivos .jpeg
    const arquivos = fs.readdirSync(IMAGENS_DIR)
        .filter(arquivo => arquivo.toLowerCase().endsWith('.jpeg') || arquivo.toLowerCase().endsWith('.jpg'));
    
    if (arquivos.length === 0) {
        console.log('❌ Nenhuma imagem .jpeg encontrada na pasta IMAGENS!');
        return;
    }
    
    console.log(`📊 Total de imagens encontradas: ${arquivos.length}\n`);
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Processa cada imagem
    for (let i = 0; i < arquivos.length; i++) {
        console.log(`\n[${i + 1}/${arquivos.length}]`);
        await processarImagem(arquivos[i]);
    }
    
    console.log('\n\n═══════════════════════════════════════════════════════');
    console.log('✨ Processamento concluído!');
    console.log('═══════════════════════════════════════════════════════\n');
}

// Executa o script
main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
});
