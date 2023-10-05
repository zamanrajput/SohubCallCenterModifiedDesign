
import { socketBaseUrl } from "../config";
import User from "../types/auth/User";
import { Chat } from "../types/response_schemas";


export function navigateTo(path: string) {
    window.location.href = path;
}



export const appName = "Call Center";


export const appDomain = "";

export const appLogo = 'path-to-logo'



export function getOpponentUser(chat: Chat, thisUser: string | null | undefined): User {
    if (chat.member1.id.toString() == thisUser?.toString()) {
        return chat.member2;
    } else {
        return chat.member1;
    }
}


export function getChatWithExt(chats: Chat[], thisUser: User | null, ext: string | null | undefined): Chat | null {
    for (var i = 0; i < chats.length; i++) {
        const chat = chats[i];
        console.log('comparison:Id=>dynamic User Ext :'+getOpponentUser(chat,thisUser?.id).sip_extension+" Passed Ext:"+ext)
        if (getOpponentUser(chat, thisUser?.id).sip_extension == ext) {
            return chat;
        }
    };
    return null;
}

export function getChatIndex(chats: Chat[], thisUser: User | null, id: string): number {
    for (var i = 0; i < chats.length; i++) {
        const chat = chats[i];
        if (chat.id === id) {
            return i;
        }
    };
    return -1;
}
export function secondsToHHMMSS(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let timeString = '';

    if (hours > 0) {
        const formattedHours = hours.toString().padStart(2, '0');
        timeString += `${formattedHours}:`;
    }

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    timeString += `${formattedMinutes}:${formattedSeconds}`;

    return timeString;
}




export function getFileTypeFromUrl(url: string) {
    return url.substring(url.lastIndexOf('.'));
}