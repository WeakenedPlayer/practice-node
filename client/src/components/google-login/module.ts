import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { GoogleSigninButtonComponent } from './button.component';
import { GoogleSigninService, GoogleSigninServiceConfig } from './service';


@NgModule( {
    declarations: [ GoogleSigninButtonComponent ],
    exports:      [ GoogleSigninButtonComponent ],
    imports: [],
    providers: []
} )
export class GoogleSigninModule {
    static forRoot( config: GoogleSigninServiceConfig ): ModuleWithProviders {
        return {
            ngModule: GoogleSigninModule,
            providers: [ { provide: GoogleSigninServiceConfig, useValue: config } ]
        };
    }
}
