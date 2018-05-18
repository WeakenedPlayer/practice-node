import { Census } from '@weakenedplayer/census-api';
import { Observable } from 'rxjs';
import * as request from 'request';

export class CensusHttp implements Census.RestApiHttp {
    get( url: string ): Observable<any> {
        return Observable.create( ( observer => { 
            request( url, ( error, res, body ) => {
                if( error ) {
                    observer.error( error );
                } 
                observer.next( JSON.parse( body ) );
                observer.complete();
            } );
        } ) );
    }
}
