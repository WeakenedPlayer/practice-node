import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { WebSocketClient } from '@weakenedplayer/websocket-wrapper';
import { Census } from '@weakenedplayer/census-api';

export interface CensusWebsocketOption {
    environment?: string;
    serviceId?: string;
}

const defaultOption: CensusWebsocketOption = {
    environment: 'ps2',
    serviceId: 'example'
}

export class CensusWebsocket implements Census.EventStreamWebsocket {
    private url: string = '';
    private ws: WebSocketClient;
    private msgObservable: Observable<any>;
    private option: CensusWebsocketOption;
    constructor( option: CensusWebsocketOption = defaultOption ) {
        this.option = {
            ...defaultOption,
            ...option
        };
        
        this.url  = 'wss://push.planetside2.com/streaming?environment=' + this.option.environment + '&service-id=s:' + this.option.environment + '}';
        this.ws = new WebSocketClient();
        
        this.msgObservable = this.ws.json$.pipe( 
            map( msg => JSON.parse( msg ) ),
            share()
        );
    }

    get message$(): Observable<any>{
        return this.msgObservable;
    }
    
    send( data: any ): void {
        return this.ws.send( JSON.stringify( data ) );
    }
    
    connect(): Promise<void> {
        return this.ws.open( this.url );
    }
    
    disconnect(): Promise<void> {
        return this.ws.close();
    }
}
