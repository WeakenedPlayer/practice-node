import { Census } from '@weakenedplayer/census-api';
import { Observable } from 'rxjs';
import * as request from 'request';
import { CensusHttp } from './http';
import { OutfitInfo } from '../../domain';

export class CensusApi {
    private outfitQuery: Census.RestQuery;
    private census: Census.RestApi;
    constructor() {
        this.census = new Census.RestApi( new CensusHttp() );
        
        this.outfitQuery = new Census.RestQuery( 'outfit' )
        .join( 'character', ( join ) => {
            join.on( 'leader_character_id' );
            join.to( 'character_id' );
            join.nest( 'faction' );
            join.nest( 'characters_world', ( join ) => {
                join.nest( 'world' );
            } );
        } );
    }
    
    getOutfit( id: string ): Promise<OutfitInfo> {
        this.outfitQuery.where( 'outfit_id', t => {
            t.contains( id );
        } );
        
        return this.census.get( this.outfitQuery ).toPromise().then( res => {
            let outfit = res[ 0 ];
            let leader = outfit[ 'leader_character_id_join_character' ];
            let faction = leader[ 'faction_id_join_faction' ];
            let world = leader[ 'character_id_join_characters_world' ][ 'world_id_join_world' ];

            let info: OutfitInfo = {
                outfitId: outfit[ 'outfit_id' ],
                name: outfit[ 'name' ],
                alias: outfit[ 'alias' ],
                worldId: world[ 'world_id' ],
                world: world[ 'name' ][ 'en' ],
                factionId: faction[ 'faction_id' ],
                faction: faction[ 'name' ][ 'en' ],
                leaderId: leader[ 'character_id' ],
                leader: leader[ 'name' ][ 'first' ]
            };
            
            return info;
        } );
    }
}
