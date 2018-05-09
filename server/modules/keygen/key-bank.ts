import { Observable, Subject } from 'rxjs';
import { map, tap, publishReplay, flatMap, toArray } from 'rxjs/operators';
import { KeyGenerator, KeyGeneratorOption, Key } from './key-generator';
import { toLatestArray } from './array';

const DEFAULT_STOCK = 16;

export interface KeyBankOption extends KeyGeneratorOption {
    readonly stock?: number;
}

export class KeyBank {
    private keyGen: KeyGenerator;
    private generateObservable: Observable<void>;
    private bankObservable: Observable<Key[]>;
    private stock: number;

    constructor( option?: KeyBankOption ) {
        if( !option ) {
            option = {};
        }
        this.stock = option.stock || DEFAULT_STOCK;
        this.keyGen = new KeyGenerator( option );
        
        this.bankObservable = this.keyGen.key$.pipe( toLatestArray( this.stock ) );
    }
    
    next(): void {
        this.keyGen.next();
    }
    
    get keys$(): Observable<Key[]> {
        return this.bankObservable;
    }
}
