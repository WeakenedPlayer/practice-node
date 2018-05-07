import { Injectable, Optional, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap, take, filter, share } from 'rxjs/operators';
import { GoogleAuth } from './auth';

declare const gapi: any;
const url = 'https://apis.google.com/js/platform.js';

// need to be class (not interface) to resolve
export class GoogleSigninClientConfig implements gapi.auth2.ClientConfig {}

@Injectable()
export class GoogleSigninService {
    private authSubject: BehaviorSubject<GoogleAuth> = new BehaviorSubject( null );
    get auth$(): Observable<GoogleAuth> {
        return this.authSubject;
    }
    
    private _ready$: Observable<boolean>;
    get ready$(): Observable<boolean> {
        return this._ready$;
    }
    
    private _auth: GoogleAuth = null;
    get auth(): GoogleAuth {
        return this._auth;
    }

    constructor( private config: GoogleSigninClientConfig, private zone: NgZone ) {
        if( !config ) {
            throw new Error( '[Error] Google Sign-in Service requires configuration.' );
        }
        
        this._ready$ = this.authSubject.pipe(
            map( auth => auth !== null ),
            share()
        );
        
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
            gapi.auth2.init( this.config )
            .then( ( auth: gapi.auth2.GoogleAuth ) => {
                // Google Auth is initialized
                this._auth = new GoogleAuth( auth, this.zone );
                
                // https://stackoverflow.com/questions/41224671/angular-2-change-detection-with-observables
                this.zone.run( () => this.authSubject.next( this._auth ) );
            }, ( err ) => {
                // Google Auth failed to initialize.
                console.error( '[GoogleAuth] Failed to initialize.' );
                console.error( err );
                this._auth = null;
                this.authSubject.error( err );
            } )
        } );
    }
    
    waitAuthReady(): Promise<GoogleAuth> {
        return this.authSubject.pipe(
            filter( auth => auth !== null ),
            take( 1 )
        ).toPromise();
    }
}
