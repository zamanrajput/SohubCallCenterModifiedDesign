import { IconCircle } from "@tabler/icons-react";
import { useEffect, useState, useRef } from "react";

import {
  Backspace,
  CallEnd,
  CallMade,
  CallReceived,
  Close,
  Dialpad,
  Group,
  Keyboard,
  List,
  Merge,
  Mic,
  MicOff,
  Outbound,
  Pause,
  Phone,
  PhoneForwarded,
  PlayArrow,
} from "@mui/icons-material";
import {
  FormControlLabel,
  IconButton,
  Switch,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Dialog,
  Divider,
  Grid,
  Icon,
  Theme,
  Typography,
} from "@mui/material";
import { dispatch, useSelector } from "../../../../store/Store";
import {
  AttendedTransfer,
  BlindTransfer,
  CancelTransferSession,
  CompleteTransfer,
  ConferenceDial,
  MuteSession,
  UnmuteSession,
  earlyHangUp,
  endSession,
  holdSession,
  mergeConferenceCalls,
  sendDTMF,
  terminateAttendedTransfer,
  unholdSession,
} from "../../../../utils/SipDiamond";
import { setInCall } from "../../../../store/home/HomeSlice";
import dayjs from "dayjs";
import MyTabbedLayout from "../TabbedLayout";

