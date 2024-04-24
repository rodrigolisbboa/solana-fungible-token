import { Keypair, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import * as fs from 'fs';
import bs58 from 'bs58';

// PASSO 1 - Conecte-se à Rede Solana
const endpoint = 'https://api.devnet.solana.com';
const solanaConnection = new Connection(endpoint);

// PASSO 2 - Gerar uma nova carteira Solana
const keypair = Keypair.generate();
console.log(`Gerado novo Par de Chaves. Chave Publica da Carteira: `, keypair.publicKey.toString());

// PASSO 3: Converter Chave Privada para Base58
const privateKey = bs58.encode(keypair.secretKey);
console.log(`Chave Privada da Carteira:`, privateKey);

// PASSO 4: Escrever a Chave Privada para um .JSON
const secret_array = keypair.secretKey
    .toString() // converte a chave privada para string
    .split(',') // delimita string por vírgulas e converte em um array de strings
    .map(value=>Number(value)); // converte valores de string em numeros dentro do array

const secret = JSON.stringify(secret_array); // Converte o array em uma string JSON

fs.writeFile('guideSecret.json', secret, 'utf8', function(err) {
    if (err) throw err;
    console.log('Escreveu a chave privada em guideSecret.json.');
});

// PASSO 5 - Airdrop de 1 SOL para a nova Carteira
(async()=>{
    const airdropSignature = await solanaConnection.requestAirdrop(
        keypair.publicKey,
        LAMPORTS_PER_SOL
    );

    try{
        const txId = await airdropSignature;
        console.log(`ID da Transação Airdrop: ${txId}`);
        console.log(`https://explorer.solana.com/tx/${txId}?cluster=devnet`)
    } 
    catch(err){
        console.log(err);
    }
})()


