export class Converter {
    constructor( private keyName: string ) {}
    
    convert( value: any ): KeyValue {
        let tmp: any = { ...value };
        let key: string = tmp[ this.keyName ];
    
        if( key ) {
            delete tmp[ this.keyName ];
        } else {
            throw new Error( 'Required Key ' + this.keyName + ' doesn\'t exist.' );
        }
        return new KeyValue( key, tmp );
    }
    
    invert( key: string, value: any ): any {
        let tmp: any = { ...value };
        tmp[ this.keyName ] = key;
        return tmp;
    }
}

export class KeyValue {
    constructor( readonly key: string, readonly value: any ) { }
}
