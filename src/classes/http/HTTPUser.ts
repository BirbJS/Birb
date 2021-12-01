/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Client from '../Client';
import GetCurrent from './users/GetCurrent';
import Get from './users/Get';
import CreateDM from './users/CreateDM';

export default class HTTPUser {
    
    static getCurrent (client: Client) {
        let request = new GetCurrent(client);
        return request.make();
    }
    
    static get (client: Client, userId: string) {
        let request = new Get(client, userId);
        return request.make();
    }
    
    static createDM (client: Client, userId: string) {
        let request = new CreateDM(client, userId);
        return request.make();
    }

}
