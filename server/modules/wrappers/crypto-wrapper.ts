import { Observable, Subject } from 'rxjs';
import * as crypto from 'crypto';
// crypt wrapper

export function asyncRandomBytes( length: number ): Promise<Buffer> {
    return new Promise( ( resolve, reject ) => {
        crypto.randomBytes( length, ( err: Error, buf: Buffer ) => {
            if( err ) {
                reject( err );
            }
            resolve( buf );
        } );
    } );
}

export class RandomBytes {
    private bufSubject: Subject<Buffer> = new Subject();

    next( length: number ): void {
        crypto.randomBytes( length, ( err: Error, buf: Buffer ) => {
            if( err ) {
                this.bufSubject.error( err );
            }
            this.bufSubject.next( buf );
        } );
    }

    get value$(): Observable<Buffer> {
        return this.bufSubject;
    }
}
