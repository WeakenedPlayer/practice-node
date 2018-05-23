import { INotifier, INotifierProvider } from './types';

export class DummyNotifier implements INotifier {
    constructor() {}

    notify( message: string ): Promise<void> {
        console.log( '[Notify] ' + message );
        return Promise.resolve();
    }
}

export class DummyNotifierProvider implements INotifierProvider {
    constructor() {}
    
    provide( param: any ): Promise<INotifier> {
        return Promise.resolve( new DummyNotifier() );
    }
}
