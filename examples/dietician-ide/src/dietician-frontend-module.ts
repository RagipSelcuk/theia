import { ContainerModule } from 'inversify';
import { WidgetFactory } from '@theia/core/lib/browser';
import { DieticianWelcomeWidget } from './dietician-welcome-widget';
import { DieticianIdeContribution } from './dietician-ide-contribution';

export default new ContainerModule(bind => {
    bind(DieticianWelcomeWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: DieticianWelcomeWidget.ID,
        createWidget: () => ctx.container.get<DieticianWelcomeWidget>(DieticianWelcomeWidget)
    })).inSingletonScope();
    bind(DieticianIdeContribution).toSelf().inSingletonScope();
});
