import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { KeyGenerator, KeyGeneratorOption, Key } from './key-generator';

const DEFAULT_STOCK = 16;

export interface KeyBankOption extends KeyGeneratorOption {
    readonly stock?: number;
}

export class KeyBank {
    private keyGen: KeyGenerator;
    private generateObservable: Observable<void>;
    private bankObservable: Observable<Key[]>;
    private keys: Key[] = [];

    private stock: number;

    constructor( private scheduler: Observable<void>, option?: KeyBankOption ) {
        if( !option ) {
            option = {};
        }
        this.stock = option.stock || DEFAULT_STOCK;
        this.keyGen = new KeyGenerator( option );
        
        this.generateObservable = this.scheduler
        .pipe(
            tap( () => {
                this.keyGen.next();
            } )
        );
        
        this.bankObservable = this.keyGen.key$.pipe(
            map( key => { 
                this.keys.push( key );
                if( this.keys.length >= this.stock ) {
                    this.keys.shift();
                }
                
                return this.keys;
            } )
        );
    }
    
    find( sequence: number ): Key {
        return this.keys.find( key => key.sequence === sequence );
    }
}