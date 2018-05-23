import { NotifierEnum, INotifierProvider } from './types';
import { DiscordWebhookNotifierProvider } from './discord-webhook';
import { DummyNotifierProvider } from './dummy-notifier';

const providers = new Map<NotifierEnum, INotifierProvider>([
    [ NotifierEnum.Discord, new DiscordWebhookNotifierProvider() ],
    [ NotifierEnum.Dummy, new DummyNotifierProvider() ]
]);

export class NotifierProvider {
    provide( type: NotifierEnum, param: any ) {
        return providers.get( type ).provide( param );
    }
}