function InCallLayout() {
  const [isMuted, setIsMuted] = useState(false);
  const [isCallOnHold, setIsCallOnHold] = useState(false);
  const [transferVisible, setTransferVisiblity] = useState(false);
  const [count, setCount] = useState(0);
  const [dialpadInput, setDialpadInput] = useState("");
  const [isAttendedTransfer, setIsAttendedTransfer] = useState(false);
  const [subSession, setSubSession] = useState(null);
  const [mainSession, setMainSession] = useState(null);
  const [transferId, setTransferId] = useState<string>("");
  const [transferCallStatus, setTransferCallStatus] = useState("None");
  const [transferAdvanceLayout, setTransferAdvanceLayout] = useState(false);
  const [transferNum, setTransferNum] = useState("1234");
  const [isDTMFOpen, setDTMFVisibility] = useState(false);
  const [conferenceCallMember, setConferenceCallMember] = useState<any>(null);
  const [conferenceCallStatus, setConferenceCallStatus] = useState("Calling");
  const [isMerged, setMerged] = useState<boolean>(false);
  const [conferenceCall, setConferenceCall] = useState(false);
  const [openQuickSettings, setOpenQuickSettings] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState({});

  const openSettings = (event: any) => {
    const xPos = event.clientX;
    const yPos = event.clientY;
    setAnchorPosition({ x: xPos, y: yPos });
    setOpenQuickSettings(true);
  };

  const handleClick = (e: string) => {
    const num = e;
    if (count < 20) {
      setDialpadInput(dialpadInput + num);
      setCount(count + 1);
    }
  };
  const handleRemoveLast = () => {
    if (count > 0) {
      setDialpadInput(dialpadInput.slice(0, -1));
      setCount(count - 1);
    }
  };

  function transferCall(type: string, num: string) {
    console.log(type, num);
    setTransferNum(num);
    if (type === "blind") {
      BlindTransfer(num, {
        onAccept: () => {
          dispatch(setInCall(false));
          setTransferVisiblity(false);
        },
        onReject: () => {
          setTransferVisiblity(false);
          setIsCallOnHold(false);
        },
      });
    } else if (type === "attended") {
      setTransferAdvanceLayout(true);
      AttendedTransfer(num, {
        onSessionReceived: (mainSession: any, subSession: any, tid: string) => {
          setMainSession(mainSession);
          setSubSession(subSession);
          setTransferId(tid);
        },
        onTrying: () => {
          setTransferCallStatus("Trying..");
        },
        onRinging: () => {
          setTransferCallStatus("Ringing..");
        },
        onRedirect: () => {
          setTransferCallStatus("Redirecting..");
        },
        onAccept: (mainSession: any, tid: string) => {
          setTransferCallStatus("Accepted..");
          setMainSession(mainSession);
          setTransferId(tid);
          //mainSession=> you can use it to complete the transfer
        },
        onBye: () => {
          setTransferCallStatus("Ended");
        },
      });
    }
  }

  function completeTransfer() {
    CompleteTransfer(mainSession, subSession, transferId, {
      onAccept: () => {
        //task completed
        dispatch(setInCall(false));
        // setStop(true);
        setTransferVisiblity(false);
      },
      onReject: () => {
        endAttendedTransfer();
        //failed, cancel transfer
      },
    });
  }

  //handle terminate attended transfer
  function endAttendedTransfer() {
    //changeUI
    setTransferCallStatus("Ended");
    setTransferVisiblity(false);
    setTransferAdvanceLayout(false);
    terminateAttendedTransfer(mainSession, subSession, transferId);
    // setStop(true);
    dispatch(setInCall(true));
    toggleCallHold();
  }

  const [callMembers] = useState([]);

  function cancelTransferSession() {
    CancelTransferSession({
      onDone: () => {
        //do the unhold
      },
      onError: (e: any) => {
        console.log(e);
        //can do unhold with warning
      },
    });
  }

  function mergeConferenceCall() {
    mergeConferenceCalls();
    setMerged(true);
    unholdSession();
    setIsCallOnHold(false);
  }
  function removeConferenceMember() {
    conferenceCallMember.session.bye().catch(function (e: any) {
      console.warn("Failed to bye the session!", e);
    });
    console.log("New call session end");
    var confCallId = conferenceCallMember.session.data.confcalls.length - 1;
    conferenceCallMember.session.data.confcalls[confCallId].accept.disposition =
      "bye";
    conferenceCallMember.session.data.confcalls[confCallId].accept.eventTime =
      dayjs().format();
  }

  function addCallMember(num: string) {
    setIsCallOnHold(true);
    holdSession();
    const args: any = {
      dstNo: dialpadInput,
      onData: (session: any, num: string) => {
        const data = {
          session: session,
          number: num,
        };
        setConferenceCallMember(data);
      },
      onEnd: () => {
        setConferenceCallMember(null);
        setMerged(false);
        setConferenceCallStatus("Ended");
      },

      onAccept: () => {
        setConferenceCallStatus("In Progress");
        //accepted now can merge call
      },
      onReject: () => {
        setConferenceCallStatus("Rejected");
        setConferenceCallMember(null);
      },
      onRedirect: (sip: any) => {
        setConferenceCallStatus("Redirecting to " + sip);
      },
      onTry: () => {
        setConferenceCallStatus("Calling..");
      },
      onRinging: () => {
        setConferenceCallStatus("Ringing..");
      },
    };
    ConferenceDial(args);
  }

  const toggleMute = () => {
    if (isMuted) UnmuteSession();
    else MuteSession();
    setIsMuted(!isMuted);
  };

  const toggleCallHold = () => {
    if (isCallOnHold) unholdSession();
    else holdSession();
    setIsCallOnHold(!isCallOnHold);
  };

  const data = useSelector((state) => state.homeReducer);

  function endCall() {
    endSession();
    dispatch(setInCall(false));
  }

  return (
    <Grid
      container
      sx={{
        // backgroundColor: "primary.light",
        backgroundColor: "rgba(144, 238, 144,0.4)",
        borderRadius: (theme: Theme) => theme.shape.borderRadius / 4,
        p: "20px 20px 20px",
        marginBottom: "10px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* <Dialog
        open={transferVisible}
        onClose={() => {
          setTransferVisiblity(false);
        }}
      >
        {transferAdvanceLayout ? (
          <div className="flex flex-col p-3 w-96 items-center">
            <p className="font-bold mb-3 w-full">Attended Transfering</p>
            <Avatar sx={{ width: "120px", height: "120px" }} />
            <p className="font-semibold text-lg mt-4">{transferNum}</p>
            <p className="font-bold text-lg mt-2">{transferCallStatus}</p>

            <div className="mt-2 justify-center align-middle flex">
              <button
                onClick={completeTransfer}
                className="btn btn-sm bg-green-600 hover:bg-green-900 text-white rounded-full  text-xs mx-1"
              >
                <CallEnd /> Complete
              </button>
              <button
                onClick={() => {
                  endAttendedTransfer();
                }}
                className="btn btn-sm bg-red-600 hover:bg-red-900 text-white rounded-full  text-xs mx-1"
              >
                <Close /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-row justify-between pt-3 px-3">
              <p
                style={{
                  color: "black",
                  fontWeight: "500",
                  fontSize: "20px",
                }}
              >
                <div>Call Transfer</div>
              </p>

              <Close
                className="cursor-pointer"
                onClick={() => {
                  setTransferVisiblity(false);
                  toggleCallHold();
                  unholdSession();
                }}
                sx={{ justifySelf: "end" }}
              />
            </div>

            <div className="pb-6 px-3">
              <div className="text-center max-w-sm ">
                <div className="flex w-auto h-12 bg-gray-100 rounded-lg border justify-center mx-2 my-3 text-center items-center">
                  <h5
                    style={{ flex: 5 }}
                    className=" border-none font-bold text-xl"

                  >
                    {" "}
                    {dialpadInput}{" "}
                  </h5>
                  <span style={{ flex: 1 }}>
                    {dialpadInput != "" ? (
                      <div className="bg-red-500 mx-auto justify-center flex hover:bg-red-400 items-center h-9 w-9 rounded-full">
                        <Backspace
                          style={{
                            marginInlineEnd: 3,
                            width: 20,
                            height: 20,
                            color: "white",
                          }}
                          onClick={handleRemoveLast}
                        />
                      </div>
                    ) : null}
                  </span>
                </div>
                <div className="w-full flex">
                  <Switch
                    onChange={(e) => {
                      setIsAttendedTransfer(e.target.checked);
                    }}
                    checked={isAttendedTransfer}
                  />{" "}
                  <span className="self-center ">Attended</span>
                </div>
                <hr />
                <div className="flex flex-wrap mt-3">
                  <div className="w-1/3">
                    <button
                      onClick={() => handleClick("1")}
                      className="mx-2 rounded-full  w-12 h-12 text-xl text-gray-700 font-bold hover:bg-gray-400"
                    >
                      1
                    </button>
                  </div>
                  <div className="w-1/3">
                    <button
                      onClick={() => handleClick("2")}
                      className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                    >
                      2
                    </button>
                  </div>
                  <div className="w-1/3">
                    <button
                      onClick={() => handleClick("3")}
                      className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                    >
                      3
                    </button>
                  </div>
                  <div className="w-1/3">
                    <button
                      onClick={() => handleClick("4")}
                      className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                    >
                      4
                    </button>
                  </div>
                  <div className="w-1/3">
                    <button
                      onClick={() => handleClick("5")}
                      className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                    >
                      5
                    </button>
                  </div>
                  <div className="w-1/3">
                    <button
                      onClick={() => handleClick("6")}
                      className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                    >
                      6
                    </button>
                  </div>
                  <div className="w-1/3">
                    <button
                      onClick={() => handleClick("7")}
                      className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                    >
                      7
                    </button>
                  </div>
                  <div className="w-1/3">
                    <button
                      onClick={() => handleClick("8")}
                      className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                    >
                      8
                    </button>
                  </div>
                  <div className="w-1/3">
                    <button
                      onClick={() => handleClick("9")}
                      className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                    >
                      9
                    </button>
                  </div>
                  <div className="w-1/3">
                    <button
                      onClick={() => handleClick("*")}
                      className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                    >
                      *
                    </button>
                  </div>
                  <div className="w-1/3">
                    <button
                      onClick={() => handleClick("0")}
                      className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                    >
                      0
                    </button>
                  </div>
                  <div className="w-1/3">
                    <button
                      onClick={() => handleClick("#")}
                      className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                    >
                      #
                    </button>
                  </div>
                </div>
                <div className="bg-green-500 mx-auto mt-6 justify-center  flex hover:bg-green-400 items-center h-14 w-14 rounded-full">
                  <PhoneForwarded
                    onClick={() => {
                      transferCall(
                        isAttendedTransfer ? "attended" : "blind",
                        dialpadInput
                      );
                    }}
                    className="justify-center align-middle self-center"
                    sx={{ color: "white" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>
      <Dialog open={isDTMFOpen} onClose={() => setDTMFVisibility(false)}>
        <div className="flex flex-col w-52">
          <div className="flex flex-row justify-between pt-3 px-3">
            <p
              style={{
                color: "black",
                fontWeight: "500",
                fontSize: "20px",
              }}
            >
              <div>DTMF</div>
            </p>

            <Close
              className="cursor-pointer"
              onClick={() => setDTMFVisibility(false)}
              sx={{ justifySelf: "end" }}
            />
          </div>

          <div className="pb-6 px-3">
            <div className="text-center max-w-sm ">
              <div className="flex flex-wrap mt-3">
                <div className="w-1/3">
                  <button
                    onClick={() => sendDTMF("1")}
                    className="mx-2 rounded-full  w-12 h-12 text-xl text-gray-700 font-bold hover:bg-gray-400"
                  >
                    1
                  </button>
                </div>
                <div className="w-1/3">
                  <button
                    onClick={() => sendDTMF("2")}
                    className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                  >
                    2
                  </button>
                </div>
                <div className="w-1/3">
                  <button
                    onClick={() => sendDTMF("3")}
                    className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                  >
                    3
                  </button>
                </div>
                <div className="w-1/3">
                  <button
                    onClick={() => sendDTMF("4")}
                    className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                  >
                    4
                  </button>
                </div>
                <div className="w-1/3">
                  <button
                    onClick={() => sendDTMF("5")}
                    className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                  >
                    5
                  </button>
                </div>
                <div className="w-1/3">
                  <button
                    onClick={() => sendDTMF("6")}
                    className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                  >
                    6
                  </button>
                </div>
                <div className="w-1/3">
                  <button
                    onClick={() => sendDTMF("7")}
                    className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                  >
                    7
                  </button>
                </div>
                <div className="w-1/3">
                  <button
                    onClick={() => sendDTMF("8")}
                    className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                  >
                    8
                  </button>
                </div>
                <div className="w-1/3">
                  <button
                    onClick={() => sendDTMF("9")}
                    className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                  >
                    9
                  </button>
                </div>
                <div className="w-1/3">
                  <button
                    onClick={() => sendDTMF("*")}
                    className="mx-2 rounded-full  w-12 h-12 text-xl  text-gray-700 font-bold hover:bg-gray-400"
                  >
                    *
                  </button>
                </div>
                <div className="w-1/3">
                  <button
                    onClick={() => sendDTMF("0")}
                    className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                  >
                    0
                  </button>
                </div>
                <div className="w-1/3">
                  <button
                    onClick={() => sendDTMF("#")}
                    className="mx-2 rounded-full  w-12 h-12  text-xl  text-gray-700 font-bold hover:bg-gray-400"
                  >
                    #
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog> */}

      <Dialog
        open={transferVisible}
        onClose={() => {
          setTransferVisiblity(false);
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent={"center"}
        >
          {transferAdvanceLayout ? (
            <Grid item xs={12}>
              <Typography variant="h5" align="center" className="font-bold">
                Attended Transfering
              </Typography>
              <Avatar
                sx={{ width: "120px", height: "120px", margin: "auto" }}
              />
              <Typography
                variant="subtitle1"
                align="center"
                className="font-semibold text-lg mt-4"
              >
                {transferNum}
              </Typography>
              <Typography
                variant="subtitle1"
                align="center"
                className="font-bold text-lg mt-2"
              >
                {transferCallStatus}
              </Typography>
              <Grid container justifyContent="center" mt={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={completeTransfer}
                    className="mx-1"
                  >
                    <CallEnd /> Complete
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      endAttendedTransfer();
                    }}
                    className="mx-1"
                  >
                    <Close /> Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                px={2}
                pt={2}
              >
                <Typography
                  variant="h5"
                  style={{
                    color: "black",
                    fontWeight: "500",
                    fontSize: "20px",
                  }}
                >
                  Call Transfer
                </Typography>
                <IconButton
                  onClick={() => {
                    setTransferVisiblity(false);
                    toggleCallHold();
                    unholdSession();
                  }}
                  sx={{ justifySelf: "end" }}
                >
                  <Close />
                </IconButton>
              </Grid>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                maxWidth={"300px"}
                pb={2}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    justifyItems: "center",
                    alignContent: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "85%",
                      height: "50px",
                      backgroundColor: "rgba(0,0,0,0.08)",
                      borderRadius: "10px",
                      justifyContent: "center",
                      justifySelf: "center",
                      justifyItems: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="border-none px-2 font-bold text-xl "
                      style={{ width: "85%" }}
                    >
                      {dialpadInput}
                    </div>

                    <div style={{ width: "18%" }}>
                      {dialpadInput !== "" && (
                        <IconButton
                          className="bg-red-500 mx-auto justify-center hover:bg-red-400 items-center h-9 w-9 rounded-full"
                          onClick={handleRemoveLast}
                        >
                          <Backspace
                            style={{
                              marginInlineEnd: 3,
                              width: 20,
                              height: 20,
                              color: "white",
                            }}
                          />
                        </IconButton>
                      )}
                    </div>
                  </div>
                </Box>
                <Grid container px={5} alignItems="center" mt={1}>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={(e) => {
                          setIsAttendedTransfer(e.target.checked);
                        }}
                        checked={isAttendedTransfer}
                      />
                    }
                    label="Attended"
                  />
                </Grid>
                <hr />
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  px={0}
                  pb={2}
                >
                  <Grid
                    rowSpacing={2}
                    container
                    justifyContent="center"
                    alignItems="center"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", "0", "#"].map((key) => (
                      <Grid item key={key}>
                        <Button
                          onClick={() => handleClick(key.toString())}
                          variant="contained"
                          className="mx-2 rounded-full w-12 h-12 text-xl text-white font-bold hover:bg-gray-400"
                        >
                          {key}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid container justifyContent="center" alignItems="center">
                  <div
                    onClick={() => {
                      transferCall(
                        isAttendedTransfer ? "attended" : "blind",
                        dialpadInput
                      );
                    }}
                    className="bg-green-600 justify-center flex hover:bg-green-700 items-center h-10 w-56 rounded-md cursor-pointer "
                  >
                    <PhoneForwarded
                      sx={{ color: "white", marginInlineEnd: "8px" }}
                    />
                    <span style={{ color: "white", fontWeight: "600" }}>
                      {isAttendedTransfer ? "Attended " : "Blind "}Transfer
                    </span>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Dialog>
      <Dialog open={isDTMFOpen} onClose={() => setDTMFVisibility(false)}>
        <Grid
          container
          spacing={2}
          padding={"0px"}
          maxWidth={"300px"}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12} margin={0}>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              px={2}
              pt={2}
            >
              <Typography
                variant="h6"
                style={{ color: "black", fontWeight: "500", fontSize: "20px" }}
              >
                DTMF
              </Typography>
              <IconButton
                onClick={() => setDTMFVisibility(false)}
                sx={{ justifySelf: "end" }}
              >
                <Close />
              </IconButton>
            </Grid>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              px={0}
              pb={2}
            >
              <Grid
                rowSpacing={2}
                container
                justifyContent="center"
                alignItems="center"
                mt={3}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", "0", "#"].map((key) => (
                  <Grid item key={key}>
                    <Button
                      onClick={() => sendDTMF(key)}
                      variant="contained"
                      className="mx-2 rounded-full w-12 h-12 text-xl text-white font-bold hover:bg-gray-400"
                    >
                      {key}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>

      <Dialog
        open={conferenceCall}
        onClose={() => {
          setConferenceCall(false);
        }}
      >
        {transferAdvanceLayout ? (
          <div className="flex flex-col p-3 w-96 items-center">
            <p className="font-bold mb-3 w-full">Attended Transfering</p>
            <Avatar sx={{ width: "120px", height: "120px" }} />
            <p className="font-semibold text-lg mt-4">{transferNum}</p>
            <p className="font-bold text-lg mt-2">{transferCallStatus}</p>

            <div className="mt-2 justify-center align-middle flex">
              <button
                onClick={completeTransfer}
                className="btn btn-sm bg-green-600 hover:bg-green-900 text-white rounded-full  text-xs mx-1"
              >
                <CallEnd /> Complete
              </button>
              <button
                onClick={() => {
                  endAttendedTransfer();
                }}
                className="btn btn-sm bg-red-600 hover:bg-red-900 text-white rounded-full  text-xs mx-1"
              >
                <Close /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-80">
            <div className="flex flex-row justify-between pt-3 px-3">
              <p
                style={{
                  color: "black",
                  fontWeight: "500",
                  fontSize: "20px",
                }}
              >
                Add Member
              </p>

              <Close
                className="cursor-pointer"
                onClick={() => {
                  setConferenceCall(false);
                  toggleCallHold();
                }}
                sx={{ justifySelf: "end" }}
              />
            </div>

            <div className="pb-6 px-3">
              <div className="text-center max-w-sm ">
                <div className="flex w-auto h-12 bg-gray-100 rounded-lg border justify-center mx-2 my-3 text-center items-center">
                  <h5
                    style={{ flex: 5 }}
                    className=" border-none font-bold text-xl"
                  >
                    {" "}
                    {dialpadInput}{" "}
                  </h5>
                  <span style={{ flex: 1 }}>
                    {dialpadInput != "" ? (
                      <div className="bg-red-500 mx-auto justify-center flex hover:bg-red-400 items-center h-9 w-9 rounded-full">
                        <Backspace
                          style={{
                            marginInlineEnd: 3,
                            width: 20,
                            height: 20,
                            color: "white",
                          }}
                          onClick={handleRemoveLast}
                        />
                      </div>
                    ) : null}
                  </span>
                </div>

                <hr />
                <MyTabbedLayout
                  defaultSelection={0}
                  onSelection={(value: any) => {}}
                  tabs={[
                    {
                      title: <Dialpad />,
                      element: (
                        <div className=" flex flex-wrap mt-3">
                          <Grid
                            container
                            justifyContent="center"
                            alignItems="center"
                            px={0}
                            pb={0}
                            pt={1}
                          >
                            <Grid
                              rowSpacing={2}
                              container
                              justifyContent="center"
                              alignItems="center"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", "0", "#"].map(
                                (key) => (
                                  <Grid item key={key}>
                                    <Button
                                      onClick={() =>
                                        handleClick(key.toString())
                                      }
                                      variant="contained"
                                      className="mx-2 rounded-full w-12 h-12 text-xl text-white font-bold hover:bg-gray-400"
                                    >
                                      {key}
                                    </Button>
                                  </Grid>
                                )
                              )}
                            </Grid>
                          </Grid>
                          <div className="w-full flex-row gap-3 justify-center flex">
                            {conferenceCallMember === null ? (
                              <div
                                onClick={() => {
                                  addCallMember(dialpadInput);
                                }}
                                className="bg-green-500  mt-6 justify-center  flex hover:bg-green-400 items-center h-14 w-14 rounded-full"
                              >
                                <PhoneForwarded
                                  className="justify-center align-middle self-center"
                                  sx={{ color: "white" }}
                                />
                              </div>
                            ) : (
                              <>
                                {" "}
                                {isMerged ? (
                                  <div className="text-white w-16 h-12 justify-center align-middle flex  rounded-full  bg-red-500  hover:bg-red-600 shadow-md hover:shadow-xl">
                                    <CallEnd className="justify-center align-middle self-center" />
                                  </div>
                                ) : (
                                  <div
                                    onClick={() => {
                                      mergeConferenceCall();
                                    }}
                                    className="bg-sky-500  mt-6 justify-center  flex hover:bg-sky-400 items-center h-14 w-14 rounded-full"
                                  >
                                    <Merge
                                      className="justify-center align-middle self-center"
                                      sx={{ color: "white" }}
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: <List />,
                      element: (
                        <div className="flex flex-row h-72 justify-center items-center ">
                          <div className="flex-1 flex w-full h-72 flex-col pt-2 overflow-auto">
                            <div
                              onClick={() => {}}
                              className="flex flex-row  mx-2 my-1 hover:bg-blue-200 cursor-pointer "
                              style={{
                                borderRadius: "6px",
                                boxShadow: "0px 0px 2px 1px rgba(0,0,0,0.1)",
                                padding: "6px",
                              }}
                            >
                              <div className="flex-1 flex-row flex">
                                <Avatar
                                  sx={{
                                    width: "25px",
                                    height: "25px",
                                    marginInlineEnd: "4px",
                                    alignSelf: "center",
                                  }}
                                />
                                <div
                                  style={{
                                    color: "black",
                                    alignItems: "center",
                                  }}
                                  className="flex flex-col "
                                >
                                  <p
                                    style={{
                                      fontSize: 12,
                                      fontWeight: "600",
                                      marginInlineStart: "4px",
                                    }}
                                  >
                                    Me
                                  </p>
                                  <p
                                    style={{
                                      fontSize: 10,
                                      fontWeight: "400",
                                      marginInlineStart: "4px",
                                      alignSelf: "start",
                                    }}
                                  >
                                    {905}
                                  </p>
                                </div>
                              </div>
                              <div className="flex-row flex flex-1 flex-right justify-end ">
                                <div
                                  style={{
                                    color: "gray",
                                    alignSelf: "right",
                                  }}
                                  className="flex flex-col "
                                >
                                  <p
                                    style={{
                                      fontSize: 10,
                                      fontWeight: "600",
                                      marginInlineStart: "4px",
                                    }}
                                  >
                                    {dayjs().format("hh:mm a")}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: 10,
                                      fontWeight: "600",
                                      marginInlineStart: "4px",
                                      alignSelf: "start",
                                      color: "green",
                                    }}
                                  >
                                    Connected
                                  </p>
                                </div>
                                <Outbound
                                  sx={{
                                    marginInlineStart: "10px",
                                    width: "18px",
                                    height: "18px",
                                  }}
                                  style={{ alignSelf: "center" }}
                                  color={"success"}
                                />
                              </div>
                            </div>
                            {conferenceCallMember !== null ? (
                              <div
                                onClick={() => {}}
                                className="flex flex-row  mx-2 my-1 hover:bg-blue-200 cursor-pointer "
                                style={{
                                  borderRadius: "6px",
                                  boxShadow: "0px 0px 2px 1px rgba(0,0,0,0.1)",
                                  padding: "6px",
                                }}
                              >
                                <div className="flex-1 flex-row flex">
                                  <Avatar
                                    sx={{
                                      width: "25px",
                                      height: "25px",
                                      marginInlineEnd: "4px",
                                      alignSelf: "center",
                                    }}
                                  />
                                  <div
                                    style={{
                                      color: "black",
                                      alignItems: "center",
                                    }}
                                    className="flex flex-col "
                                  >
                                    <p
                                      style={{
                                        fontSize: 12,
                                        fontWeight: "600",
                                        marginInlineStart: "4px",
                                      }}
                                    >
                                      Member
                                    </p>
                                    <p
                                      style={{
                                        fontSize: 10,
                                        fontWeight: "400",
                                        marginInlineStart: "4px",
                                        alignSelf: "start",
                                      }}
                                    >
                                      {conferenceCallMember.number}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex-row flex flex-1 flex-right justify-end ">
                                  <div
                                    style={{
                                      color: "gray",
                                      alignSelf: "right",
                                    }}
                                    className="flex flex-col "
                                  >
                                    <p
                                      style={{
                                        fontSize: 10,
                                        fontWeight: "600",
                                        marginInlineStart: "4px",
                                      }}
                                    >
                                      {dayjs().format("hh:mm a")}
                                    </p>
                                    <p
                                      style={{
                                        fontSize: 10,
                                        fontWeight: "600",
                                        marginInlineStart: "4px",
                                        alignSelf: "start",
                                        color: "green",
                                      }}
                                    >
                                      {conferenceCallStatus}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        )}
      </Dialog>

      <Grid item xs={12} sm={6} lg={8} mb={1}>
        <Typography variant="h3">{data.inCallUserName}</Typography>
        <Typography mt={0.8} variant="h4">
          {data.inCallExtNumber}
        </Typography>
        <Typography
          color="textSecondary"
          variant="h6"
          fontWeight={400}
          mt={1.2}
          mx={1}
        >
          {`Call ${data.inCallStatus}`}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} lg={4} display="flex" alignItems="flex-end">
        <Box
          sx={{
            display: { xs: "none", md: "block", lg: "flex" },
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "30%",
              height: "100%",
              top: "0px",
              position: "absolute",
            }}
          >
            <Container maxWidth="sm" sx={{ paddingTop: "20px", width: "80%" }}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      sx={{ height: "40px" }}
                      fullWidth
                      onClick={toggleMute}
                    >
                      {isMuted ? <MicOff /> : <Mic />}
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      onClick={() => {
                        setTransferVisiblity(true);
                        toggleCallHold();
                      }}
                      variant="contained"
                      fullWidth
                      sx={{ height: "40px" }}
                    >
                      <CallMade />
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      onClick={endCall}
                      variant="contained"
                      fullWidth
                      sx={{ height: "40px", background: "red" }}
                    >
                      <CallEnd />
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={toggleCallHold}
                      sx={{ height: "40px" }}
                    >
                      {isCallOnHold ? <Pause /> : <PlayArrow />}
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      onClick={() => setDTMFVisibility(true)}
                      variant="contained"
                      sx={{ height: "40px", background: "" }}
                      fullWidth
                    >
                      <Keyboard />
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      onClick={() => {
                        setConferenceCall(true);
                        toggleCallHold();
                      }}
                      variant="contained"
                      sx={{ height: "40px", background: "" }}
                      fullWidth
                    >
                      <Group />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Container>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default InCallLayout;
