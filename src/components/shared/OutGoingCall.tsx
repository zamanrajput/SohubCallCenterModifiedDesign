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
import { TransitionProps } from "@mui/material/transitions";
import { useSelector, useDispatch } from "../../store/Store";
import { setOutGoingExtNum, setOutGoingUserName, setOutgoingDialogVisibilty } from "../../store/home/HomeSlice";
import { earlyHangUp } from "../../utils/SipDiamond";



function OutgoingCallDialog() {


  const dispatch = useDispatch();
  const data = useSelector((state) => state.homeReducer);


  const onEndClick = ()=>{
    earlyHangUp();
    dispatch(setOutgoingDialogVisibilty(false))
  }



  return (
    <Dialog
      open={data.outgoingCallDialogVisiblity}
      keepMounted
      onClose={ async ()=>{onEndClick()}}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        <Typography variant="h5" align="center">
          Outgoing Call
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box mt={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Dialed Number:</Typography>
              <Typography variant="h6">{data.outGoingExtNum}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Username:</Typography>
              <Typography variant="h6">{data.outGoingUserName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" style={{ marginTop: "16px" }}>
                Call Status:
              </Typography>
              <Typography variant="h6">{data.outgoingCallStatus}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
               onClick={onEndClick}
                variant="contained"
                fullWidth
                style={{
                  backgroundColor: "red",
                  color: "white",
                  marginTop: "24px",
                }}
              >
                End Call
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default OutgoingCallDialog;
