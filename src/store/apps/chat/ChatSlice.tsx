import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../Store";
import { uniqueId } from "lodash";
import { sub } from "date-fns";
import dayjs from "dayjs";
import { sendChatMessage } from "../../../utils/SipDiamond";
import { socketHook, socketRequest } from "../../../utils/WebSocket";
import { Chat, ChatMessage } from "../../../types/response_schemas";
import { getCreds, loadUser } from "../../auth/AuthSlice";

const API_URL = "/api/data/chat/ChatData";

interface StateType {
  chats: Chat[];
  activeChatIndex: number;
  chatSearch: string;
  selectFile:File|null
}

const initialState = {
  chats: [],
  activeChatIndex: 1,
  chatSearch: "",
  selectFile:null
};

export const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedFile:(state,action)=>{
      state.selectFile = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
      // //(JSON.stringify(state.chats));
    },
    SearchChat: (state, action) => {
      state.chatSearch = action.payload;
    },
    SelectChat: (state: StateType, action) => {
      state.activeChatIndex = action.payload;
    },

  },
});

var isFirst = true;

export const registerChatsHook = (id: any) => async (dispatch: AppDispatch) => {

  if (isFirst) {
    //("XYZ", "Attemping to register hook")
    socketHook({
      name: 'messages_hook', onUpdate(data) {
        dispatch(setChats(data['data'][id]));
      },
    })
    isFirst = false;
  }


}

export const sendMsg = (data: any, chats: Chat[]) => async (dispatch: AppDispatch) => {
  const { chat_id, from_id, to_id, message, attachment_url, type } = data;

  const newMessage: ChatMessage = {
    id: '',
    chat_id: chat_id,
    type : type,
    message: message,
    attachment_url: attachment_url,
    from_id: from_id,
    to_id: to_id,
    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updated_at: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  };

  socketRequest({
    data: {
      route: 'new_message',
      data: {
        chat_id: newMessage.chat_id,
        from_id: newMessage.from_id,
        to_id: newMessage.to_id,
        attachment_url: newMessage.attachment_url,
        message: newMessage.message,
        type: type
      },
    }, onError(error) {

    }, onResponse(response) {

      var chatsNew: Chat[] = [];
      chats.forEach((x) => {
        if (x.id == chat_id) {
          var messages = [...x.messages, newMessage];
          // messages.push(newMessage);
          var chat: Chat = {
            member1: x.member1,
            member2: x.member2,
            members: x.members,
            messages: messages,
            id: x.id
          }

          chatsNew.push(chat)

        } else {
          chatsNew.push(x);
        }
      })

      dispatch(setChats(chatsNew));
    },
  })

  // sendChatMessage({
  //   extNum: sip_extension,
  //   message: message==null?'':message,
  //   onFailed: (reason: any) => {
  //     //("Failed to sent:", reason);
  //   },
  //   onSent: () => {
  //     //("message sent");
  //   },
  // });


}



export const createNewChat = (from: string, to: string) => async (dispatch: AppDispatch) => {
  socketRequest({
    data: {
      route: "new_chat",
      data: {
        members: from + "," + to,
      }
    }, onError(error) {

    }, onResponse(response) {
      dispatch(loadUser(getCreds(), () => {
        dispatch(SelectChat(0));
      }, () => { }));

    },
  })

}



export const { SearchChat, setChats, SelectChat,setSelectedFile } = ChatSlice.actions;



export default ChatSlice.reducer;
