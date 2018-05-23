import { CensusWebsocket } from './websocket';
import { Census } from '@weakenedplayer/census-api';
import { Observable, merge } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';

const events: string[] = [ Census.EventConstant.PlayerLogin, Census.EventConstant.PlayerLogout ];
const filters: Census.EventFilter = {
    characterIds: [],
    worlds: [ 'all' ]
}

export interface OnlineStatus {
    characterId: string;
    name: string;
    online: boolean;
}

export class OnlineStatusMonitor {
    private characters: { [id: string]: string } = {};
    private loginObservable: Observable<OnlineStatus>;
    private logoutObservable: Observable<OnlineStatus>;
    private onlineStatusObservable: Observable<OnlineStatus>; 
    constructor( private stream: Census.EventStream ) {
        this.loginObservable  = this.stream.playerLogin$.pipe( 
            filter( ( msg: Census.EventType.PlayerLogin ) => !!this.characters[ msg.character_id ]),
            map( ( msg: Census.EventType.PlayerLogin ) => {
                return {
                    characterId: msg.character_id,
                    name: this.characters[ msg.character_id ],
                    online: true
                } 
            } )
        );

        this.logoutObservable = this.stream.playerLogout$.pipe(
            filter( ( msg: Census.EventType.PlayerLogout ) => !!this.characters[ msg.character_id ] ),
            map( ( msg: Census.EventType.PlayerLogout ) => {
                return {
                    characterId: msg.character_id,
                    name: this.characters[ msg.character_id ],
                    online: false
                } 
            } )
        );
        
        this.onlineStatusObservable = merge( this.loginObservable, this.logoutObservable ).pipe( share() );
    }
    
    start(): Promise<Census.EventResponse.Subscription> {
        return this.stream.addEvent( events, filters );
    }
    
    stop(): Promise<Census.EventResponse.Subscription> {
        return this.stream.removeAllEvent();
    }
    
    addCharacter( id: string, name: string ): void {
        this.characters[ id ] = name;
    }
    
    removeCharacter( id: string ): void {
        delete this.characters[ id ];
    }
    
    removeAllCharacters(): void {
        this.characters = {};
    }
    
    get onlineStatus(): Observable<OnlineStatus> {
        return this.onlineStatusObservable;
    }
}
