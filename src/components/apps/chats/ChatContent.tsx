import React, { useEffect, useRef } from "react";
import {
  Typography,
  Divider,
  Avatar,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Box,
  Stack,
  Badge,
  useMediaQuery,
  Theme,
} from "@mui/material";
import {
  IconDotsVertical,
  IconMenu2,
  IconPhone,
  IconPhoneCall,
  IconPhoneFilled,
  IconPhoneOff,
  IconVideo,
} from "@tabler/icons-react";
import { dispatch, useSelector } from "../../../store/Store";

import { formatDistanceToNowStrict } from "date-fns";
import ChatInsideSidebar from "./ChatInsideSidebar";
import { Chat, ChatMessage } from "../../../types/response_schemas";
import { getFileTypeFromUrl, getOpponentUser } from "../../../utils/utils";
import User from "../../../types/auth/User";
import InCallLayout from "../../../layouts/full/shared/incall/InCallLayout";
import { getUserFromExt } from "../../../utils/WebSocket";
import {
  resetTimer,
  setAudioSinkRef,
  setGlobalError,
  setInCall,
  setInCallExtNumber,
  setInCallStatus,
  setInCallUser,
  setInCallUsername,
  setOutGoingExtNum,
  setOutGoingUserName,
  setOutgoingCallStatus,
  setOutgoingDialogVisibilty,
  startTimer,
} from "../../../store/home/HomeSlice";
import { DialByLine } from "../../../utils/SipDiamond";
interface ChatContentProps {
  toggleChatSidebar: () => void;
}

