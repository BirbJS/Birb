import Websocket from "./classes/websocket/Websocket";
import InternalWebsocket from "./classes/websocket/InternalWebsocket";
import BirbJSError from "./errors/BirbJSError";
import WebsocketProcessingError from "./errors/WebsocketProcessingError";
import { Status } from "./constants/Status";
import Client from "./classes/Client";

export {
    BirbJSError,
    WebsocketProcessingError,
    Status,
    Client,
    Websocket,
    InternalWebsocket,
};

export function _test () {
    console.info('test passed; index.ts is valid')
}
