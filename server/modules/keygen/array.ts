import { OperatorFunction, Observable, Subscription } from 'rxjs';
import { map, toArray, take, skip } from 'rxjs/operators';


export function toRingBuffer<T>( length: number ): OperatorFunction<T, T[]> {
    let i = 0;
    let buf: T[] = new Array( length ).fill( null );
    
    return function impl( src: Observable<T> ) {
        return src.pipe(
            map( val => {
                buf[ i ] = val;
                i++;
                if( i >= length ) {
                    i = 0;
                }
                return buf.concat();
            } ),
            skip( length - 1 )  // wait for buffer to be filled
        );
    };
}

export function toLatestArray<T>( length: number ): OperatorFunction<T, T[]> {
    let i = 0;
    let buf: T[] = new Array( length ).fill( null );
    
    return function impl( src: Observable<T> ) {
        return src.pipe(
            map( val => {
                buf.push( val );
                
                if( buf.length > length ) {
                    buf.shift();
                }
                return buf.concat();
            } ),
            skip( length - 1 )  // wait for buffer to be filled
        );
    };
}
