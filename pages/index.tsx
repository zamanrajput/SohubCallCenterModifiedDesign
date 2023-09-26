import { useEffect, useState, useRef } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Icon,
  Theme,
  Typography,
} from "@mui/material";
import PageContainer from "../src/components/container/PageContainer";
import Breadcrumb from "../src/layouts/full/shared/breadcrumb/Breadcrumb";
import AppCard from "../src/components/shared/AppCard";
import ChatSidebar from "../src/components/apps/chats/ChatSidebar";
import ChatContent from "../src/components/apps/chats/ChatContent";
import ChatMsgSent from "../src/components/apps/chats/ChatMsgSent";
import { CreateUserAgent } from "../src/utils/SipDiamond.js";

import OutgoingCallDialog from "../src/components/shared/OutGoingCall";
import IncomingCallDialog from "../src/components/shared/IncomingCall";
import { dispatch, useSelector } from "../src/store/Store";
import {
  setAudioSinkRef,
  setGlobalError,
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
} from "../src/store/home/HomeSlice";
import InCallLayout from "../src/layouts/full/shared/incall/InCallLayout";
import { Message } from "sip.js";
import { getCreds } from "../src/store/auth/AuthSlice";
import { navigateTo } from "../src/utils/utils";
import { registerChatsHook } from "../src/store/apps/chat/ChatSlice";
import { ErrorOutline, Warning } from "@mui/icons-material";



export default function Modern() {
  const ref = useRef(null);



  const [isLoading, setLoading] = useState(true);

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const incomingCallbacks = {
    onStatusChange: function onStatusChange(str: string) {
      //("incomingCallbacks", "status:" + str);
      dispatch(setIncomingCallStatus(str));
    },
    onEnd: function onEnd() {
      //("incomingCallbacks", "onEnd");
      dispatch(setInCall(false));
      dispatch(setIncomingCallStatus("Ended"));
    },
    onSuccess: function onSuccess() {
      //call started now or established now
      //("incomingCallbacks", "Success");
      dispatch(setIncomingCallStatus("Established"));


    },
    onInvite: function onInvite(inviterId: string) {
      //working fine
      dispatch(setIncomingCallStatus("Invited"));
      dispatch(setIncomingExtNum(inviterId));
      dispatch(setInCall(false));
      dispatch(setIncomingDialogVisibilty(true));
    },
    onCancleInvite: function onCancleInvite() {
      //WORKING FINE
      //("incomingCallbacks", "Invite Cancelled");
      dispatch(setInCall(false));
    },
  };

  const outgoingCallbacks = {
    onTry: () => {
      dispatch(setOutgoingCallStatus("Calling..."));
      //("outgoinCallbacks", "onTry");
    },
    onRinging: () => {
      dispatch(setOutgoingCallStatus("Ringing..."));
      //("outgoinCallbacks", "onRinging");
    },
    onAccept: () => {
      //(data.outGoingExtNum);
      //("Zaman khuhsh ho ja");
      dispatch(setInCallExtNumber(data.outGoingExtNum));
      dispatch(setInCallUsername(data.outGoingUserName));
      dispatch(setInCallStatus("Established"));
      dispatch(setInCall(true));
      dispatch(setOutgoingDialogVisibilty(false));
      // startTimer();
    },
    onReject: () => {
      dispatch(setOutgoingCallStatus("Call Rejected"));
      dispatch(setOutgoingDialogVisibilty(false));
      dispatch(setOutgoingCallStatus(""));
      dispatch(setOutGoingExtNum(""));
      dispatch(setOutGoingUserName(""));
      dispatch(setInCall(false));
      //("outgoinCallbacks", "onReject");
    },
    onEnd: () => {
      //("outgoinCallbacks", "onEnd");

      dispatch(setOutgoingCallStatus("Call Ended"));
      dispatch(setOutgoingDialogVisibilty(false));

      //("XYZ:DATA CLEARED");
      dispatch(setInCall(false));
      dispatch(setInCallExtNumber(""));
      dispatch(setInCallUsername(""));
      dispatch(setInCallStatus(""));

      dispatch(setOutgoingDialogVisibilty(false));
      dispatch(setOutgoingCallStatus(""));
      dispatch(setOutGoingExtNum(""));
      dispatch(setOutGoingUserName(""));
    },

    onRedirect: () => {
      //("outgoinCallbacks", "onRedirect");
      dispatch(setOutgoingCallStatus("Redirecting"));
      dispatch(setOutgoingDialogVisibilty(true));
    },
    onHang: () => {
      dispatch(setOutgoingCallStatus("Call Ended"));
      dispatch(setOutgoingDialogVisibilty(false));
      dispatch(setInCall(false));

    },
  };

  useEffect(() => {
    // bindIncomingCallBacks(incomingCallbacks);
    // bindOutgoingBacks(outgoingCallbacks);
  }, []);

  useEffect(() => {
    setLoading(false);
  }, []);



  useEffect(() => {
    CreateUserAgent({
      audioElementRef: ref.current,
      onStatusChange: (status: any) => {
        //(status);
      },
      onMessage: (sip: Message) => {
        //(sip.request.from);
        //(sip.request.body);
      }
    });

  }, []);


  const data = useSelector((state) => state.homeReducer);
  const creds = useSelector((state) => state.authReducer);

  const id = useSelector((x) => x.authReducer.user?.id);

  //("XYZ", 'id:' + id);
  if (id != null) {
    //("XYZ", 'registering for hook');
    dispatch(
      registerChatsHook(id));
  }

  if (getCreds().email == '') {
    navigateTo('/auth/login')
  }



  return (
    <PageContainer>

      <Dialog  open={data.errorDialogVisibility} >
        <DialogTitle sx={{padding:1.5,display:'flex',alignItems:'center',minWidth:'300px'}}>
          <ErrorOutline color="error" sx={{marginInlineEnd:"10px",color:'red'}} />
          {data.errorDialogTitle}
        </DialogTitle>

        <DialogContent sx={{paddingTop:4}}>

          <p className="text-700 text-black">{data.errorDialogMessage}</p>

        </DialogContent>
        <DialogActions>
          <Button onClick={()=>dispatch(setGlobalError({visibility:false}))}>
            OKAY
          </Button>
        </DialogActions>

      </Dialog>



     
        <Breadcrumb title="Sohub Call Center" subtitle="Messenger" />
      

      <OutgoingCallDialog />
      <IncomingCallDialog />
      <AppCard>
        {/* ------------------------------------------- */}
        {/* Left part */}
        {/* ------------------------------------------- */}
        <audio autoPlay ref={ref} controls style={{ display: "none" }}></audio>
        <ChatSidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
        {/* ------------------------------------------- */}
        {/* Right part */}
        {/* ------------------------------------------- */}

        <Box flexGrow={1}>
          <ChatContent toggleChatSidebar={() => setMobileSidebarOpen(true)} />
          <Divider />
          <ChatMsgSent />
        </Box>
      </AppCard>
    </PageContainer>
  );
}
