import { decode } from 'jsonwebtoken';
import { asyncVerify, asyncSign } from '@weakenedplayer/wrappers';
import { RandomFifo, randomInteger, RandomElement } from '@weakenedplayer/random-generator';

export interface JwtIssuerOption {
    keyLength?: number;
    stock?: number;
    activeStock?: number;
    sequence?: number;
}

export interface JwtOption {
    duration?: number;   // second
}

// aud, isa 等の確認は別途追加

const defaultOption: JwtIssuerOption = {
    keyLength: 16,
    stock: 32,
    activeStock: 16,
    sequence: 128,
}

export class JwtIssuer {
    private keys: RandomFifo;
    private option: JwtIssuerOption;

    constructor( option?: JwtIssuerOption ) {
        if( !option ) {
            option = {};
        }
        this.option = {
            ...defaultOption,
            ...option
        };
        
        this.keys  = new RandomFifo( { length: this.option.keyLength,  bufferSize: this.option.stock, maxSequence: this.option.sequence } );
    }
    
    init(): Promise<void> {
        return this.keys.init().then( ()=>{} );
    }
    
    rotate( count: number ): Promise<void> {
        return this.keys.next( count ).then(()=>{});
    }
    
    sign( data: any ): Promise<string> {
        let index = randomInteger( 0, this.option.activeStock - 1 );
        let key = this.keys.values[ index ];
        if( !key ) {
            throw new Error( 'Key or Hash is not valid.' );
        }
        
        return asyncSign( data, key.value, { keyid: String( key.sequence ) } );
    }
    
    verify( token: string ): Promise<any> {
        let decoded = decode( token ,{ complete: true } );
        let sequence = Number( decoded[ 'header' ][ 'kid' ] );         
        let key = this.keys.find( sequence );
        
        if( !key ) {
            throw new Error( 'Keyid is not valid.' );
        }
        
        return asyncVerify( token, key.value );
    }
}
