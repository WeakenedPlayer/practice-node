import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { asyncRandomBytes } from '@weakenedplayer/wrappers';
import { RandomElement } from './common';

export interface RandomSequenceOption {
    length?: number;
    maxSequence?: number;
}

const defaultOption: RandomSequenceOption = {
    length: 16,
    maxSequence: 128,
}

export class RandomSequence {
    private index: number;
    private sequence: number;
    private option: RandomSequenceOption;

    constructor( option?: RandomSequenceOption ) {
        if( !option ) {
            option = {};
        }
        this.option = {
            ...defaultOption,
            ...option
        }
        this.reset();
    }
    // ------------------------------------------------------------------------
    private reset(): void {
        this.index = 0;
        this.sequence = 0;
    }
    
    private incrememt(): void {
        this.sequence++;
        if(  this.sequence >= this.option.maxSequence ) {
            this.sequence = 0;
        }
    }
    // ------------------------------------------------------------------------
    next(): Promise<RandomElement> {
        return asyncRandomBytes( this.option.length )
        .then( random => {
            let sequence = this.sequence;
            this.incrememt();
            
            return {
                sequence: sequence,
                value: random
            };
        } );
    }
}

