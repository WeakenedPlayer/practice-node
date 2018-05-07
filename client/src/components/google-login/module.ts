import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { GoogleSigninService, GoogleSigninClientConfig } from './service';
declare const gapi:any;

@NgModule( {
    imports: [],
    providers: []
} )
export class GoogleSigninModule {
    static forRoot( config: gapi.auth2.ClientConfig ): ModuleWithProviders {
        return {
            ngModule: GoogleSigninModule,
            providers: [ { provide: GoogleSigninClientConfig, useValue: config } ]
        };
    }
}
