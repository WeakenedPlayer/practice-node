import { Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const url = 'https://apis.google.com/js/platform.js';
declare let gapi: any;

export class GoogleSigninServiceConfig {
    clientId: string;
} 

@Injectable()
export class GoogleSigninService {
    private _loaded: BehaviorSubject<boolean> = new BehaviorSubject( false );
    get loaded$(): Observable<boolean> {
        return this._loaded;
    }

    constructor( private config: GoogleSigninServiceConfig ) {
        if( !config ) {
            throw new Error( '[Error] Google Sign-in Service requires configuration.' );
        }
        this.loadScript();
    }

    private loadScript() {
        let script = document.createElement( 'script' );
        script.src = url;
        script.type = 'text/javascript';
        script.async = true;
        script.charset = 'utf-8';
        script.onload = () => { this.onLoad() };
        document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );
    }
    
    private onLoad() {
        gapi.load('auth2', () => {
            gapi.auth2.init( { 'client_id': this.config.clientId } );
            this._loaded.next( true );
        } );
    }
    
    render( element: any, options?: any ) {
        if( !options ) {
            options = {};
        }
        gapi.signin2.render( element, {
            ...options,
            'accesstype': 'online',
            'onsuccess': ( user ) => { 
                console.log( user );
            },
            'onfailure': ( user ) => { console.log( 'failed' ) }
        } );
    }
}
