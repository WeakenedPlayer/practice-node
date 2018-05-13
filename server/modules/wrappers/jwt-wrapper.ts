import { Observable, Subject } from 'rxjs';
import * as JWT from 'jsonwebtoken';

export function asyncSign( payload: string | object | Buffer, key: JWT.Secret, option?: JWT.SignOptions ): Promise<string> {
    return new Promise( ( resolve, reject ) => {
        JWT.sign( payload, key, option, ( err: Error, token: string ) => {
            if( err ) {
                reject( err );
            }
            resolve( token );
        } );
    } );
}

export function asyncVerify( token: string, key: string | Buffer, option?: JWT.VerifyOptions ): Promise<string | object> {
    return new Promise( ( resolve, reject ) => {
        JWT.verify( token, key, option, ( err: Error, decoded: string | object) => {
            if( err ) {
                reject( err );
            }
            resolve( decoded );
        } );
    } ); 
}