const ChatContent: React.FC<ChatContentProps> = ({
  toggleChatSidebar,
}: any) => {
  const [open, setOpen] = React.useState(true);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const chatDetails: Chat = useSelector(
    (state) => state.chatReducer.chats[state.chatReducer.activeChatIndex]
  );

  
  const userData = useSelector((x) => x.authReducer.user);
  var chatUser: User | null = null;
  if (chatDetails != null) {
    chatUser = getOpponentUser(chatDetails, userData?.id.toString());
  }


  const boxRef = useRef<HTMLDivElement | null>(null);

  const state = useSelector((x)=>x);

  useEffect(() => {
    // Scroll to the bottom of the box when items change
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [chatDetails]);










  const outgoingCallbacks = {
    onTry: () => {


      //('ABCD:  onTry');


      dispatch(setOutgoingCallStatus("Calling..."));
      //("outgoinCallbacks", "onTry");
    },
    onRinging: () => {

      //('ABCD:  onRinging');



      dispatch(setOutgoingCallStatus("Ringing..."));
      //("outgoinCallbacks", "onRinging");
    },
    onRedirect: () => {

      //('ABCD:  onRedirect');



      //("outgoinCallbacks", "onRedirect");
      dispatch(setOutgoingCallStatus("Redirecting"));
      dispatch(setOutgoingDialogVisibilty(true));
    },
    onAccept: () => {

      //('ABCD:  onAccept');
      dispatch(setInCall(true));
      dispatch(setOutgoingDialogVisibilty(false));
      dispatch(startTimer())

    },
    onReject: () => {

      //('ABCD:  onReject');

      dispatch(setOutgoingCallStatus("Call Rejected"));
      dispatch(setOutgoingDialogVisibilty(false));
      dispatch(setOutgoingCallStatus(""));
      dispatch(setOutGoingExtNum(""));
      dispatch(setOutGoingUserName(""));
      dispatch(setInCall(false));
      dispatch(resetTimer(0));
      //("outgoinCallbacks", "onReject");
    },


    onHang: () => {


      dispatch(setOutgoingCallStatus("Call Ended"));
      dispatch(setOutgoingDialogVisibilty(false));

      dispatch(setInCall(false));
      dispatch(setInCallExtNumber(""));
      dispatch(setInCallUsername(""));
      dispatch(setInCallStatus(""));

      dispatch(setOutgoingDialogVisibilty(false));
      dispatch(setOutgoingCallStatus(""));
      dispatch(setOutGoingExtNum(""));
      dispatch(setOutGoingUserName(""));
    },
  };








  function onMakeCall(): void {
  
    
    const opts: any = {
      type: "audio",
      num: chatUser?.sip_extension,
      callBacks: outgoingCallbacks
    };


    DialByLine(opts);
    dispatch(setInCallUser(chatUser));
    dispatch(setOutgoingDialogVisibilty(true));
    dispatch(setOutGoingExtNum(chatUser?.sip_extension));
    dispatch(setOutGoingUserName(chatUser?.display_name));
    dispatch(setOutgoingCallStatus("Calling"));
    dispatch(setInCallUsername(chatUser?.display_name));
    dispatch(setInCallExtNumber(chatUser?.sip_extension));
    dispatch(setInCallStatus('Calling...'))
  }

  return (
    <Box>
      {chatDetails ? (
        <Box>
          {/* ------------------------------------------- */}
          {/* Header Part */}
          {/* ------------------------------------------- */}
          {state.homeReducer.inCall && (state.homeReducer.inCallUser?.id == getOpponentUser(chatDetails,state.authReducer.user?.id).id) ? (
            <Box>
              <InCallLayout/>
              <Divider />
            </Box>
          ) : (
            <Box>
              <Box display="flex" alignItems="center" p={2}>
                <Box
                  sx={{
                    display: { xs: "block", md: "block", lg: "none" },
                    mr: "10px",
                  }}
                >
                  <IconMenu2 stroke={1.5} onClick={toggleChatSidebar} />
                </Box>

                <ListItem key={chatDetails.id} dense disableGutters>
                  <ListItemAvatar>
                    <Badge
                      color={
                        "success"

                        // getOpponentUser === "online"
                        //   ? "success"
                        //   : chatDetails.status === "busy"
                        //   ? "error"
                        //   : chatDetails.status === "away"
                        //   ? "warning"
                        //   : "secondary"
                      }
                      variant="dot"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      overlap="circular"
                    >
                      <Avatar
                        alt={"Profile Picture"}
                        src={chatUser?.display_picture}
                        sx={{ width: 40, height: 40 }}
                      />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h5">
                        {chatUser?.display_name}
                      </Typography>
                    }
                    secondary={chatUser?.status}
                  />
                </ListItem>
                <Stack direction={"row"}>
                  <IconButton aria-label="phone">
                    <IconPhone onClick={()=>onMakeCall()} stroke={1.5} />
                  </IconButton>
               
                  <IconButton
                    aria-label="sidebar"
                    onClick={() => setOpen(!open)}
                  >
                    <IconDotsVertical stroke={1.5} />
                  </IconButton>
                </Stack>
              </Box>
              <Divider />
            </Box>
          )}

          {/* ------------------------------------------- */}
          {/* Chat Content */}
          {/* ------------------------------------------- */}

          <Box display="flex">
            {/* ------------------------------------------- */}
            {/* Chat msges */}
            {/* ------------------------------------------- */}

            <Box width="100%">
              <Box
                ref={boxRef}
                sx={{
                  height: "650px",
                  overflow: "auto",
                  maxHeight: "700px",
                }}
              >
                <Box p={3}>
                  {chatDetails.messages.map((message) => {
                    return (
                      <Box key={message.id + message.created_at}>
                        {message.from_id.toString() ==
                        chatUser?.id.toString() ? (
                          <Box display="flex">
                            <ListItemAvatar>
                              <Avatar
                                alt={"Display Picture"}
                                src={chatUser.display_picture}
                                sx={{ width: 40, height: 40 }}
                              />
                            </ListItemAvatar>
                            <Box>
                              {message.created_at ? (
                                <Typography
                                  variant="body2"
                                  color="grey.400"
                                  mb={1}
                                >
                                  {chatUser.display_name},{" "}
                                  {formatDistanceToNowStrict(
                                    new Date(message.created_at),
                                    {
                                      addSuffix: false,
                                    }
                                  )}{" "}
                                  ago
                                </Typography>
                              ) : null}
                              <Box
                                mb={2}
                                sx={{
                                  p: 1,
                                  backgroundColor: "grey.100",
                                  mr: "auto",
                                  maxWidth: "320px",
                                }}
                              >
                                {message.message}
                              </Box>
                              {/* {getFileTypeFromUrl(chat.attachment_url) === "text" ? (
                                <Box
                                  mb={2}
                                  sx={{
                                    p: 1,
                                    backgroundColor: "grey.100",
                                    mr: "auto",
                                    maxWidth: "320px",
                                  }}
                                >
                                  {chat.msg}
                                </Box>
                              ) : null}
                              {chat.type === "image" ? (
                                <Box
                                  mb={1}
                                  sx={{
                                    overflow: "hidden",
                                    lineHeight: "0px",
                                  }}
                                >
                                  <img
                                    src={chat.msg}
                                    alt="attach"
                                    width="150" height="150"
                                  />
                                </Box>
                              ) : null} */}
                            </Box>
                          </Box>
                        ) : (
                          <Box
                            mb={1}
                            display="flex"
                            alignItems="flex-end"
                            flexDirection="row-reverse"
                          >
                            <Box
                              alignItems="flex-end"
                              display="flex"
                              flexDirection={"column"}
                            >
                              {message.created_at ? (
                                <Typography
                                  variant="body2"
                                  color="grey.400"
                                  mb={1}
                                >
                                  {formatDistanceToNowStrict(
                                    new Date(message.created_at),
                                    {
                                      addSuffix: false,
                                    }
                                  )}{" "}
                                  ago
                                </Typography>
                              ) : null}
                              <Box
                                mb={1}
                                sx={{
                                  p: 1,
                                  backgroundColor: "primary.light",
                                  ml: "auto",
                                  maxWidth: "320px",
                                }}
                              >
                                {message.message}
                              </Box>
                              {/* {chat.type === "text" ? (
                                <Box
                                  mb={1}
                                  sx={{
                                    p: 1,
                                    backgroundColor: "primary.light",
                                    ml: "auto",
                                    maxWidth: "320px",
                                  }}
                                >
                                  {chat.msg}
                                </Box>
                              ) : null}
                              {chat.type === "image" ? (
                                <Box
                                  mb={1}
                                  sx={{ overflow: "hidden", lineHeight: "0px" }}
                                >
                                  <img
                                    src={chat.msg}
                                    alt="attach"
                                    width="250" height="165"
                                  />
                                </Box>
                              ) : null} */}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            {/* ------------------------------------------- */}
            {/* Chat right sidebar Content */}
            {/* ------------------------------------------- */}
            {open ? (
              <Box flexShrink={0}>
                <ChatInsideSidebar
                  isInSidebar={lgUp ? open : !open}
                  chat={chatDetails}
                />
              </Box>
            ) : (
              ""
            )}
          </Box>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" p={2} pb={1} pt={1}>
          {/* ------------------------------------------- */}
          {/* if No Chat Content */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              display: { xs: "flex", md: "flex", lg: "none" },
              mr: "10px",
            }}
          >
            <IconMenu2 stroke={1.5} onClick={toggleChatSidebar} />
          </Box>
          <Typography variant="h4">Select Chat</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatContent;
