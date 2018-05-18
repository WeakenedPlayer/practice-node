import { FirebaseRepos } from '@weakenedplayer/firebase-repos'; 
import * as firebase from 'firebase-admin';
import { OutfitRecruit } from '../types';

export class Repositories {
    readonly recruit = new FirebaseRepos<OutfitRecruit>( this.db, '/ofr', 'outfitId' );
    constructor( private db: firebase.database.Database ) {}
}
