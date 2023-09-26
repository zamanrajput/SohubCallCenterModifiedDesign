import React from "react";
import { useSelector, useDispatch } from "../../../store/Store";
import { IconButton, InputBase, Box, Popover } from "@mui/material";
import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  EmojiClickData,
  Emoji,
  SuggestionMode,
  SkinTonePickerLocation,
} from "emoji-picker-react";
import {
  IconMoodSmile,
  IconPaperclip,
  IconPhoto,
  IconSend,
} from "@tabler/icons-react";

import { sendChatMessage } from "../../../utils/SipDiamond";
import { Chat } from "../../../types/response_schemas";
import User from "../../../types/auth/User";
import { getOpponentUser } from "../../../utils/utils";
import { sendMsg } from "../../../store/apps/chat/ChatSlice";

const ChatMsgSent = () => {
  const [msg, setMsg] = React.useState<any>("");
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [chosenEmoji, setChosenEmoji] = React.useState<string>("");

  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    setChosenEmoji(emojiData.unified);
    setMsg(emojiData.emoji);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const activeChat:Chat = useSelector((state) => state.chatReducer.chats[state.chatReducer.activeChatIndex]);
  const thisUser:User|null = useSelector((state) => state.authReducer.user);
  const allChats:Chat[]  = useSelector((c)=>c.chatReducer.chats);

  var chatOppo :User|null = null;
  if(activeChat!=null){
    chatOppo = getOpponentUser(activeChat,thisUser?.id);
  }

  const handleChatMsgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);

  };








  const onChatMsgSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();


    const newMsg = { chat_id:activeChat.id,from_id:thisUser?.id,to_id:chatOppo?.id,message:msg,attachment:'' };


    dispatch(sendMsg(newMsg,allChats));
    setMsg('');


  };

  return (
    <Box p={2}>
      {/* ------------------------------------------- */}
      {/* sent chat */}
      {/* ------------------------------------------- */}
      <form
        onSubmit={onChatMsgSubmit}
        style={{ display: "flex", gap: "10px", alignItems: "center" }}
      >
        {/* ------------------------------------------- */}
        {/* Emoji picker */}
        {/* ------------------------------------------- */}
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls="long-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <IconMoodSmile />
        </IconButton>
        <Popover
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <EmojiPicker onEmojiClick={onEmojiClick} />
          <Box p={2}>
            Selected:{" "}
            {chosenEmoji ? (
              <Emoji
                unified={chosenEmoji}
                emojiStyle={EmojiStyle.APPLE}
                size={22}
              />
            ) : (
              ""
            )}
          </Box>
        </Popover>
        <InputBase
          id="msg-sent"
          fullWidth
          value={msg}
          placeholder="Type a Message"
          size="small"
          type="text"
          inputProps={{ "aria-label": "Type a Message" }}
          onChange={handleChatMsgChange.bind(null)}
        />
        <IconButton
          aria-label="delete"
          onClick={
            onChatMsgSubmit}
          disabled={!msg}
          color="primary"
        >
          <IconSend stroke={1.5} size="20" />
        </IconButton>
        <IconButton aria-label="delete">
          <IconPhoto stroke={1.5} size="20" />
        </IconButton>
        <IconButton aria-label="delete">
          <IconPaperclip stroke={1.5} size="20" />
        </IconButton>
      </form>
    </Box>
  );
};

export default ChatMsgSent;
