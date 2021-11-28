/*
    Copyright (C) 2021, knokbak and contributors

    https://github.com/knokbak/Birb

    This Source Code Form is subject to the terms of the
    Mozilla Public License, v. 2.0. If a copy of the MPL
    was not distributed with this file, You can obtain one
    at https://mozilla.org/MPL/2.0/.

    This Source Code Form is “Incompatible With Secondary
    Licenses”, as defined by the Mozilla Public License, v.
    2.0.
*/

class Packet {

    constructor (type, data) {
        this.type = type;
        this.data = data;
    }

    setType (type) {
        this.type = type;
    }

    setData (data) {
        this.data = data;
    }

    getType () {
        return this.type;
    }

    getData () {
        return this.data;
    }

    toString () {
        return `<Packet:[${JSON.stringify(this)}]>`;
    }

    toRawPacket () {
        return {
            type: this.type,
            data: this.data
        };
    }

}
