import {percentAmount, generateSigner, signerIdentity, createSignerFromKeypair} from '@metaplex-foundation/umi';
import {TokenStandard, createAndMint} from '@metaplex-foundation/mpl-token-metadata';
import {createUmi} from '@metaplex-foundation/umi-bundle-defaults';
import {mplCandyMachine} from '@metaplex-foundation/mpl-candy-machine';
import "@solana/web3.js";
import secret from './guideSecret.json';

// PASSO 1 - ESTABELEÇA CONEXÃO COM A REDE SOLANA
const umi = createUmi('https://api.devnet.solana.com');

// PASSO 2 - INICIALIZE A CARTEIRA A PARTIR DA CHAVE PRIVADA
const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

// PASSO 3 - CRIANDO A VARIAVEL DE METADADOS DO TOKEN
const metadata = {
    name: "BOOK OF AI",
    symbol: "BOAI",
    uri: "https://ipfs.io/ipfs/QmeboX4WgamUZ3niKa9uryas2axz5U4BzrodH8XwBLDD1A",
};

// PASSO 4 - CRIANDO O PDA
const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplCandyMachine());

// PASSO 5 - FUNÇÃO PARA IMPLANTAR MINT PDA E MINT TOKENS
createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 8,
    amount: 1000000_00000000,
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
}).sendAndConfirm(umi).then(() => {
    console.log("Cunhado com Sucesso 1 milhão de tokens (", mint.publicKey, ")");
});
