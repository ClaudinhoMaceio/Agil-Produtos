const fs = require('fs');
const path = require('path');

const PRODUTOS_JSON = path.join(__dirname, 'produtos.json');

// Simula o carrinho com alguns produtos
const produtos = JSON.parse(fs.readFileSync(PRODUTOS_JSON, 'utf8'));

console.log('📱 TESTE DE MENSAGEM DO WHATSAPP\n');
console.log('═══════════════════════════════════════════════════\n');

// Simula um carrinho com alguns produtos
const carrinhoTeste = [
    { ...produtos[0], quantity: 2 },  // Alvejante Sem Cloro x2
    { ...produtos[1], quantity: 1 },  // Amaciante De Roupa x1
    { ...produtos[5], quantity: 3 },  // Cloro x3
];

console.log('🛒 Carrinho de Teste:\n');
carrinhoTeste.forEach(item => {
    console.log(`   ${item.quantity}x - ${item.name}`);
});
console.log('');

// Gera a mensagem como no código
let message = "*NOVO PEDIDO - AGIL PRODUTOS*\n";
message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
message += "Olá! Gostaria de encomendar os seguintes produtos:\n\n";

carrinhoTeste.forEach((item) => {
    const productName = item.name || 'Produto';
    const cleanName = productName.trim();
    message += `📦 *${item.quantity}x* ${cleanName}\n`;
});

message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
message += `*Total de Itens:* ${carrinhoTeste.reduce((sum, i) => sum + i.quantity, 0)}\n\n`;
message += "As imagens dos produtos estão visíveis no catálogo.\n\n";
message += "Qual o valor total e o prazo de entrega para o meu endereço?";

console.log('📝 MENSAGEM QUE SERÁ ENVIADA:\n');
console.log('═══════════════════════════════════════════════════');
console.log(message);
console.log('═══════════════════════════════════════════════════\n');

// Verifica se há problemas com os nomes
console.log('🔍 VERIFICAÇÃO DE NOMES:\n');
let problemas = 0;

produtos.forEach((produto, index) => {
    if (!produto.name || produto.name.trim() === '') {
        console.log(`❌ Produto ID ${produto.id}: Nome vazio ou inválido`);
        problemas++;
    } else if (produto.name.includes('Produto de Limpeza') || produto.name.includes('Produto de LimpezaL')) {
        console.log(`⚠️  Produto ID ${produto.id}: Nome genérico "${produto.name}"`);
        problemas++;
    }
});

if (problemas === 0) {
    console.log('✅ Todos os nomes estão corretos!');
} else {
    console.log(`\n⚠️  ${problemas} produto(s) com nomes que precisam ser corrigidos.`);
}

console.log('\n═══════════════════════════════════════════════════\n');
