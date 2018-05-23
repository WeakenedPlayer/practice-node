export interface OutfitInfo {
    'outfitId':  string;
    'name':      string;
    'alias':     string;
    'world':     string;
    'worldId':   string;
    'faction':   string;
    'factionId': string;
    'leaderId':  string;
    'leader':    string;
}

export interface NotificationInfo {
    'type': string;
    'param': any;
}

export interface OutfitRecruitInfo extends OutfitInfo {
    'recruiterId': string;
    'notification': NotificationInfo;
}
