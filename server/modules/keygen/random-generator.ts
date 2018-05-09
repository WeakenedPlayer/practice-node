import { Observable, Subject } from 'rxjs';
import * as crypto from 'crypto';

// 乱数の生成 (cryptoのラッパー)

export class RandomGenerator {
    private bufSubject: Subject<Buffer> = new Subject();

    next( length: number ): void {
        crypto.randomBytes( length, ( err: Error, buf: Buffer ) => {
            if( err ) {
                this.bufSubject.error( err );
            }
            this.bufSubject.next( buf );
        } );
    }

    get random$(): Observable<Buffer> {
        return this.bufSubject;
    }
}
