import { OperatorFunction, Observable, Subscription } from 'rxjs';
import { map, toArray, take, skip } from 'rxjs/operators';

export interface RandomElement {
    readonly sequence: number;
    readonly value: Buffer;
}

export function repeatPromise<T>( n: number, defer: () => Promise<T> ): Promise<T> {
    let loop: ( k: number ) => Promise<T> = ( k ) => {
        if( k > 0 ) {
            k--;
            return defer().then( () => loop( k ) );
        }
    }
    return loop( n );
}

export function randomInteger( from: number, to: number ) {
    let delta = to - from;
    let result = Math.round( from + Math.random() * delta );
    return result;
}