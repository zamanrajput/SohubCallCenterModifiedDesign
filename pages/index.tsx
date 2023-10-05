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
  Popover,
  Typography
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
  setGlobalError,
  setInCall,
  setInCallUser,
  setInCallUsername,
  setIncomingCallStatus,
  setIncomingDialogVisibilty,
  setIncomingExtNum,
  setIncomingUserName,

} from "../src/store/home/HomeSlice";
import InCallLayout from "../src/layouts/full/shared/incall/InCallLayout";
import { Invitation, Message } from "sip.js";
import { getCreds } from "../src/store/auth/AuthSlice";
import { navigateTo } from "../src/utils/utils";
import { registerChatsHook } from "../src/store/apps/chat/ChatSlice";
import { ErrorOutline, Warning } from "@mui/icons-material";
import LottieAnimationView from "../src/components/LottieAnimationView";
import loadingAnimationData from '../src/lotties/sending_animation.json'
import { getUserFromExt } from "../src/utils/WebSocket";


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
    onInviteCancel:function (){
      dispatch(setIncomingDialogVisibilty(false));

    },
    onInvite: function onInvite(invitation: Invitation) {




      if (data.inCall) {
        invitation.reject();
        dispatch(setGlobalError({ visibility: true, title: 'Call Rejected', message: "Someone  trying to Call you while you were in Call, auto rejected!" }))
        return;
      }



      //working fine
      dispatch(setIncomingCallStatus("Invited"));
      getUserFromExt(invitation.remoteIdentity.uri.user ?? '', (found) => {
        dispatch(setIncomingExtNum(found.sip_extension));
        dispatch(setInCallUsername(found.display_name));
        dispatch(setIncomingDialogVisibilty(true));
        dispatch(setIncomingUserName(found.display_name));
        dispatch(setInCallUser(found));
      }, () => {
        invitation.reject();
        dispatch(setGlobalError({ visibility: true, title: 'Threat Found', message: "Someone from out-of-this database trying to contact you, auto rejected!" }))
      });


    },
    onCancel: function onCancleInvite() {

      dispatch(setInCall(false));
    },
  };





  const data = useSelector((state) => state.homeReducer);
  const creds = useSelector((state) => state.authReducer.user);

  const id = useSelector((x) => x.authReducer.user?.id);

  //("XYZ", 'id:' + id);
  if (id != null) {
    //("XYZ", 'registering for hook');
    dispatch(
      registerChatsHook(id));
  }

  if (getCreds().email == '') {
    navigateTo('/auth/login')
    return;
  }

  useEffect(() => {
    setLoading(false);
  }, []);



  const user = useSelector((s) => s.authReducer.user);

  const [isDone, setIsDone] = useState(false);

  if (!isDone) {

    if (getCreds().email != '') {
      if (user != null) {
        CreateUserAgent({
          audioElementRef: ref.current,
          onStatusChange: (status: any) => {
            //(status);
          },
          onMessage: (sip: Message) => {
            //(sip.request.from);
            //(sip.request.body);
          },
          incomingCallBacks: incomingCallbacks,
          user: user
        });
        setIsDone(true);
      }

    }

  }




  return (
    <PageContainer>


      <Dialog open={data.progressVisibility} hideBackdrop   >
        <Typography padding={1.4} sx={{ width: '230px', fontWeight: '600' }} color={'primary'}>
          {data.progresTitle}
        </Typography>
        <LottieAnimationView width={150} height={100} animationData={loadingAnimationData} />

      </Dialog>

      <Dialog open={data.errorDialogVisibility} >
        <DialogTitle sx={{ padding: 1.5, display: 'flex', alignItems: 'center', minWidth: '300px' }}>
          <ErrorOutline color="error" sx={{ marginInlineEnd: "10px", color: 'red' }} />
          {data.errorDialogTitle}
        </DialogTitle>

        <DialogContent sx={{ paddingTop: 4 }}>

          <p className="text-700 text-black">{data.errorDialogMessage}</p>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(setGlobalError({ visibility: false }))}>
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
