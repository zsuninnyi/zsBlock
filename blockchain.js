const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
        this.lastBlock;
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.getLastblock(),
            data,
        });

        this.chain.push(newBlock);
    }

    getLastblock() {
        return this.chain[this.chain.length - 1];
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer');
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid');
            return;
        }
        console.log('replacing chain with', chain)
        this.chain = chain;
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];

            const lastBlock = chain[i - 1];

            const actualLasthHash = lastBlock.hash;

            const { timestamp, lastHash, hash, data } = block;

            if (lastHash !== actualLasthHash) {
                return false;
            }

            const validatedHash = cryptoHash(timestamp, lastHash, data);

            if (hash !== validatedHash) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Blockchain;
