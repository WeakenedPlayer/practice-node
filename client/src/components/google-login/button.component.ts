// https://developers.google.com/identity/sign-in/web/reference#gapisignin2renderid-options

import { Component, ElementRef, Input, } from '@angular/core';
import { GoogleSigninService } from './service'; 
import { filter, take, tap } from 'rxjs/operators';
declare let gapi: any;

@Component( {
    selector: 'google-signin-button',
    template: '<div></div>'
} )
export class GoogleSigninButtonComponent {
    @Input( 'theme' ) theme: string = 'light';
    @Input( 'scope' ) scope: string[] = [];
    @Input( 'height' ) height: number = 120;
    @Input( 'width' ) width: number = 36;
    
    private htmlElement: HTMLElement;
    constructor( private el: ElementRef, private auth: GoogleSigninService ) {
        this.htmlElement = this.el.nativeElement;
        this.auth.loaded$.pipe(
            filter( loaded => loaded ),
            take( 1 ),
            tap( loaded => {
                this.render();
            } )
        ).subscribe();
    }
    
    private render():void {
        this.auth.render( this.htmlElement.querySelector('div') );
    }
}
