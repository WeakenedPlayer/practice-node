import { createHash } from 'crypto';
import * as JWT from 'jsonwebtoken';

import { asyncVerify, asyncSign } from '@weakenedplayer/wrappers';
import { RandomFifo, randomInteger, RandomElement } from '@weakenedplayer/random-generator';

export interface PassphraseVerifierOption {
    saltLength?: number;
    stock?: number;
    activeStock?: number;
    sequence?: number;
}

const defaultOption: PassphraseVerifierOption = {
    stock: 32,
    activeStock: 16,
    sequence: 128,
    saltLength: 32
}

export interface HashedPassphrase {
    sequence: number;
    hash: string;
}

export class PassphraseVerifier {
    private salts: RandomFifo;
    private option: PassphraseVerifierOption;
    
    constructor( option: PassphraseVerifierOption = defaultOption ) {
        this.option = {
            ...defaultOption,
            ...option
        };
        this.salts = new RandomFifo( { length: this.option.saltLength, bufferSize: this.option.stock, maxSequence: this.option.sequence } );
    }
 
    init(): Promise<void> {
        return this.salts.init().then( () => {} );
    }
    
    rotate( count: number ): Promise<void> {
        return this.salts.next( count ).then( () => {} );
    }
    
    protected calc( passphrase: string | Buffer, salt: string | Buffer ): string {
        let hash = createHash( 'sha512' );
        hash.update( salt );
        hash.update( passphrase );
        hash.update( salt );
        return hash.digest( 'base64' );
    }

    hash( passphrase: string | Buffer ): HashedPassphrase {
        let index = randomInteger( 0, this.option.activeStock - 1 );
        let salt = this.salts.values[ index ];
        let hash = this.calc(  passphrase, salt.value );
        
        return { sequence: salt.sequence, hash: hash };
    }

    verify( passphrase: string, hash: string, sequence: number ): Promise<void> {
        return new Promise( ( resolve, reject ) => {
            let salt = this.salts.find( sequence );
            if( !salt ) {
                reject( 'Cannot find salt.' );
                return;
            }
            let expectedHash = this.calc( passphrase, salt.value );
            
            if( expectedHash !== hash ) {
                reject( 'unmatch' );
                return;
            }
            resolve();
        } )
    }
}
