import { FirebaseRepos } from '../modules/firebase-repos'; 
import * as firebase from 'firebase-admin';
import { CensusApi } from './census-api';
import { Repositories } from './repos';
import { OutfitRecruit, NotificationInfo } from './types';

export class OutfitApi {
    constructor( private repos: Repositories, private census: CensusApi ) {}
    
    add( outfitId: string, recruiterId: string, notification: NotificationInfo ): Promise<void> {
        return this.census.getOutfit( outfitId ).then( info => {
            let recruit: OutfitRecruit = {
                ...info,
                'recruiterId': recruiterId,
                'notification': notification
            };
            return this.repos.recruit.set( recruit );
        } );
    }
}
