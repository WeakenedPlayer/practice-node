// 注意: Angular外のイベントを扱うため NgZoneを使用し、変更を検出できるようにしている

import { NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
declare const gapi: any;

export class GoogleAuth {
    private isSignedInSubject$: BehaviorSubject<boolean> = new BehaviorSubject( false );
    get isSignedIn$(): Observable<boolean> { return this.isSignedInSubject$ }

    constructor( private auth: gapi.auth2.GoogleAuth, private zone: NgZone ) {
        this.isSignedInSubject$.next( this.auth.isSignedIn.get() );
        this.auth.isSignedIn.listen( ( isSignedIn: boolean ) => {
            this.zone.run( () => this.isSignedInSubject$.next( isSignedIn ) );
        } );
    }
    
    signIn( options?: gapi.auth2.SigninOptions ): Promise<gapi.auth2.GoogleUser> {
        return this.auth.signIn( options );
    }
    
    signOut(): Promise<void> {
        return this.auth.signOut();
    }
    
    disconnect(): void {
        this.auth.disconnect();
    }

    grantOfflineAccess( options?: gapi.auth2.OfflineAccessOptions ): Promise<{code:string}> {
        return this.auth.grantOfflineAccess( options );
    }
}