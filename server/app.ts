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

import * as firebase from 'firebase-admin';
var serviceAccount = require("./secret/firebase.json");

//import { toRingBuffer, toDescendingArray, KeyBank, RandomElement } from './modules/keygen';
import { of, interval, Observable, Subscription } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

//
//import { JwtWithPassphraseIssuer } from '@weakenedplayer/jwt-issuer';


//let census = new CensusApi();
//census.getOutfit( '37512998641471064' )
//.then( outfit => {
//    console.log( outfit );
//} );
var options = {
  uri: "https://discordapp.com/api/webhooks/445135078058754049/AlCFnnqtn-QdiaFqa-aQ6uII1uGPFj8YrlnFGzH_4dNRMI3YOP7EGMKBxaMA0kkVO1Jy",
  headers: {
    "Content-type": "application/json",
  },
  json: {
    'content': 'hello',
    'file': {url: 'http://www.google.co.jp/logos/doodles/2018/mothers-day-2018-6361329190305792-l.png', height: 100, width: 200},
  }
};
//request.post(options, function(error, response, body){});

//let aaaa = new JwtWithPassphraseIssuer();
//aaaa.init().then( () => {
//    return aaaa.sign( { 'aaa':  'aaaaaaa'}, '654' );
//} ).then( token => {
//    console.log( token )
//    return aaaa.verify( token, '654' );
//} ).then( decoded => {
//    console.log( decoded )
//} );
//let randoms = new RandomRingBuffer( { length: 10 } );
//randoms.init().then( values => {
//    console.log( values );
//    return randoms.next( 4 );
//} ).then( values => {
//    console.log( values );    
//} );


//import { JwtWithPassword, KeyProvider, PasswordJwtKey } from './modules/password-jwt';
//
//
//let provider = new TestKeyProvider();
//let pwd = new JwtWithPassword( provider );
//
//provider.init()
//.then( () => {
//    provider.start();
//    console.log( 'start' );
//    pwd.sign( { greet: 'hello' }, 'pass').then( test => {
//        console.time( 'verify' );
//        return pwd.verify( test );
//    } ).then( result => {
//        console.timeEnd( 'verify' );
//        console.log( 'ok' );
//        console.log( result );
//    } ).catch( err => {
//        console.log( err );
//    } ); 
//} )
//

/*
 * APIはリクエストを内部の動作に置き換える
 * アプリは必要な機能をつなぐ
 * apl
 * ドメインはあまり何もしないかも…リポジトリ位
 * 
 * */



firebase.initializeApp( {
    credential: firebase.credential.cert( serviceAccount ),
    databaseURL: 'https://outfitappdev-1525596402374.firebaseio.com'
} );
var db = firebase.database();
db.goOnline();

import { CensusApi, OutfitInfo, Repositories, NotificationInfo } from './domain';

let census = new CensusApi();
let repos = new Repositories( db );

let outfitApi = new OutfitApi( repos, census );

let notification: NotificationInfo = {
    'type': 'discord-websocket',
    'param': {
        'url': 'https://discordapp.com/api/webhooks/445135078058754049/AlCFnnqtn-QdiaFqa-aQ6uII1uGPFj8YrlnFGzH_4dNRMI3YOP7EGMKBxaMA0kkVO1Jy'
    }
};

outfitApi.add( '37536328187733260', 'abc', notification ).then( () => {
    console.log( 'ok' );
} );

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

import { JwtVerifier, PassphraseVerifier, CaptchaVerifier } from '@weakenedplayer/verifiers';

let jwtIssuer = new JwtVerifier();
let checker = new PassphraseVerifier();
checker.init();
jwtIssuer.init();
app.get( '/api/v1/token', 
    ( req, res, next ) => {
        let hashed = checker.hash( 'hello' );
        jwtIssuer.sign( { 'h': hashed.hash, 's': hashed.sequence } )
        .then( token => {
            res.status( 200 );
            res.json( { token: token } );
        } );
    } );

app.post( '/api/v1/check', 
    ( req, res, next ) => {
        let token = req.body[ 'token' ];
        let passphrase = req.body[ 'passphrase' ];
        jwtIssuer.verify( token )
        .then( decoded => {
            let hash: string = decoded[ 'h' ];
            let sequence: number = decoded[ 's' ];
            console.log( sequence )
            return checker.verify( passphrase, hash, sequence );
        } ).then( () => {
            res.status( 200 );
            res.json( { token: token } ); 
        } ).catch( err => {
            res.status( 400 );
            res.json( err ); 
        } );
    } );

// Captcha Middleware Test
import { CAPTCHA_SECRET } from './secret';
let captcha = new CaptchaVerifier( CAPTCHA_SECRET );
app.post('/api/v1/captcha', ( req, res, next ) => {
    captcha.verify( req.body[ 'captcha' ] ).then( () => {
        res.status( 200 );
        res.json( { res: 'OK' } );
    } ).catch( ( err ) => {
        res.status( 400 );
        res.json( { res: 'ng' } );
    } )
} );



app.get('/:file', (req, res, next ) => {
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
