import { asyncVerify, asyncSign } from '@weakenedplayer/wrappers';
import * as JWT from 'jsonwebtoken';
import { createHash } from 'crypto';
import { RandomFifo, randomInteger, RandomElement } from '@weakenedplayer/random-generator';
import { JwtIssuer, JwtIssuerOption } from './jwt-issuer';

export interface JwtWithPassphraseOption extends JwtIssuerOption {
    saltLength?: number;
}

const defaultOption: JwtWithPassphraseOption = {
    keyLength: 16,
    stock: 32,
    activeStock: 16,
    sequence: 128,
    saltLength: 16
}

export class JwtWithPassphraseIssuer {
    private issuer: JwtIssuer;
    private salts: RandomFifo;
    private option: JwtWithPassphraseOption;
    
    constructor( option?: JwtWithPassphraseOption ) {
        this.issuer = new JwtIssuer( option );
        this.option = {
            ...defaultOption,
            ...( option || {} )
        };
        this.salts = new RandomFifo( { length: this.option.saltLength, bufferSize: this.option.stock, maxSequence: this.option.sequence } );
    }
 
    init(): Promise<void> {
        return Promise.all( [ this.issuer.init(),
                              this.salts.init() ] ).then( () => {} );
    }
    
    rotate( count: number ): Promise<void> {
        return Promise.all( [ this.issuer.rotate( count ),
                              this.salts.next( count ) ] ).then( () => {} );
    }
    
    protected hash( passphrase: string | Buffer, salt: string | Buffer ): string {
        let hash = createHash( 'sha512' );
        hash.update( salt );
        hash.update( passphrase );
        hash.update( salt );
        return hash.digest( 'base64' );
    }
    
    sign( data: any, passphrase: string | Buffer ): Promise<string> {
        let index = randomInteger( 0, this.option.activeStock - 1 );
        let salt = this.salts.values[ index ];
        
        console.log( index );
        let hash = this.hash(  passphrase, salt.value );
        return this.issuer.sign( { 'd': data, 's': salt.sequence, 'h': hash } );
    }
    
    verify( token: string, passphrase: string ) {
        return this.issuer.verify( token )
        .then( decoded => {
            let expectedHash = decoded[ 'h' ];
            if( !expectedHash ) {
                throw new Error( 'Hash doesn\'t exist.' );
            }
            
            let sequence = Number( decoded[ 's' ] );
            if( isNaN( sequence ) ) {
                throw new Error( 'Salt sequence doesn\'t exist.' );
            }
            
            let salt = this.salts.find( sequence );
            if( !salt ) {
                throw new Error( 'Cannot find salt.' );
            }
            
            let receivedHash = this.hash( passphrase, salt.value );
            if( expectedHash !== receivedHash ) {
                throw new Error( 'Passphrase unmatch.' );
            }
            
            let data = decoded[ 'd' ];
            return Promise.resolve( data );
        } );
    }
}
