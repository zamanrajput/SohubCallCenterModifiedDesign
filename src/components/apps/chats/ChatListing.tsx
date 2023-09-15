import React, { useEffect, useState } from "react";
import {
  Avatar,
  List,
  ListItemText,
  ListItemAvatar,
  TextField,
  Box,
  Alert,
  Badge,
  ListItemButton,
  Typography,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Icon,
} from "@mui/material";
import { useSelector, useDispatch } from "../../../store/Store";
import Scrollbar from "../../custom-scroll/Scrollbar";
import {
  SelectChat,
  fetchChats,
  SearchChat,
} from "../../../store/apps/chat/ChatSlice";
import { ChatsType } from "../../../types/apps/chat";
import { last } from "lodash";
import { formatDistanceToNowStrict } from "date-fns";
import {
  IconChevronDown,
  IconDialpad,
  IconDialpadOff,
  IconGridDots,
  IconSearch,
} from "@tabler/icons-react";
import { getUserData } from "../../../utils/utils";
import { Cancel, Dialpad, Keyboard, ListAlt } from "@mui/icons-material";
import AppButton from "../../shared/CustomButton";
import AppDialpad from "../../shared/CustomDialpad";

import OutgoingCallDialog from "../../shared/OutGoingCall";
import { DialByLine } from "../../../utils/SipDiamond";
import {
  setAudioSinkRef,
  setInCall,
  setInCallExtNumber,
  setInCallStatus,
  setInCallUsername,
  setIncomingCallStatus,
  setIncomingDialogVisibilty,
  setIncomingExtNum,
  setOutGoingExtNum,
  setOutGoingUserName,
  setOutgoingCallStatus,
  setOutgoingDialogVisibilty,
} from "../../../store/home/HomeSlice";












