import { Request, Response, NextFunction } from 'express';
import * as request from 'request';

export interface CaptchaMiddlewareOption {
    extract?: ( req: Request ) => string;
    errorHandler?: ( err: string[], req: Request, res: Response ) => void;
}

const defaultOption: CaptchaMiddlewareOption = { 
    extract: ( req: Request ) => { return req.body[ 'captcha' ] },
    errorHandler: ( err: string[], req: Request, res: Response ) => {
        res.status( 400 );
        res.json( { 'error': err } );
    }
}

export class CaptchaMiddleware {
    private urlBase: string;
    private option: CaptchaMiddlewareOption;
    constructor( secret: string, option: CaptchaMiddlewareOption = defaultOption ) {
        this.option = {
            ...defaultOption,
            ...option
        }
        
        this.urlBase = 'https://www.google.com/recaptcha/api/siteverify?secret=' + secret + '&response=';
    }
    
    verifyCaptcha( req: Request, res: Response, next: NextFunction ): void {
        let captch = this.option.extract( req );
        let url = this.urlBase + captch;
        
        request( url, ( err, captchaRes, captchaBody ) => {
            if( err ) {
                this.option.errorHandler( err, req, res );
            }
            let result = JSON.parse( captchaBody );
            if( result[ 'success' ] === true ) {
                next();                
            } else {
                this.option.errorHandler( result[ 'error-codes' ], req, res );
            }
        } );
    }
}
