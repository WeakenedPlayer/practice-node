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

passport.use( new OAuth2Strategy( {
        clientID: CREDENTIAL.client_id,
        clientSecret: CREDENTIAL.client_secret,
        callbackURL: "/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log( accessToken );
        console.log( refreshToken );
        console.log( profile );
        done( null, 'OK' );
      }
));

//Parsers for POST data
if( process.env.NODE_ENV === 'development' ) {
    app.use( logger( 'dev' ) );    
}

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser());
app.use( express.static(path.join( __dirname, '../client/assets') ) );

function isAuthenticated( req, res, next ){
    console.log( 'hello')
    if( req.isAuthenticated() ) {
        return next();
    }
    else {
        res.redirect('/login');
    }
}


app.get('/login', passport.authenticate( 'google', {
    scope: [],
    failureRedirect: '/ng',
    successRedirect: '/ok',
    session: true
} ) );

app.get('/auth/google/callback', (req, res) => {
    res.json( { res: 'req!!!' } );
} );

app.get('/req-auth', isAuthenticated, (req, res) => {
    res.json( { res: 'req!!!' } );
} );

app.get('/ok', isAuthenticated, (req, res) => {
    res.json( { res: 'OK!!!' } );
} );

app.get('/ng', isAuthenticated, (req, res) => {
    res.json( { res: 'ng!!!' } );
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