const ChatListing = () => {
  const data = useSelector((state) => state.homeReducer);

  const dispatch = useDispatch();
  const activeChat = useSelector((state) => state.chatReducer.chatContent);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const filterChats = (chats: ChatsType[], cSearch: string) => {
    if (chats)
      return chats.filter((t) =>
        t.name.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase())
      );

    return chats;
  };

  const chats = useSelector((state) =>
    filterChats(state.chatReducer.chats, state.chatReducer.chatSearch)
  );

  const getDetails = (conversation: ChatsType) => {
    let displayText = "";

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (lastMessage) {
      const sender = lastMessage.senderId === conversation.id ? "You: " : "";
      const message =
        lastMessage.type === "image" ? "Sent a photo" : lastMessage.msg;
      displayText = `${sender}${message}`;
    }

    return displayText;
  };

  const lastActivity = (chat: ChatsType) => last(chat.messages)?.createdAt;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [dialpadOpen, setDialPadOpen] = useState<boolean>(false);

  const userData = getUserData();

  const [num, setNumberStr] = useState<string>("");

  const onCharReceived = (char: string) => {
    setNumberStr(num + char);
  };

  const outgoingCallbacks = {
    onTry: () => {


      console.log('ABCD:  onTry');


      dispatch(setOutgoingCallStatus("Calling..."));
      console.log("outgoinCallbacks", "onTry");
    },
    onRinging: () => {

      console.log('ABCD:  onRinging');



      dispatch(setOutgoingCallStatus("Ringing..."));
      console.log("outgoinCallbacks", "onRinging");
    },
    onRedirect: () => {

      console.log('ABCD:  onRedirect');



      console.log("outgoinCallbacks", "onRedirect");
      dispatch(setOutgoingCallStatus("Redirecting"));
      dispatch(setOutgoingDialogVisibilty(true));
    },
    onAccept: () => {

      console.log('ABCD:  onAccept');
      dispatch(setInCall(true));
      dispatch(setOutgoingDialogVisibilty(false));
  
    },
    onReject: () => {

      console.log('ABCD:  onReject');

      dispatch(setOutgoingCallStatus("Call Rejected"));
      dispatch(setOutgoingDialogVisibilty(false));
      dispatch(setOutgoingCallStatus(""));
      dispatch(setOutGoingExtNum(""));
      dispatch(setOutGoingUserName(""));
      dispatch(setInCall(false));
      console.log("outgoinCallbacks", "onReject");
    },
   
  
    onHang: () => {
      console.log('ABCD:  onHang');



      console.log("outgoinCallbacks", "onEnd");

      dispatch(setOutgoingCallStatus("Call Ended"));
      dispatch(setOutgoingDialogVisibilty(false));

      console.log("XYZ:DATA CLEARED");
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


  function onCallButtonClick(number: string) {
    const opts: any = {
      type: "audio",
      num: number,
      callBacks:outgoingCallbacks
    };

    DialByLine(opts);
    dispatch(setOutGoingExtNum(number));
    dispatch(setOutGoingUserName("Unknown"));
    dispatch(setOutgoingCallStatus("Calling"));
    dispatch(setInCallUsername('Unknown'));
    dispatch(setInCallExtNumber(number));
    dispatch(setInCallStatus('Calling...'))
  }

  return (
    <div>
      {/* ------------------------------------------- */}
      {/* Profile */}
      {/* ------------------------------------------- */}
      <Box display={"flex"} alignItems="center" gap="10px" p={3}>
        <Badge
          variant="dot"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          overlap="circular"
          color="success"
        >
          <Avatar
            alt={userData.user_name}
            src={userData.avatar}
            sx={{ width: 54, height: 54 }}
          />
        </Badge>
        <Box>
          <Typography variant="body1" fontWeight={600}>
            {userData.user_name}
          </Typography>
          <Typography variant="body2">{`Ext: ${userData.extension}`}</Typography>
          <Typography variant="body2">Online</Typography>
        </Box>
      </Box>

      {/* ------------------------------------------- */}
      {/* Search */}
      {/* ------------------------------------------- */}
      {!dialpadOpen ? (
        <Box px={3} py={1}>
          <div style={{ display: "flex" }}>
            <TextField
              id="outlined-search"
              placeholder="Search contacts"
              size="small"
              type="search"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconSearch size={"16"} />
                  </InputAdornment>
                ),
              }}
              fullWidth
              onChange={(e) => dispatch(SearchChat(e.target.value))}
            />

            <AppButton
              onClick={() => setDialPadOpen(!dialpadOpen)}
              child={<Dialpad />}
            />
          </div>
        </Box>
      ) : null}

      {/* ------------------------------------------- */}
      {/* Contact List */}
      {/* ------------------------------------------- */}
      {!dialpadOpen ? (
        <List sx={{ px: 0 }}>
          <Box px={2.5} pb={1}>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              color="inherit"
            >
              Recent Chats <IconChevronDown size="16" />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleClose}>Sort By Time</MenuItem>
              <MenuItem onClick={handleClose}>Sort By Unread</MenuItem>
              <MenuItem onClick={handleClose}>Mark as all Read</MenuItem>
            </Menu>
          </Box>
          <Scrollbar
            sx={{
              height: { lg: "calc(100vh - 100px)", md: "100vh" },
              maxHeight: "600px",
            }}
          >
            {chats && chats.length ? (
              chats.map((chat) => (
                <ListItemButton
                  key={chat.id}
                  onClick={() => dispatch(SelectChat(chat.id))}
                  sx={{
                    mb: 0.5,
                    py: 2,
                    px: 3,
                    alignItems: "start",
                  }}
                  selected={activeChat === chat.id}
                >
                  <ListItemAvatar>
                    <Badge
                      color={
                        chat.status === "online"
                          ? "success"
                          : chat.status === "busy"
                          ? "error"
                          : chat.status === "away"
                          ? "warning"
                          : "secondary"
                      }
                      variant="dot"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      overlap="circular"
                    >
                      <Avatar
                        alt="Remy Sharp"
                        src={chat.thumb}
                        sx={{ width: 42, height: 42 }}
                      />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                        {chat.name}
                      </Typography>
                    }
                    secondary={getDetails(chat)}
                    secondaryTypographyProps={{
                      noWrap: true,
                    }}
                    sx={{ my: 0 }}
                  />
                  <Box sx={{ flexShrink: "0" }} mt={0.5}>
                    <Typography variant="body2">
                      {formatDistanceToNowStrict(new Date(lastActivity(chat)), {
                        addSuffix: false,
                      })}
                    </Typography>
                  </Box>
                </ListItemButton>
              ))
            ) : (
              <Box m={2}>
                <Alert
                  severity="error"
                  variant="filled"
                  sx={{ color: "white" }}
                >
                  No Contacts Found!
                </Alert>
              </Box>
            )}
          </Scrollbar>
        </List>
      ) : null}

      {dialpadOpen ? (
        <Box px={3} py={1}>
          <div style={{ display: "flex" }}>
            <TextField
              id="outlined-search"
              placeholder="Type Number"
              size="small"
              type="numeric"
              value={num}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Cancel color="error" onClick={() => setNumberStr("")} />
                  </InputAdornment>
                ),
              }}
              fullWidth
              onChange={(e) => {}}
            />

            <AppButton
              onClick={() => setDialPadOpen(!dialpadOpen)}
              child={<ListAlt />}
            />
          </div>
        </Box>
      ) : null}

      {dialpadOpen ? (
        <Box px={3} py={0}>
          <AppDialpad onCharReceived={onCharReceived} />

          <div
            style={{
              width: "100%",
              flex: 1,
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {num.length > 0 ? (
              <Button
                onClick={() => {
                  dispatch(setOutgoingDialogVisibilty(true));
                  onCallButtonClick(num);
                }}
                sx={{
                  width: "85%",
                  height: "50px",
                  color: "white",
                  background: "green",
                }}
                color="success"
                variant="contained"
                fullWidth
              >
                Call
              </Button>
            ) : null}
          </div>
        </Box>
      ) : null}
    </div>
  );
};

export default ChatListing;
