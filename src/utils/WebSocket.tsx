import { socketBaseUrl } from "../config";
import User from "../types/auth/User";
import { GetChatsRequest, LoginRequest, NewChatRequest, NewMessageRequest, UserFromExtRequest } from "../types/request_schemas";





function getSocket(): WebSocket {
    const socket = new WebSocket(socketBaseUrl);
    return socket;
}


interface WebSocketHelperType {
    data: LoginRequest | NewChatRequest | NewMessageRequest | GetChatsRequest | UserFromExtRequest,
    onResponse: (response: any) => void,
    onError: (error: any) => void
}






export function getUserFromExt(ext: string, onFound: (data: User) => void, onNotFound: () => void) {
    socketRequest({
        data: { route: "user_from_ext", ext: ext }, onError(error) {

        }, onResponse(response) {
            if (response['error'] == true) {
                onNotFound();
            } else {
                onFound(response['result'] as User)
            }

        },
    })
}



export type SocketHookType = {
    name: string,
    onUpdate: (data: any) => void
}

export const socketHook = (props: SocketHookType) => {
    var socket = getSocket();


    const onMessageEvent = (e: any) => {
        response(e);
        // socket?.close();
    }

    const response = (message: MessageEvent) => {
        const res = JSON.parse(message.data);
        const routeReq = props.name;
        const routeRes = res['route'];
        if (routeReq == routeRes) {
            // //('req:'+routeReq+" res:"+routeRes)
            props.onUpdate(res);
        }
    }

    socket.addEventListener('open', (ev: Event) => {
        //("New Hook Registered :" + props.name)
        socket.addEventListener('message', onMessageEvent);
    })

    socket.addEventListener('close', (ev: Event) => {
        //("New Hook UnRegistered :" + props.name)
        // setTimeout(()=>{
        //     socket = getSocket();
        //     socket.addEventListener('open',(ev:Event)=>{
        //         socket.addEventListener('message',onMessageEvent);
        //     });
        // },2000);


    })
}


export const socketRequest = (props: WebSocketHelperType) => {

    var socket = getSocket();


    const onMessageEvent = (e: any) => {
        response(e);
        socket?.close();
    }
    const request = () => {
        socket?.send(JSON.stringify(props.data));


        socket.addEventListener('message', (e) => {
            onMessageEvent(e);
            socket?.close();
        })



    }
    const response = (message: MessageEvent) => {
        const res = JSON.parse(message.data);
        const routeReq = props.data.route
        const routeRes = res['route'];
        if (routeReq == routeRes) {
            // //('req:'+routeReq+" res:"+routeRes)
            props.onResponse(res);
        }
    }





    socket.addEventListener('open', (e) => {
        request();
    })


    socket.addEventListener('error', (ev: Event) => {
        props.onError(ev);
        socket?.close();
    })

}





