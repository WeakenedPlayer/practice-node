import * as request from 'request';
import { INotifier, INotifierProvider } from './types';

const baseUrl = 'https://discordapp.com/api/webhooks';
const header = {
    'Content-type': 'application/json',
}

export class DiscordWebhookNotifier implements INotifier {
    private url: string;
    private header: string;
    constructor( id: string, token: string ) {
        this.url = [ baseUrl, id, token ].join('/');
    }

    notify( message: string ): Promise<void> {
        let option = {
            url: this.url,
            header: header,
            json: {
                'content': message,
            }
        };
        return new Promise( ( resolve, reject ) => {
            request.post( option, ( err, res, body ) => {
                if( err ) {
                    reject( err );
                    return;
                }
                console.log( res );
                console.log( body );
                resolve();
            } );
        } );
    }
}

export class DiscordWebhookNotifierProvider implements INotifierProvider {
    constructor() {}
    
    provide( param: any ): Promise<INotifier> {
        let id: string = param.string;
        let token: string = param.token;
        let notifier: INotifier;
        if( !id || !token ) {
            return Promise.reject( 'ID and/or Token are not supplied.' );
        }
        
        return Promise.resolve( new DiscordWebhookNotifier( id, token ) );
    }
}

