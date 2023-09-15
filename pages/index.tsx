import { useEffect, useState, useRef } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
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

export default function Modern() {
  const ref = useRef(null);



  const [isLoading, setLoading] = useState(true);

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const incomingCallbacks = {
    onStatusChange: function onStatusChange(str: string) {
      console.log("incomingCallbacks", "status:" + str);
      dispatch(setIncomingCallStatus(str));
    },
    onEnd: function onEnd() {
      console.log("incomingCallbacks", "onEnd");
      dispatch(setInCall(false));
      dispatch(setIncomingCallStatus("Ended"));
    },
    onSuccess: function onSuccess() {
      //call started now or established now
      console.log("incomingCallbacks", "Success");
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
      console.log("incomingCallbacks", "Invite Cancelled");
      dispatch(setInCall(false));
    },
  };

  const outgoingCallbacks = {
    onTry: () => {
      dispatch(setOutgoingCallStatus("Calling..."));
      console.log("outgoinCallbacks", "onTry");
    },
    onRinging: () => {
      dispatch(setOutgoingCallStatus("Ringing..."));
      console.log("outgoinCallbacks", "onRinging");
    },
    onAccept: () => {
      console.log(data.outGoingExtNum);
      console.log("Zaman khuhsh ho ja");
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
      console.log("outgoinCallbacks", "onReject");
    },
    onEnd: () => {
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

    onRedirect: () => {
      console.log("outgoinCallbacks", "onRedirect");
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
        console.log(status);
      },
    });
  }, []);

  // function startTimer() {
  //   const seconds = getCounter();
  //   setCounter(seconds + 1);
  //   console.log(`${getCounter()}s`);
  //   setCallDuration(convertSecondsToHMS(getCounter()));
  //   const iid = setInterval(() => {
  //     if (!isStop()) startTimer();
  //     else {
  //       setCallDuration(null);
  //     }
  //     clearInterval(iid);
  //   }, 1000);
  // }

  const data = useSelector((state) => state.homeReducer);

  return (
    <PageContainer>
      {data.inCall ? (
        <InCallLayout />
      ) : (
        <Breadcrumb title="Sohub Call Center" subtitle="Messenger" />
      )}

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
