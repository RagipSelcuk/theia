import { injectable, inject } from 'inversify';
import { FrontendApplication, FrontendApplicationContribution, WidgetManager } from '@theia/core/lib/browser';
import { DieticianWelcomeWidget } from './dietician-welcome-widget';

@injectable()
export class DieticianIdeContribution implements FrontendApplicationContribution {

    @inject(WidgetManager)
    protected readonly widgetManager: WidgetManager;

    onStart(app: FrontendApplication): void {
        if (this.widgetManager) {
            this.widgetManager.getOrCreateWidget(DieticianWelcomeWidget.ID).then(widget => {
                app.shell.addWidget(widget, { area: 'main' });
                app.shell.activateWidget(widget.id);
            });
        }
    }
}
