const CONFIG = JSON.parse( process.env.APP_CONFIG );
const CREDENTIAL: Credential = JSON.parse( process.env.APP_CREDENTIAL )[ 'web' ];
export interface Credential {
    'client_id': string;
    'project_id': string;
    'auth_uri': string;
    'token_uri': string;
    'auth_provider_x509_cert_url': string;
    'client_secret': string;
    'redirect_uris': string;
}

export { CONFIG, CREDENTIAL };

