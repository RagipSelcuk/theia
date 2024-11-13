import * as React from 'react';
import { injectable } from 'inversify';
import { ReactWidget } from '@theia/core/lib/browser';

@injectable()
export class DieticianWelcomeWidget extends ReactWidget {
    static readonly ID = 'dietician.welcome.widget';
    static readonly LABEL = 'Welcome to Dietician IDE';

    protected render(): React.ReactNode {
        return (
            <div className="dietician-welcome-container">
                <h1>Welcome to Dietician IDE</h1>
                <p>Here are some quick links and resources to get you started:</p>
                <ul>
                    <li><a href="#link1">Documentation</a></li>
                    <li><a href="#link2">Get Started Guide</a></li>
                    <li><a href="#link3">Contact Support</a></li>
                </ul>
            </div>
        );
    }
}
