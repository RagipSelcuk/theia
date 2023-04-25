// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************

import { inject, injectable, postConstruct } from 'inversify';
import { Deferred } from '../common/promise-util';
import { ConnectionResponse, ConnectResult, ELECTRON_MESSAGE_PORT_IPC as ipc, MessagePortClient, TheiaIpcWindow } from '../electron-common';

/**
 * This component expects to be communicating with the
 * {@link ElectronMessagePortBroker} living in the Electron preload context
 * which ultimately will relay the messages to the Electron main context.
 */
@injectable()
export class MessagePortClientImpl implements MessagePortClient {

    protected requestId = 0;
    protected pendingConnections = new Map<number, Deferred>();

    @inject(TheiaIpcWindow)
    protected ipcWindow: TheiaIpcWindow;

    @postConstruct()
    protected postConstruct(): void {
        this.ipcWindow.on(ipc.connectionResponse, this.onConnectionResponse, this);
    }

    connect(handlerId: string, ...handlerParams: unknown[]): ConnectResult {
        const [request, port] = this.createConnectionRequest(handlerId, handlerParams);
        const promise = request.promise.then(() => port, error => {
            port.close();
            throw error;
        });
        return { port, promise };
    }

    protected createConnectionRequest(handlerId: string, handlerParams: unknown[]): [Deferred, MessagePort] {
        const request = new Deferred();
        const requestId = this.requestId++;
        this.pendingConnections.set(requestId, request);
        const { port1, port2 } = new MessageChannel();
        this.ipcWindow.postMessage(origin, ipc.connectionRequest, [requestId, handlerId, handlerParams], [port1]);
        return [request, port2];
    }

    protected onConnectionResponse(event: MessageEvent, message: ConnectionResponse): void {
        const [requestId, error] = message;
        const request = this.pendingConnections.get(requestId);
        if (!request) {
            return;
        }
        this.pendingConnections.delete(requestId);
        if (error) {
            request.reject(error);
        } else {
            request.resolve();
        }
    }
}
