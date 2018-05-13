import { Observable, Subject } from 'rxjs';
import { map, tap, take, shareReplay, share } from 'rxjs/operators';
import { RandomSequence , RandomSequenceOption } from './random-sequence';
import { RandomElement, repeatPromise } from './common';


export class RandomArrayBase {
    private randomSeq: RandomSequence;
    private array: RandomElement[] = [];
    private latest: RandomElement = null;
    
    constructor( private store: ( array: RandomElement[], element: RandomElement ) => void, option?: RandomSequenceOption ) {
        this.randomSeq = new RandomSequence( option );
    }
    
    next( n: number = 1 ): Promise<RandomElement[]> {
        return repeatPromise( n, () => {
            return this.randomSeq.next().then( value => {
                this.latest = value;
                return this.store( this.array, value );
            } ).then( () => this.array );
        } );
    }
    
    get values(): RandomElement[] {
        return this.array; // not copy
    }
    
    get latestValue(): RandomElement {
        return this.latest;
    }
    
    find( sequence: number ): RandomElement {
        return this.array.find( r => r.sequence === sequence );
    }
}

export interface RandomBufferOption extends RandomSequenceOption {
    bufferSize?: number;
}

const defaultOption:RandomBufferOption = {
    bufferSize: 16
}

export class RandomBuffer extends RandomArrayBase {
    protected option: RandomBufferOption;
    constructor( store: ( array: RandomElement[], element: RandomElement ) => void, option?: RandomBufferOption ) {
        super( store, option );

        if( !option ) {
            option = {};
        }
        
        this.option = {
            ...defaultOption,
            ...option
        }
    }
    
    init(): Promise<RandomElement[]> {
        return this.next( this.option.bufferSize ).then( () => this.values );
    }
}

export class RandomRingBuffer extends RandomBuffer {
    private index = 0;
    constructor( option?: RandomBufferOption ) {
        super( ( array, element ) => {
            let last = array[ this.index ];
            array[ this.index ] = element;
            this.index++;
            if( this.index >= this.option.bufferSize ) {
                this.index = 0;
            }
        }, option );
    }
}

export class RandomFifo extends RandomBuffer {
    constructor( option?: RandomBufferOption ) {
        super( ( array, element ) => {
            let last: RandomElement;
            array.unshift( element );
            if( array.length > this.option.bufferSize ) {
                last = array.pop();
            }
        }, option );
    }
}

