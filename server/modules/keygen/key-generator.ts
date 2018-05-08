import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import * as crypto from 'crypto';
import { RandomGenerator } from './random-generator';

const DEFAULT_LENGTH = 10;
const DEFAULT_SEQUENCE = 16;

// 鍵と番号のセットを作るだけ

export interface KeyGeneratorOption {
    length?: number;
    period?: number;
    maxSequence?: number;
}

export interface Key {
    readonly createdAt: number;
    readonly sequence: number;
    readonly body: Buffer;
}

export class KeyGenerator {
    private randomGenerator: RandomGenerator = new RandomGenerator();
    private keyGenerationObservable: Observable<Key>;
    private index: number = 0;
    private sequence: number = 0;

    // parameters
    private length: number;
    private period: number;
    private maxSequence: number;

    // ------------------------------------------------------------------------
    private nextKey( body: Buffer ): Key {
        let sequence = this.sequence;
        let key: Key = {
            createdAt: Date.now(),
            sequence: this.sequence,
            body: body
        };
        
        sequence++;
        if( sequence >= this.maxSequence ) {
            sequence = 0;
        }
        return key;
    }
    
    constructor( option?: KeyGeneratorOption ) {
        if( !option ) {
            option = {};
        }
        
        this.length = option.length || DEFAULT_LENGTH;
        this.maxSequence = option.maxSequence || DEFAULT_SEQUENCE;
        
        // create observable 
        this.keyGenerationObservable = this.randomGenerator.random$
        .pipe(
            map( random => this.nextKey( random ) )
        );
    }
    // ------------------------------------------------------------------------
    reset(): void {
        this.index = 0;
        this.sequence = 0;
    }

    // ------------------------------------------------------------------------
    next(): void {
        this.randomGenerator.next( this.length );
    }

    // ------------------------------------------------------------------------
    get key$(): Observable<Key> {
        return this.keyGenerationObservable;
    }
}

