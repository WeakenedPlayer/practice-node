import { Request, Response, NextFunction } from 'express';
import * as request from 'request';

export class CaptchaVerifier {
    private urlBase: string;
    constructor( secret: string ) {
        this.urlBase = 'https://www.google.com/recaptcha/api/siteverify?secret=' + secret + '&response=';
    }
    
    verify( captchaResult: string ): Promise<void> {
        return new Promise<void>( ( resolve, reject ) => {
            if( captchaResult === undefined ) {
                reject( 'invalid captcha result.' );
                return;
            }
            
            let url = this.urlBase + captchaResult;
            request( url, ( err, res, body ) => {
                if( err ) {
                    // http error
                    reject( err );
                    return;
                }

                let result = JSON.parse( body );
                if( result[ 'success' ] !== true ) {
                    reject( result[ 'error-codes' ] );
                    return;
                }
                
                resolve();
            } );
        } )
    }
}
