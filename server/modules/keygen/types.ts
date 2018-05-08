export class JwtKey {
    _isValid: boolean;
    constructor( public readonly sequence: number, public readonly key: Buffer ) {
        this._isValid = true;
    }
    
    invalidate(): void {
        this._isValid = false;
    }
    
    get isValid(): boolean {
        return this._isValid;
    }
}

export interface IJwtIssuer {
    issue( data: any ): Promise<string>;
    verify( token: string ): Promise<any>;
}

