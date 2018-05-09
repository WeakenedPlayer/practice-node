// Get dependencies
import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as request from 'request';

let app = express();

import * as passport from 'passport';
import { OAuth2Strategy }  from 'passport-google-oauth';
import { CREDENTIAL } from '@weakenedplayer/app-config';

import { toRingBuffer, toLatestArray, KeyBank } from './modules/keygen';
import { of, interval } from 'rxjs';
import { tap } from 'rxjs/operators';


import * as firebase from 'firebase-admin';
var serviceAccount = require("./secret/firebase.json");

let bank = new KeyBank( { length: 4, maxSequence: 10, stock: 2 } );


interval( 1000 ).pipe( 
    tap( () => {
        bank.next();
    }
) ).subscribe();

bank.keys$.subscribe( k => console.log( k ) );

//firebase.initializeApp( {
//    credential: firebase.credential.cert( serviceAccount ),
//    databaseURL: 'https://outfitappdev-1525596402374.firebaseio.com'
//} );
//var db = firebase.database();
//db.goOnline();
//
//class OutfitRecruit {
//    readonly 'outfitId': string;
//    readonly 'recruitBy': string; // character id
//    readonly 'createdAt': number;
//}
//
//import { FirebaseRepos }  from './modules/firebase-repos';

//let outfitRecruit = new FirebaseRepos<OutfitRecruit>( db, '/ofr', 'outfitId' );
//
//outfitRecruit.set( { outfitId: '123', recruitBy: '1ssd3', 'createdAt': Date.now() } );
//outfitRecruit.get( '432222' ).then( data => console.log( data ) );
//outfitRecruit.getAll().then( data => {
//    console.log( data );
//} );

//Parsers for POST data
if( process.env.NODE_ENV === 'development' ) {
    app.use( logger( 'dev' ) );    
}

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser());
app.use( express.static(path.join( __dirname, '../client/assets') ) );

import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client( CREDENTIAL.client_id );
app.post( '/outfit',  (req, res) => {
    let option = {
        idToken: req.body.token,
        audience: CREDENTIAL.auth_uri,
    };
    client.verifyIdToken( option ).then( ticket => {
        let payload = ticket.getPayload();
        let userId = payload[ 'sub' ];

        console.log( payload );
        console.log( userId );
        res.json( { res: 'req!!!' } );
    } ).catch( ( err ) => {
        console.log( err );
        res.status( 401 );
        res.json( { res: 'NG!!!' } );        
    } );
} );




app.get('/:file', (req, res) => {
    var file = req.params.file;
    res.sendFile(path.join(__dirname, '../client/', file ));
} );

//Catch all other routes and return the index file
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html' ));
} );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err: any = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status( err.status || 500 );
    res.json( { err: err } );
});

module.exports = app;
