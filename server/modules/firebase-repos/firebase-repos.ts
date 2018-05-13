import { Converter, KeyValue } from './converter';
import * as firebase from 'firebase-admin';

export class FirebaseRepos<T> {
    private conv: Converter;
    constructor( private db: firebase.database.Database, private base: string, keyName: string ) {
        this.conv = new Converter( keyName );
    }
    
    private ref( key?: string ) {
        let path = key ? [ this.base, key ].join('/') : this.base;
        return this.db.ref( path );
    }
    
    set( data: T ): Promise<void> {
        let kv: KeyValue = this.conv.convert( data );
        return this.ref( kv.key ).set( kv.value );
    }
    
    get( id: string ): Promise<T> {
        return this.ref( id ).once( 'value' )
        .then( snapshot => {
            let tmp: T = this.conv.invert( snapshot.key, snapshot.val() );
            return tmp;
        } );
    }
    
    getAll(): Promise<T[]> {
        return this.ref().once( 'value' )
        .then( snapshot => {
            let values = snapshot.val();
            let res: T[] = [];
            for( let key in values ) {
                res.push( this.conv.invert( key, values[ key ] ) );
            }
            return res;
        } );
    }
    
    delete( outfitId: string ): Promise<void> {
        return this.ref().remove();
    }
}
