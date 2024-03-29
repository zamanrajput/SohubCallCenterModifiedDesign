import React from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slide,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "../../store/Store";
import { setInCall, setIncomingDialogVisibilty, setOutgoingDialogVisibilty, startTimer } from "../../store/home/HomeSlice";
import { AnswerAudioCall, RejectCall } from "../../utils/SipDiamond";
import { getChatIndex, getChatWithExt } from "../../utils/utils";
import { SelectChat, createNewChat } from "../../store/apps/chat/ChatSlice";




function IncomingCallDialog() {

  const state = useSelector((x)=>x);


  const dispatch = useDispatch();
  const data = useSelector((state) => state.homeReducer);

  
  function onRejectClick() {
    //("Rejected by you");
    dispatch(setInCall(false));
    dispatch(setIncomingDialogVisibilty(false));
    dispatch(setOutgoingDialogVisibilty(false));
    RejectCall();
  }
  function onAcceptClick() {
    //("Accepted by you");


    const chat = getChatWithExt(state.chatReducer.chats,state.authReducer.user,state.homeReducer.incomingExtNum);
    if(chat!=null){
      dispatch(SelectChat(getChatIndex(state.chatReducer.chats,state.authReducer.user,chat.id)));
    }else{
      dispatch(createNewChat(state.authReducer.user?.id??'',state.homeReducer.inCallUser?.id??''));
    }

    AnswerAudioCall();
    dispatch(setIncomingDialogVisibilty(false));
    dispatch(setOutgoingDialogVisibilty(false));
    dispatch(setInCall(true));
    dispatch(startTimer());
  }






  return (
    <Dialog
      open={data.incomingCallDialogVisiblity}
      keepMounted
      onClose={ async ()=>{onRejectClick()}}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        <Typography variant="h5" align="center">
          Incoming Call
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box mt={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Extension Number:</Typography>
              <Typography variant="h6">{data.incomingExtNum}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Username:</Typography>
              <Typography variant="h6">{data.incomingUserName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" >
                Call Status:
              </Typography>
              <Typography variant="h6">{data.incomingCallStatus}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
               onClick={onRejectClick}
                variant="contained"
                fullWidth
                style={{
                  backgroundColor: "red",
                  color: "white",
                  marginTop: "24px",
                }}
              >
                Reject
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
               onClick={onAcceptClick}
                variant="contained"
                fullWidth
                style={{
                  backgroundColor: "green",
                  color: "white",
                }}
              >
                Accept
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default IncomingCallDialog;
