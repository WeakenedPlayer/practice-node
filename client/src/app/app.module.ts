import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GoogleSigninModule, GoogleSigninService } from '@weakenedplayer/google-signin';

import {CaptchaModule} from 'primeng/captcha';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        CaptchaModule,
        GoogleSigninModule.forRoot( { client_id:'253704543713-9j1mmf0k16kvp3dvku5q89ph06ahsmkk.apps.googleusercontent.com' } )
    ],
    providers: [ GoogleSigninService ],
    bootstrap: [ AppComponent ]
} )
export class AppModule {}
