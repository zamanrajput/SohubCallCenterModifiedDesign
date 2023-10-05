import React, { ChangeEvent, useRef, useState } from "react";
import { useSelector, useDispatch } from "../../../store/Store";
import { IconButton, InputBase, Box, Popover, Button } from "@mui/material";
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

import { Chat } from "../../../types/response_schemas";
import User from "../../../types/auth/User";
import { getOpponentUser } from "../../../utils/utils";
import { sendMsg, setSelectedFile } from "../../../store/apps/chat/ChatSlice";
import axios, { AxiosProgressEvent, AxiosResponse } from "axios";
import { setGlobalError, setProgressDialogVisibilty, setProgressTitle, setUploadProgress } from "../../../store/home/HomeSlice";
import { uploadFilePath, viewFileBaseUrl } from "../../../utils/API_LINKS";

const ChatMsgSent = () => {
  const [msg, setMsg] = React.useState<any>("");

















  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const [imageSelectorAncholEl, setImageSelectorAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [imageFileSize, setImageFileSize] = useState<number>(0)

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

  const activeChat: Chat = useSelector((state) => state.chatReducer.chats[state.chatReducer.activeChatIndex]);
  const thisUser: User | null = useSelector((state) => state.authReducer.user);
  const allChats: Chat[] = useSelector((c) => c.chatReducer.chats);

  var chatOppo: User | null = null;
  if (activeChat != null) {
    chatOppo = getOpponentUser(activeChat, thisUser?.id);
  }

  const handleChatMsgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);

  };



  const [selectedFile, setSelectedFileThis] = useState<File | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click event
      setImageSelectorAnchorEl(event.currentTarget);

    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selected = files[0];
      console.log(selected);
      setSelectedFileThis(selected);
      dispatch(setSelectedFile(selected));

      // Read the selected image and set it as a data URL for preview
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target && typeof event.target.result === 'string') {
          setSelectedFilePath(event.target.result);
        }
      };
      reader.readAsDataURL(selected);

      // Get image dimensions
      const img = new Image();
      img.src = URL.createObjectURL(selected);
      img.onload = () => {
        setImageWidth(img.naturalWidth);
        setImageHeight(img.naturalHeight);
        setImageFileSize(selectedFile?.size != null ? selected.size : 1000)
      };

    }
  };

  const onChatMsgSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    var attachmentUploadUrl = '';
    if (selectedFile !== null) {
      attachmentUploadUrl = await uploadFile(selectedFile);
      console.log(viewFileBaseUrl+attachmentUploadUrl);
      setSelectedFileThis(null);
    }
    const newMsg = { chat_id: activeChat.id, from_id: thisUser?.id, to_id: chatOppo?.id, message: msg, attachment_url: attachmentUploadUrl != ''?viewFileBaseUrl+attachmentUploadUrl:'', type:( attachmentUploadUrl != ''?"image":'text') };
    dispatch(sendMsg(newMsg, allChats));
    setMsg('');
  };



  async function uploadFile(file: File): Promise<string> {
    console.log('uploading file')


    let data = new FormData();
    data.append('file', file);
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost/server/api/index.php',
      headers: { 
       'Content-Type':'multipart/form-data'
      },
      data : data,
      timeout:5000
    };

    try {
      dispatch(setProgressDialogVisibilty(true));
      dispatch(setProgressTitle("Sending Message"));

      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      
      dispatch(setProgressDialogVisibilty(false));
      dispatch(setProgressTitle(""));
      console.log(response.data['filename'])
           return response.data['filename']
    }
    catch (error) {
      console.error('Error uploading file: ', error);
      dispatch(setGlobalError({ visibilty: true, title: 'Failed!', message: 'File Failed to Upload\n Reason: ' + error }))
      console.log(error);
      return '';
    }


    const formData = new FormData();
    console.log('uploading file')
    formData.append('file', file);
    try {

      dispatch(setProgressDialogVisibilty(true));
      dispatch(setProgressTitle("Sending Message"));
      const response: AxiosResponse<{ filename: string }> = await axios.post(
        uploadFilePath,
        formData,
        {
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total != null ? progressEvent.total : imageFileSize)
            );
            console.log(percentage);
            dispatch(setUploadProgress(percentage))
          },
        }
      );

      dispatch(setProgressDialogVisibilty(false));
      dispatch(setProgressTitle(""));
      console.log(response.data);
      return response.data['filename'];

    } catch (error) {
      console.error('Error uploading file: ', error);
      dispatch(setGlobalError({ visibilty: true, title: 'Failed!', message: 'File Failed to Upload\n Reason: ' + error }))
      return ''; 
    }
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
        <Popover
          keepMounted
          anchorEl={imageSelectorAncholEl}
          open={selectedFile != null}
          onClose={() => setSelectedFileThis(null)}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "bottom" }}
        >

          <div style={{ boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.9)', margin: '10px', display: 'flex', flexDirection: 'column', padding: '6px' }}>
            <img
              src={selectedFilePath}

              alt="Selected Image"
              width={imageWidth > 500 ? imageWidth / 3 : imageWidth}
              height={imageHeight > 720 ? imageHeight / 3 : imageHeight}
            />
            <Button onClick={onChatMsgSubmit} sx={{ marginTop: '10px', color: 'white', background: 'green', fontSize: 'px' }}>
              SEND
            </Button>

          </div>
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

        <input type="file" accept="image/jpeg" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />

        <IconButton onClick={handleIconClick} aria-label="select-photo">
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
