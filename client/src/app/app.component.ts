import { Component, OnInit } from '@angular/core';
import { GoogleSigninService } from '@weakenedplayer/google-signin';
import { Observable, Subscription, of } from 'rxjs';
import { tap, filter, flatMap, shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
} )
export class AppComponent implements OnInit {
    title = 'app';
    
    ready$: Observable<boolean>;
    signedIn$: Observable<boolean>;
    test: string; 
    token: string;
    constructor( private service: GoogleSigninService, private http: HttpClient ) {
        this.ready$ = this.service.ready$;
        this.signedIn$ = this.service.auth$
        .pipe(
            filter( auth => !!auth ),
            flatMap( auth => auth.isSignedIn$ ),
            shareReplay( 1 )
        );
    }
    
    signin(): void {
        this.service.auth.signIn().then( user => {
            this.test = user.getAuthResponse().id_token;
        } );
    }
    
    signout(): void {
        this.service.auth.signOut();
    }

    post( captcha: string ): void {
        let  body = { captcha: this.test };
        this.http.post( '/api/v1/captcha', body ).toPromise().then( res => console.log( res ) );
    }
    
    postToken(): void {
        let body = {
            token: this.token,
            passphrase: 'hello'
        };
        this.http.post( '/api/v1/check', body ).toPromise().then( res => console.log( res) );
    }
    
    getToken(): void {
        this.http.get( '/api/v1/token' ).toPromise().then( res => {
            this.token = res[ 'token' ];
        } );
    }
    showResponse( $event: any ) {
        this.test = $event.response;
        console.log( $event.response );
    }
    
    ngOnInit(): void {
    }
}


/* TODO
 * ログインしたかどうかをモニタ出来るようにする
 * ログアウトボタンを作る
 * ボタン梨も可能にする
 * 
 * バックエンドにトークンを送る
 * バックエンドでトークンを検証する
 *  */

