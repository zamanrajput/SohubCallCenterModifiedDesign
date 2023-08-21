/* eslint-disable no-unused-vars */
import {
  Registerer,
  RegistererState,
  SessionState,
  Subscriber,
  SubscriptionState,
  UserAgent,
  Inviter,
} from "sip.js";

let AutoDeleteDefault = true; // For automatically created buddies (inbound and outbound), should the buddy be set to AutoDelete.

let SubscribeBuddyAccept = "application/pidf+xml";
let SubscribeBuddyEvent = "presence";
let SubscribeBuddyExpires = parseInt("300");
let NoAnswerTimeout = parseInt("120");
let AutoAnswerEnabled = "0" === "1";
let CallWaitingEnabled = "1" === "1";
let AutoGainControl = "1" === "1";
let EchoCancellation = "1" === "1";
let NoiseSuppression = "1" === "1";
let maxFrameRate = "";
let videoHeight = "";
let MaxVideoBandwidth = parseInt("2048");
let videoAspectRatio = "1.33";
let DidLength = parseInt("6");
let MaxDidLength = parseInt("16");
let IntercomPolicy = "enabled";
let EnableAlphanumericDial = "0" === "1";
let EnableVideoCalling = "1" === "1";
let EnableRingtone = "1" === "1";
let profileUserID = username;
let SubscribeToYourself = "0" == "1"; // Enable Subscribe to your own uri. (Useful to understand how other buddies see you.)

let TransportConnectionTimeout = parseInt(15); // The timeout in seconds for the initial connection to make on the web socket port
let BundlePolicy = "balanced"; // SDP Media Bundle: max-bundle | max-compat | balanced https://webrtcstandards.info/sdp-bundle/
let IceStunCheckTimeout = 500; // Set amount of time in milliseconds to wait for the ICE/STUN server
let userAgentStr = "Browser Phone "; //+appversion +     " (SIPJS - " +  sipjsversion +  ") " + navUserAgent // Set this to whatever you want.
// let NoAnswerTimeout = 120; // Time in seconds before automatic Busy Here sent
let IceStunServerJson = ""; // Sets the JSON string for ice Server. Default: [{ "urls": "stun:stun.l.google.com:19302" }] Must be https://developer.mozilla.org/en-US/docs/Web/API/RTCConfiguration/iceServers
let IpInContact = "1" == "1"; // Set a random IP address as the host value in the Contact header field and Via sent-by parameter. (Suggested for Asterisk)
let RegisterExpires = 300; // Registration expiry time (in seconds)
let RegisterExtraHeaders = "{}"; // Parsable Json string of headers to include in register process. eg: '{"foo":"bar"}'
let RegisterExtraContactParams = "{}"; // Parsable Json string of extra parameters add to the end (after >) of contact header during register. eg: '{"foo":"bar"}'
let RegisterContactParams = "{}"; // Parsable Json string of extra parameters added to contact URI during register. eg: '{"foo":"bar"}'
let WssInTransport = "1" == "1"; // Set the transport parameter to wss when used in SIP URIs. (Required for Asterisk as it doesn't support Path)
let TransportReconnectionAttempts = parseInt(999); // The number of times to attempt to reconnect to a WebSocket when the connection drops.
let TransportReconnectionTimeout = 3; // The time in seconds to wait between WebSocket reconnection attempts.

let SubscribeVoicemailExpires = 300; // Voceimail Subscription expiry time (in seconds)

//utils
function uID() {
  return (
    Date.now() +
    Math.floor(Math.random() * 10000)
      .toString(16)
      .toUpperCase()
  );
}

function utcDateNow() {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
}

// Phone Lines
// ===========
var Line = function (lineNumber, displayName, displayNumber, buddyObj) {
  this.LineNumber = lineNumber;
  this.DisplayName = displayName;
  this.DisplayNumber = displayNumber;
  this.IsSelected = false;
  this.BuddyObj = buddyObj;
  this.SipSession = null;
  this.LocalSoundMeter = null;
  this.RemoteSoundMeter = null;
};

function getAudioSrcID() {
  var id = localStorage.getItem("AudioSrcId");
  return id != null ? id : "default";
}
function getAudioOutputID() {
  var id = localStorage.getItem("AudioOutputId");
  return id != null ? id : "default";
}
function getVideoSrcID() {
  var id = localStorage.getItem("VideoSrcId");
  return id != null ? id : "default";
}
function getRingerOutputID() {
  var id = localStorage.getItem("RingOutputId");
  return id != null ? id : "default";
}
function countSessions(id) {
  var rtn = 0;
  if (userAgent == null) {
    console.warn("userAgent is null");
    return 0;
  }

  return rtn;
}

//
let userAgent = null;
let Buddies = [];
let HasVideoDevice = false;
let HasAudioDevice = false;
let AudioinputDevices = [];
let VideoinputDevices = [];
let Lines = [];
let lang = {};
let audioBlobs = {};
let newLineNumber = 1;
let telNumericRegEx = /[^\d*#+]/g;
let telAlphanumericRegEx = /[^\da-zA-Z*#+-_.!~'()]/g;

//user config
var domain = "webrtc-test.tolpar.com.bd";
//over server is on websockets server, websockets working fine but not registering lemme run?ok run is these are okay?
var username = "905";
var password = "6fd9d726ded5a376713b8a874959bcc5";
var socketPort = 8089;
var wspath = "/ws";
var displayName = "905";

//check these yes ok

// function DoRemoveBuddy(buddy) {
//   for (var b = 0; b < Buddies.length; b++) {
//     if (Buddies[b].identity == buddy) {
//       RemoveBuddyMessageStream(Buddies[b]);
//       UnsubscribeBuddy(Buddies[b]);
//       if (Buddies[b].type == "xmpp") XmppRemoveBuddyFromRoster(Buddies[b]);
//       Buddies.splice(b, 1);
//       break;
//     }
//   }
// }

function FindBuddyByDid(did) {
  // Used only in Inbound
  for (var b = 0; b < Buddies.length; b++) {
    if (
      Buddies[b].ExtNo == did ||
      Buddies[b].MobileNumber == did ||
      Buddies[b].ContactNumber1 == did ||
      Buddies[b].ContactNumber2 == did
    ) {
      return Buddies[b];
    }
  }
  return null;
}
export function holdSession() {
  if (lineObj == null || lineObj.SipSession == null) return;
  var session = lineObj.SipSession;
  if (session.isOnHold == true) {
    console.log("Call is is already on hold:", lineNum);
    return;
  }
  var lineNum = lineObj.LineNumber;
  console.log("Putting Call on hold:", lineNum);
  session.isOnHold = true;

  var sessionDescriptionHandlerOptions =
    session.sessionDescriptionHandlerOptionsReInvite;
  sessionDescriptionHandlerOptions.hold = true;
  session.sessionDescriptionHandlerOptionsReInvite =
    sessionDescriptionHandlerOptions;

  var options = {
    requestDelegate: {
      onAccept: function () {
        if (
          session &&
          session.sessionDescriptionHandler &&
          session.sessionDescriptionHandler.peerConnection
        ) {
          var pc = session.sessionDescriptionHandler.peerConnection;
          // Stop all the inbound streams
          pc.getReceivers().forEach(function (RTCRtpReceiver) {
            if (RTCRtpReceiver.track) RTCRtpReceiver.track.enabled = false;
          });
          // Stop all the outbound streams (especially useful for Conference Calls!!)
          pc.getSenders().forEach(function (RTCRtpSender) {
            // Mute Audio
            if (RTCRtpSender.track && RTCRtpSender.track.kind == "audio") {
              if (RTCRtpSender.track.IsMixedTrack == true) {
                if (
                  session.data.AudioSourceTrack &&
                  session.data.AudioSourceTrack.kind == "audio"
                ) {
                  console.log(
                    "Muting Mixed Audio Track : " +
                      session.data.AudioSourceTrack.label
                  );
                  session.data.AudioSourceTrack.enabled = false;
                }
              }
              console.log("Muting Audio Track : " + RTCRtpSender.track.label);
              RTCRtpSender.track.enabled = false;
            }
            // Stop Video
            else if (RTCRtpSender.track && RTCRtpSender.track.kind == "video") {
              RTCRtpSender.track.enabled = false;
            }
          });
        }
        session.isOnHold = true;
        console.log("Call is is on hold:", lineNum);

        // //"#line-" + lineNum + "-btn-Hold").hide();
        // //"#line-" + lineNum + "-btn-Unhold").show();
        // //"#line-" + lineNum + "-msg").html(lang.call_on_hold);

        // Log Hold
        if (!session.data.hold) session.data.hold = [];
        session.data.hold.push({ event: "hold", eventTime: utcDateNow() });

        // updateLineScroll(lineNum);
      },
      onReject: function () {
        session.isOnHold = false;
        console.warn("Failed to put the call on hold:", lineNum);
      },
    },
  };
  session.invite(options).catch(function (error) {
    session.isOnHold = false;
    console.warn("Error attempting to put the call on hold:", error);
  });
}
export function unholdSession() {
  if (!inCall) return;
  if (lineObj == null || lineObj.SipSession == null) return;
  var session = lineObj.SipSession;
  var lineNum = lineObj.LineNumber;
  if (session.isOnHold == false) {
    console.log("Call is already off hold:", lineNum);
    return;
  }
  console.log("Taking call off hold:", lineNum);
  session.isOnHold = false;

  var sessionDescriptionHandlerOptions =
    session.sessionDescriptionHandlerOptionsReInvite;
  sessionDescriptionHandlerOptions.hold = false;
  session.sessionDescriptionHandlerOptionsReInvite =
    sessionDescriptionHandlerOptions;

  var options = {
    requestDelegate: {
      onAccept: function () {
        if (
          session &&
          session.sessionDescriptionHandler &&
          session.sessionDescriptionHandler.peerConnection
        ) {
          var pc = session.sessionDescriptionHandler.peerConnection;
          // Restore all the inbound streams
          pc.getReceivers().forEach(function (RTCRtpReceiver) {
            if (RTCRtpReceiver.track) RTCRtpReceiver.track.enabled = true;
          });
          // Restore all the outbound streams
          pc.getSenders().forEach(function (RTCRtpSender) {
            // Unmute Audio
            if (RTCRtpSender.track && RTCRtpSender.track.kind == "audio") {
              if (RTCRtpSender.track.IsMixedTrack == true) {
                if (
                  session.data.AudioSourceTrack &&
                  session.data.AudioSourceTrack.kind == "audio"
                ) {
                  console.log(
                    "Unmuting Mixed Audio Track : " +
                      session.data.AudioSourceTrack.label
                  );
                  session.data.AudioSourceTrack.enabled = true;
                }
              }
              console.log("Unmuting Audio Track : " + RTCRtpSender.track.label);
              RTCRtpSender.track.enabled = true;
            } else if (
              RTCRtpSender.track &&
              RTCRtpSender.track.kind == "video"
            ) {
              RTCRtpSender.track.enabled = true;
            }
          });
        }
        session.isOnHold = false;
        console.log("Call is off hold:", lineNum);

        // //"#line-" + lineNum + "-btn-Hold").show();
        // //"#line-" + lineNum + "-btn-Unhold").hide();
        // //"#line-" + lineNum + "-msg").html(lang.call_in_progress);

        // Log Hold
        if (!session.data.hold) session.data.hold = [];
        session.data.hold.push({ event: "unhold", eventTime: utcDateNow() });

        // updateLineScroll(lineNum);
      },
      onReject: function () {
        session.isOnHold = true;
        console.warn("Failed to put the call on hold", lineNum);
      },
    },
  };
  session.invite(options).catch(function (error) {
    session.isOnHold = true;
    console.warn("Error attempting to take to call off hold", error);
  });
}
export function MuteSession() {
  if (lineObj == null || lineObj.SipSession == null) return;

  var session = lineObj.SipSession;
  var pc = session.sessionDescriptionHandler.peerConnection;
  pc.getSenders().forEach(function (RTCRtpSender) {
    if (RTCRtpSender.track && RTCRtpSender.track.kind == "audio") {
      if (RTCRtpSender.track.IsMixedTrack == true) {
        if (
          session.data.AudioSourceTrack &&
          session.data.AudioSourceTrack.kind == "audio"
        ) {
          console.log(
            "Muting Mixed Audio Track : " + session.data.AudioSourceTrack.label
          );
          session.data.AudioSourceTrack.enabled = false;
        }
      }
      console.log("Muting Audio Track : " + RTCRtpSender.track.label);
      RTCRtpSender.track.enabled = false;
    }
  });

  if (!session.data.mute) session.data.mute = [];
  session.data.mute.push({ event: "mute", eventTime: utcDateNow() });
  session.data.ismute = true;

  // updateLineScroll(lineNum);
}
export function UnmuteSession() {
  var lineObj = FindLineByNumber(lineNum);
  if (lineObj == null || lineObj.SipSession == null) return;

  var lineNum = lineObj.LineNumber;

  //call the unmute success

  var session = lineObj.SipSession;
  var pc = session.sessionDescriptionHandler.peerConnection;
  pc.getSenders().forEach(function (RTCRtpSender) {
    if (RTCRtpSender.track && RTCRtpSender.track.kind == "audio") {
      if (RTCRtpSender.track.IsMixedTrack == true) {
        if (
          session.data.AudioSourceTrack &&
          session.data.AudioSourceTrack.kind == "audio"
        ) {
          console.log(
            "Unmuting Mixed Audio Track : " +
              session.data.AudioSourceTrack.label
          );
          session.data.AudioSourceTrack.enabled = true;
        }
      }
      console.log("Unmuting Audio Track : " + RTCRtpSender.track.label);
      RTCRtpSender.track.enabled = true;
    }
  });

  if (!session.data.mute) session.data.mute = [];
  session.data.mute.push({ event: "unmute", eventTime: utcDateNow() });
  session.data.ismute = false;
}
function MixAudioStreams(MultiAudioTackStream) {
  // Takes in a MediaStream with any number of audio tracks and mixes them together

  var audioContext = null;
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
  } catch (e) {
    console.warn("AudioContext() not available, cannot record");
    return MultiAudioTackStream;
  }
  var mixedAudioStream = audioContext.createMediaStreamDestination();
  MultiAudioTackStream.getAudioTracks().forEach(function (audioTrack) {
    var srcStream = new MediaStream();
    srcStream.addTrack(audioTrack);
    var streamSourceNode = audioContext.createMediaStreamSource(srcStream);
    streamSourceNode.connect(mixedAudioStream);
  });

  return mixedAudioStream.stream;
}
export function ConferenceDial({
  dstNo,
  onData,
  onEnd,
  onRedirect,
  onAccept,
  onReject,
  onRinging,
  onTry,
  onMerged,
}) {
  if (EnableAlphanumericDial) {
    dstNo = dstNo.replace(telAlphanumericRegEx, "").substring(0, MaxDidLength);
  } else {
    dstNo = dstNo.replace(telNumericRegEx, "").substring(0, MaxDidLength);
  }
  if (dstNo == "") {
    console.warn("Cannot transfer, must be [0-9*+#]");
    return;
  }

  if (lineObj == null || lineObj.SipSession == null) {
    console.warn("Null line or session");
    return;
  }
  var session = lineObj.SipSession;

  if (!session.data.confcalls) session.data.confcalls = [];
  session.data.confcalls.push({
    to: dstNo,
    startTime: utcDateNow(),
    disposition: "invite",
    dispositionTime: utcDateNow(),
    accept: {
      complete: null,
      eventTime: null,
      disposition: "",
    },
  });
  var confCallId = session.data.confcalls.length - 1;

  // SDP options
  var supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
  var spdOptions = {
    sessionDescriptionHandlerOptions: {
      earlyMedia: true,
      constraints: {
        audio: { deviceId: "default" },
        video: false,
      },
    },
  };
  if (session.data.AudioSourceDevice != "default") {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
      exact: session.data.AudioSourceDevice,
    };
  }
  // Add additional Constraints
  if (supportedConstraints.autoGainControl) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl =
      AutoGainControl;
  }
  if (supportedConstraints.echoCancellation) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
      EchoCancellation;
  }
  if (supportedConstraints.noiseSuppression) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
      NoiseSuppression;
  }

  // Unlikely this will work
  if (session.data.withvideo) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.video = true;
    if (session.data.VideoSourceDevice != "default") {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.deviceId = {
        exact: session.data.VideoSourceDevice,
      };
    }
    // Add additional Constraints
    if (supportedConstraints.frameRate && maxFrameRate != "") {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.frameRate =
        maxFrameRate;
    }
    if (supportedConstraints.height && videoHeight != "") {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.height =
        videoHeight;
    }
    if (supportedConstraints.aspectRatio && videoAspectRatio != "") {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.aspectRatio =
        videoAspectRatio;
    }
  }

  // Create new call session
  console.log("CONFERENCE INVITE: ", "sip:" + dstNo + "@" + domain);

  var targetURI = UserAgent.makeURI(
    "sip:" + dstNo.replace(/#/g, "%23") + "@" + domain
  );
  var newSession = new Inviter(userAgent, targetURI, spdOptions);
  newSession.data = {};

  newSession.delegate = {
    onBye: function (sip) {
      console.log("New call session ended with BYE");
      session.data.confcalls[confCallId].disposition = "bye";
      session.data.confcalls[confCallId].dispositionTime = utcDateNow();
      onEnd();
    },
    onSessionDescriptionHandler: function (sdh, provisional) {
      if (sdh) {
        if (sdh.peerConnection) {
          sdh.peerConnection.ontrack = function (event) {
            var pc = sdh.peerConnection;

            // Gets Remote Audio Track (Local audio is setup via initial GUM)
            var remoteStream = new MediaStream();
            pc.getReceivers().forEach(function (receiver) {
              if (receiver.track && receiver.track.kind == "audio") {
                remoteStream.addTrack(receiver.track);
              }
            });

            remoteAudio.srcObject = remoteStream;
            remoteAudio.onloadedmetadata = function (e) {
              if (typeof remoteAudio.sinkId !== "undefined") {
                remoteAudio
                  .setSinkId(session.data.AudioOutputDevice)
                  .then(function () {
                    console.log(
                      "sinkId applied: " + session.data.AudioOutputDevice
                    );
                  })
                  .catch(function (e) {
                    console.warn("Error using setSinkId: ", e);
                  });
              }
              remoteAudio.play();
            };
          };
        } else {
          console.warn(
            "onSessionDescriptionHandler fired without a peerConnection"
          );
        }
      } else {
        console.warn(
          "onSessionDescriptionHandler fired without a sessionDescriptionHandler"
        );
      }
    },
  };
  // Make sure we always restore audio paths
  newSession.stateChange.addListener(function (newState) {
    if (newState == SessionState.Terminated) {
      // Ends the mixed audio, and releases the mic
      if (
        session.data.childsession.data.AudioSourceTrack &&
        session.data.childsession.data.AudioSourceTrack.kind == "audio"
      ) {
        session.data.childsession.data.AudioSourceTrack.stop();
      }
      // Restore Audio Stream as it was changed
      if (
        session.data.AudioSourceTrack &&
        session.data.AudioSourceTrack.kind == "audio"
      ) {
        var pc = session.sessionDescriptionHandler.peerConnection;
        pc.getSenders().forEach(function (RTCRtpSender) {
          if (RTCRtpSender.track && RTCRtpSender.track.kind == "audio") {
            RTCRtpSender.replaceTrack(session.data.AudioSourceTrack)
              .then(function () {
                if (session.data.ismute) {
                  RTCRtpSender.track.enabled = false;
                } else {
                  RTCRtpSender.track.enabled = true;
                }
              })
              .catch(function (e) {
                console.error(e);
              });
            session.data.AudioSourceTrack = null;
          }
        });
      }
      onEnd();
    }
  });
  session.data.childsession = newSession;
  var inviterOptions = {
    requestDelegate: {
      onTrying: function (sip) {
        session.data.confcalls[confCallId].disposition = "trying";
        session.data.confcalls[confCallId].dispositionTime = utcDateNow();

        onTry();
      },
      onProgress: function (sip) {
        session.data.confcalls[confCallId].disposition = "progress";
        session.data.confcalls[confCallId].dispositionTime = utcDateNow();

        onRinging();
      },
      onRedirect: function (sip) {
        console.log("Redirect received:", sip);

        onRedirect();
      },
      onAccept: function (sip) {
        session.data.confcalls[confCallId].complete = true;
        session.data.confcalls[confCallId].disposition = "accepted";
        session.data.confcalls[confCallId].dispositionTime = utcDateNow();
        onAccept();

        onData(session, dstNo);
      },
      onReject: function (sip) {
        console.log("New call session rejected: ", sip.message.reasonPhrase);

        session.data.confcalls[confCallId].disposition =
          sip.message.reasonPhrase;
        session.data.confcalls[confCallId].dispositionTime = utcDateNow();

        onReject();
      },
    },
  };
  newSession.invite(inviterOptions).catch(function (e) {
    console.warn("Failed to send INVITE:", e);
  });
}

export function changeMicrophone(newid) {
  if (lineObj) var session = lineObj.SipSession;

  console.log("Call to change Microphone: ", newid);

  // Save Setting
  session.data.AudioSourceDevice = newid;

  var constraints = {
    audio: {
      deviceId: newid != "default" ? { exact: newid } : "default",
    },
    video: false,
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (newStream) {
      // Assume that since we are selecting from a dropdown, this is possible
      var newMediaTrack = newStream.getAudioTracks()[0];
      var pc = session.sessionDescriptionHandler.peerConnection;
      pc.getSenders().forEach(function (RTCRtpSender) {
        if (RTCRtpSender.track && RTCRtpSender.track.kind == "audio") {
          console.log(
            "Switching Audio Track : " +
              RTCRtpSender.track.label +
              " to " +
              newMediaTrack.label
          );
          RTCRtpSender.track.stop(); // Must stop, or this mic will stay in use
          RTCRtpSender.replaceTrack(newMediaTrack)
            .then(function () {})
            .catch(function (e) {
              console.error("Error replacing track: ", e);
            });
        }
      });
    })
    .catch(function (e) {
      console.error("Error on getUserMedia");
    });
}

export function changeSpeaker(newid) {
  if (lineObj) var session = lineObj.SipSession;

  console.log("Call to change Speaker: ", newid);

  session.data.AudioOutputDevice = newid;

  // Also change the sinkId
  // ======================
  var sinkId = newid;
  console.log(
    "Attempting to set Audio Output SinkID for line " +
      lineObj.LineNumber +
      " [" +
      sinkId +
      "]"
  );

  // Remote Audio

  if (remoteAudio) {
    if (typeof remoteAudio.sinkId !== "undefined") {
      remoteAudio
        .setSinkId(sinkId)
        .then(function () {
          console.log("sinkId applied: " + sinkId);
        })
        .catch(function (e) {
          console.warn("Error using setSinkId: ", e);
        });
    } else {
      console.warn("setSinkId() is not possible using this browser.");
    }
  }
}

export function mergeConferenceCalls() {
  // Merge Call Audio
  var session = lineObj.SipSession;
  var confCallId = session.data.confcalls.length - 1;

  if (!session.data.childsession) {
    console.warn("Conference session lost");

    return;
  }

  var outputStreamForSession = new MediaStream();
  var outputStreamForConfSession = new MediaStream();

  var pc = session.sessionDescriptionHandler.peerConnection;
  var confPc =
    session.data.childsession.sessionDescriptionHandler.peerConnection;

  // Get conf call input channel
  confPc.getReceivers().forEach(function (RTCRtpReceiver) {
    if (RTCRtpReceiver.track && RTCRtpReceiver.track.kind == "audio") {
      console.log("Adding conference session:", RTCRtpReceiver.track.label);
      outputStreamForSession.addTrack(RTCRtpReceiver.track);
    }
  });

  // Get session input channel
  pc.getReceivers().forEach(function (RTCRtpReceiver) {
    if (RTCRtpReceiver.track && RTCRtpReceiver.track.kind == "audio") {
      console.log("Adding conference session:", RTCRtpReceiver.track.label);
      outputStreamForConfSession.addTrack(RTCRtpReceiver.track);
    }
  });

  // Replace tracks of Parent Call
  pc.getSenders().forEach(function (RTCRtpSender) {
    if (RTCRtpSender.track && RTCRtpSender.track.kind == "audio") {
      console.log("Switching to mixed Audio track on session");

      session.data.AudioSourceTrack = RTCRtpSender.track;
      outputStreamForSession.addTrack(RTCRtpSender.track);
      var mixedAudioTrack = MixAudioStreams(
        outputStreamForSession
      ).getAudioTracks()[0];
      mixedAudioTrack.IsMixedTrack = true;

      RTCRtpSender.replaceTrack(mixedAudioTrack);
    }
  });
  // Replace tracks of Child Call
  confPc.getSenders().forEach(function (RTCRtpSender) {
    if (RTCRtpSender.track && RTCRtpSender.track.kind == "audio") {
      console.log("Switching to mixed Audio track on conf call");

      session.data.childsession.data.AudioSourceTrack = RTCRtpSender.track;
      outputStreamForConfSession.addTrack(RTCRtpSender.track);
      var mixedAudioTrackForConf = MixAudioStreams(
        outputStreamForConfSession
      ).getAudioTracks()[0];
      mixedAudioTrackForConf.IsMixedTrack = true;

      RTCRtpSender.replaceTrack(mixedAudioTrackForConf);
    }
  });

  console.log("Conference Call In Progress");
  session.data.confcalls[confCallId].accept.complete = true;
  session.data.confcalls[confCallId].accept.disposition = "join";
  session.data.confcalls[confCallId].accept.eventTime = utcDateNow();
}

export function forceEnd() {
  lineObj.SipSession.data.terminateby = "us";
  lineObj.SipSession.data.reasonCode = 0;
  lineObj.SipSession.data.reasonText = "Call Cancelled";

  console.log("Cancelling session : " + lineNum);
  if (
    lineObj.SipSession.state == SessionState.Initial ||
    lineObj.SipSession.state == SessionState.Establishing
  ) {
    lineObj.SipSession.cancel();
  } else {
    console.warn(
      "Session not in correct state for cancel.",
      lineObj.SipSession.state
    );
    console.log("Attempting teardown : " + lineNum);
    teardownSession(lineObj);
  }
}

export function CancelTransferSession({ onDone, onError }) {
  var session = lineObj.SipSession;
  if (session.data.childsession) {
    console.log(
      "Child Transfer call detected:",
      session.data.childsession.state
    );
    session.data.childsession
      .dispose()
      .then(function () {
        session.data.childsession = null;
        onDone();
      })
      .catch(function (error) {
        session.data.childsession = null;
        onError(error);
        // Suppress message
      });
  }
}

export function clearObjs() {
  lineObj = null;
  inCall = false;
}

export function endSession() {
  console.log("endSession Called");

  var lineNum = lineObj.LineNumber;
  console.log("Ending call with: " + lineNum);
  lineObj.SipSession.data.terminateby = "us";
  lineObj.SipSession.data.reasonCode = 16;
  lineObj.SipSession.data.reasonText = "Normal Call clearing";
  lineObj.SipSession.bye().catch(function (e) {
    console.warn("Failed to bye the session!", e);
  });

  teardownSession(lineObj);
  clearObjs();
  incomingCallBacks?.onEnd();
  outgoingCallbacks?.onEnd();
  // updateLineScroll(lineNum);
}

export function sendDTMF(itemStr) {
  if (lineObj == null || lineObj.SipSession == null) return;

  // https://developer.mozilla.org/en-US/docs/Web/API/RTCDTMFSender/insertDTMF
  var options = {
    duration: 100,
    interToneGap: 70,
  };

  if (lineObj.SipSession.isOnHold == true) {
    if (lineObj.SipSession.data.childsession) {
      if (
        lineObj.SipSession.data.childsession.state == SessionState.Established
      ) {
        console.log(
          "Sending DTMF (" +
            itemStr +
            "): " +
            lineObj.LineNumber +
            " child session"
        );

        var result =
          lineObj.SipSession.data.childsession.sessionDescriptionHandler.sendDtmf(
            itemStr,
            options
          );
        if (result) {
          console.log("Sent DTMF (" + itemStr + ") child session");
        } else {
          console.log("Failed to send DTMF (" + itemStr + ") child session");
        }
      } else {
        console.warn(
          "Cannot Send DTMF (" +
            itemStr +
            "): " +
            lineObj.LineNumber +
            " is on hold, and the child session is not established"
        );
      }
    } else {
      console.warn(
        "Cannot Send DTMF (" +
          itemStr +
          "): " +
          lineObj.LineNumber +
          " is on hold, and there is no child session"
      );
    }
  } else {
    if (
      lineObj.SipSession.state == SessionState.Established ||
      lineObj.SipSession.state == SessionState.Establishing
    ) {
      console.log("Sending DTMF (" + itemStr + "): " + lineObj.LineNumber);

      var res = lineObj.SipSession.sessionDescriptionHandler.sendDtmf(
        itemStr,
        options
      );
      if (res) {
        console.log("Sent DTMF (" + itemStr + ")");
      } else {
        console.log("Failed to send DTMF (" + itemStr + ")");
      }
    } else {
      console.warn(
        "Cannot Send DTMF (" +
          itemStr +
          "): " +
          lineObj.LineNumber +
          " session is not establishing or established"
      );
    }
  }
}

var OnStatusChange;
export function CreateUserAgent({ audioElementRef, onStatusChange }) {
  PreloadAudioFiles();
  remoteAudio = audioElementRef;
  OnStatusChange = onStatusChange;
  console.log("Creating User Agent...");
  OnStatusChange("Connecting With Server");

  profileUserID = username;
  var options = {
    uri: UserAgent.makeURI("sip:" + username + "@" + domain),
    transportOptions: {
      server: "wss://" + domain + ":" + socketPort + "" + wspath,
      traceSip: false,
      connectionTimeout: TransportConnectionTimeout,
      // keepAliveInterval: 30 // Uncomment this and make this any number greater then 0 for keep alive...
      // NB, adding a keep alive will NOT fix bad internet, if your connection cannot stay open (permanent WebSocket Connection) you probably
      // have a router or ISP issue, and if your internet is so poor that you need to some how keep it alive with empty packets
      // upgrade you internet connection. This is voip we are talking about here.
    },
    sessionDescriptionHandlerFactoryOptions: {
      peerConnectionConfiguration: {
        bundlePolicy: BundlePolicy,
        // certificates: undefined,
        // iceCandidatePoolSize: 10,
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        // iceTransportPolicy: "all",
        // peerIdentity: undefined,
        // rtcpMuxPolicy: "require",
      },
      iceGatheringTimeout: IceStunCheckTimeout,
    },
    contactName: username,
    displayName: displayName,
    authorizationUsername: username,
    authorizationPassword: password,
    hackIpInContact: IpInContact, // Asterisk should also be set to rewrite contact
    userAgentString: userAgentStr,
    autoStart: false,
    autoStop: true,
    register: false,
    noAnswerTimeout: NoAnswerTimeout,
    // sipExtension100rel: // UNSUPPORTED | SUPPORTED | REQUIRED NOTE: rel100 is not supported
    contactParams: {},
    delegate: {
      onInvite: function (sip) {
        ReceiveCall(sip);
      },
      onMessage: function () {
        // ReceiveOutOfDialogMessage(sip);
      },
    },
  };
  if (IceStunServerJson != "") {
    options.sessionDescriptionHandlerFactoryOptions.peerConnectionConfiguration.iceServers =
      JSON.parse(IceStunServerJson);
  }

  // Added to the contact BEFORE the '>' (permanent)
  if (
    RegisterContactParams &&
    RegisterContactParams != "" &&
    RegisterContactParams != "{}"
  ) {
    try {
      options.contactParams = JSON.parse(RegisterContactParams);
    } catch (e) {
      console.log(e);
    }
  }
  if (WssInTransport) {
    try {
      options.contactParams.transport = "wss";
    } catch (e) {
      console.log(e);
    }
  }

  // Add (Hardcode) other RTCPeerConnection({ rtcConfiguration }) config dictionary options here
  // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection
  // Example:
  // options.sessionDescriptionHandlerFactoryOptions.peerConnectionConfiguration.rtcpMuxPolicy = "require";

  userAgent = new UserAgent(options);
  userAgent.isRegistered = function () {
    return (
      userAgent &&
      userAgent.registerer &&
      userAgent.registerer.state == RegistererState.Registered
    );
  };
  // For some reason this is marked as private... not sure why
  userAgent.sessions = userAgent._sessions;
  userAgent.registrationCompleted = false;
  userAgent.registering = false;
  userAgent.transport.ReconnectionAttempts = TransportReconnectionAttempts;
  userAgent.transport.attemptingReconnection = false;
  userAgent.BlfSubs = [];
  userAgent.lastVoicemailCount = 0;

  console.log("Creating User Agent... Done");
  onStatusChange("Connected to Server.");
  userAgent.transport.onConnect = function () {
    onTransportConnected();
  };
  userAgent.transport.onDisconnect = function (error) {
    if (error) {
      onTransportConnectError(error);
    } else {
      onTransportDisconnected();
    }
  };

  var RegistererOptions = {
    expires: RegisterExpires,
    extraHeaders: [],
    extraContactHeaderParams: [], //i think we can do something with this. can you please run the code. let me see the, see display two , you see?
  };

  // Added to the SIP Headers
  if (
    RegisterExtraHeaders &&
    RegisterExtraHeaders != "" &&
    RegisterExtraHeaders != "{}"
  ) {
    try {
      var registerExtraHeaders = JSON.parse(RegisterExtraHeaders);
      for (const [key, value] of Object.entries(registerExtraHeaders)) {
        if (value != "") {
          RegistererOptions.extraHeaders.push(key + ": " + value);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Added to the contact AFTER the '>' (not permanent)
  if (
    RegisterExtraContactParams &&
    RegisterExtraContactParams != "" &&
    RegisterExtraContactParams != "{}"
  ) {
    try {
      var registerExtraContactParams = JSON.parse(RegisterExtraContactParams);
      for (const [key, value] of Object.entries(registerExtraContactParams)) {
        if (value == "") {
          RegistererOptions.extraContactHeaderParams.push(key);
        } else {
          RegistererOptions.extraContactHeaderParams.push(key + ":" + value);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  userAgent.registerer = new Registerer(userAgent, RegistererOptions);
  console.log("Creating Registerer... Done");
  onStatusChange("Registering with Server");

  userAgent.registerer.stateChange.addListener(function (newState) {
    console.log("User Agent Registration State:", newState);
    switch (newState) {
      case RegistererState.Initial:
        // Nothing to do
        onStatusChange("Registeration Started...");
        break;
      case RegistererState.Registered:
        onStatusChange("Registered Successfully");

        onRegistered();
        break;
      case RegistererState.Unregistered:
        onStatusChange("Registeration Failed Check Username and Password");
        onUnregistered();
        break;
      case RegistererState.Terminated:
        onStatusChange("Registeration Failed Server Terminated");
        // Nothing to do
        break;
    }
  });

  console.log("User Agent Connecting to WebSocket...");

  userAgent.start().catch(function (error) {
    onTransportConnectError(error);
  });
}
/**
 * Called if UserAgent can connect, but not register.
 * @param {string} response Incoming request message
 * @param {string} cause Cause message. Unused
 **/
function onRegisterFailed(response, cause) {
  console.log("Registration Failed: " + response);
  userAgent.registering = false;
}
function Register() {
  if (userAgent == null) return;
  if (userAgent.registering == true) return;
  if (userAgent.isRegistered()) return;

  var RegistererRegisterOptions = {
    requestDelegate: {
      onReject: function (sip) {
        onRegisterFailed(sip.message.reasonPhrase, sip.message.statusCode);
      },
    },
  };

  console.log("Sending Registration...");

  userAgent.registering = true;
  userAgent.registerer.register(RegistererRegisterOptions);
}

// Transport Events
// ================
function onTransportConnected() {
  console.log("Connected to Web Socket!");

  // Reset the ReconnectionAttempts
  userAgent.isReRegister = false;
  userAgent.transport.attemptingReconnection = false;
  userAgent.transport.ReconnectionAttempts = TransportReconnectionAttempts;

  // Auto start register
  if (
    userAgent.transport.attemptingReconnection == false &&
    userAgent.registering == false
  ) {
    window.setTimeout(function () {
      Register();
    }, 500);
  } else {
    console.warn(
      "onTransportConnected: Register() called, but attemptingReconnection is true or registering is true"
    );
  }
}
function onTransportConnectError(error) {
  console.warn("WebSocket Connection Failed:", error);

  // We set this flag here so that the re-register attempts are fully completed.
  userAgent.isReRegister = false;

  // If there is an issue with the WS connection
  // We unregister, so that we register again once its up
  console.log("Unregister...");
  try {
    userAgent.registerer.unregister();
  } catch (e) {
    // I know!!!
  }

  ReconnectTransport();
}
function onTransportDisconnected() {
  console.log("Disconnected from Web Socket!");

  userAgent.isReRegister = false;
}

function ReconnectTransport() {
  if (userAgent == null) return;

  userAgent.registering = false; // if the transport was down, you will not be registered
  if (userAgent.transport && userAgent.transport.isConnected()) {
    // Asked to re-connect, but ws is connected
    onTransportConnected();
    return;
  }
  console.log("Reconnect Transport...");

  window.setTimeout(function () {
    console.log("ReConnecting to WebSocket...");

    if (userAgent.transport && userAgent.transport.isConnected()) {
      // Already Connected
      onTransportConnected();
      return;
    } else {
      userAgent.transport.attemptingReconnection = true;
      userAgent.reconnect().catch(function (error) {
        userAgent.transport.attemptingReconnection = false;
        console.warn("Failed to reconnect", error);
        // Try Again
        ReconnectTransport();
      });
    }
  }, TransportReconnectionTimeout * 1000);
  console.log(
    "Waiting to Re-connect...",
    TransportReconnectionTimeout,
    "Attempt remaining",
    userAgent.transport.ReconnectionAttempts
  );
  userAgent.transport.ReconnectionAttempts =
    userAgent.transport.ReconnectionAttempts - 1;
}

// Presence / Subscribe
// ====================
function SubscribeAll() {
  if (!userAgent.isRegistered()) return;

  if (false) {
    SubscribeVoicemail();
  }
  if (SubscribeToYourself) {
    SelfSubscribe();
  }

  // Start subscribe all
  if (userAgent.BlfSubs && userAgent.BlfSubs.length > 0) {
    UnsubscribeAll();
  }
  userAgent.BlfSubs = [];
  if (Buddies.length >= 1) {
    console.log(
      "Starting Subscribe of all (" + Buddies.length + ") Extension Buddies..."
    );
    for (var b = 0; b < Buddies.length; b++) {
      SubscribeBuddy(Buddies[b]);
    }
  }
}
/**
 * Called when Unregister is requested
 */
function onUnregistered() {
  if (userAgent.registrationCompleted) {
    console.log("Unregistered, bye!");
  } else {
    // Was never really registered, so cant really say unregistered
  }

  // We set this flag here so that the re-register attempts are fully completed.
  userAgent.isReRegister = false;
}
function SelfSubscribe() {
  if (!userAgent.isRegistered()) return;

  if (userAgent.selfSub) {
    console.log("Unsubscribe from old self subscribe...");
    SelfUnsubscribe();
  }

  var targetURI = UserAgent.makeURI("sip:" + username + "@" + domain);

  var options = {
    expires: SubscribeBuddyExpires,
    extraHeaders: ["Accept: " + SubscribeBuddyAccept],
  };

  userAgent.selfSub = new Subscriber(
    userAgent,
    targetURI,
    SubscribeBuddyEvent,
    options
  );
  userAgent.selfSub.delegate = {
    onNotify: function () {
      // ReceiveNotify(sip, true);
    },
  };
  console.log("SUBSCRIBE Self: " + username + "@" + domain);
  userAgent.selfSub.subscribe().catch(function (error) {
    console.warn("Error subscribing to yourself:", error);
  });
}

function SubscribeVoicemail() {
  if (!userAgent.isRegistered()) return;

  if (userAgent.voicemailSub) {
    console.log("Unsubscribe from old voicemail Messages...");
    UnsubscribeVoicemail();
  }

  var vmOptions = { expires: SubscribeVoicemailExpires };
  var targetURI = UserAgent.makeURI("sip:" + username + "@" + domain);
  userAgent.voicemailSub = new Subscriber(
    userAgent,
    targetURI,
    "message-summary",
    vmOptions
  );
  userAgent.voicemailSub.delegate = {
    onNotify: function () {
      // VoicemailNotify(sip);
    },
  };
  console.log("SUBSCRIBE VOICEMAIL: " + username + "@" + domain);
  userAgent.voicemailSub.subscribe().catch(function (error) {
    console.warn("Error subscribing to voicemail notifications:", error);
  });
}

function SubscribeBuddy(buddyObj) {
  if (!userAgent.isRegistered()) return;

  if (
    (buddyObj.type == "extension" || buddyObj.type == "xmpp") &&
    buddyObj.EnableSubscribe == true &&
    buddyObj.SubscribeUser != ""
  ) {
    var targetURI = UserAgent.makeURI(
      "sip:" + buddyObj.SubscribeUser + "@" + domain
    );

    var options = {
      expires: SubscribeBuddyExpires,
      extraHeaders: ["Accept: " + SubscribeBuddyAccept],
    };
    var blfSubscribe = new Subscriber(
      userAgent,
      targetURI,
      SubscribeBuddyEvent,
      options
    );
    blfSubscribe.data = {};
    blfSubscribe.data.buddyId = buddyObj.identity;
    blfSubscribe.delegate = {
      onNotify: function () {
        // ReceiveNotify(sip, false);
      },
    };
    console.log("SUBSCRIBE: " + buddyObj.SubscribeUser + "@" + domain);
    blfSubscribe.subscribe().catch(function (error) {
      console.warn("Error subscribing to Buddy notifications:", error);
    });

    if (!userAgent.BlfSubs) userAgent.BlfSubs = [];
    userAgent.BlfSubs.push(blfSubscribe);
  }
}

function UnsubscribeAll() {
  if (!userAgent.isRegistered()) return;

  console.log("Unsubscribe from voicemail Messages...");
  UnsubscribeVoicemail();

  if (userAgent.BlfSubs && userAgent.BlfSubs.length > 0) {
    console.log(
      "Unsubscribing " + userAgent.BlfSubs.length + " subscriptions..."
    );
    for (var blf = 0; blf < userAgent.BlfSubs.length; blf++) {
      UnsubscribeBlf(userAgent.BlfSubs[blf]);
    }
    userAgent.BlfSubs = [];

    for (var b = 0; b < Buddies.length; b++) {
      var buddyObj = Buddies[b];
      if (buddyObj.type == "extension" || buddyObj.type == "xmpp") {
        // //"#contact-" + buddyObj.identity + "-devstate").prop(
        //   "class",
        //   "dotOffline"
        // );
        // //"#contact-" + buddyObj.identity + "-devstate-main").prop(
        //   "class",
        //   "dotOffline"
        // );
        // //"#contact-" + buddyObj.identity + "-presence").html(
        //   lang.state_unknown
        // );
        // //"#contact-" + buddyObj.identity + "-presence-main").html(
        //   lang.state_unknown
        // );
      }
    }
  }
}
function UnsubscribeBlf(blfSubscribe) {
  if (!userAgent.isRegistered()) return;

  if (blfSubscribe.state == SubscriptionState.Subscribed) {
    console.log("Unsubscribe to BLF Messages...", blfSubscribe.data.buddyId);
    blfSubscribe.unsubscribe().catch(function (error) {
      console.warn("Error removing BLF notifications:", error);
    });
  } else {
    console.log(
      "Incorrect buddy subscribe state",
      blfSubscribe.data.buddyId,
      blfSubscribe.state
    );
  }
  blfSubscribe.dispose().catch(function (error) {
    console.warn("Error disposing BLF notifications:", error);
  });
  blfSubscribe = null;
}
function UnsubscribeVoicemail() {
  if (!userAgent.isRegistered()) return;

  if (userAgent.voicemailSub) {
    console.log(
      "Unsubscribe to voicemail Messages...",
      userAgent.voicemailSub.state
    );
    if (userAgent.voicemailSub.state == SubscriptionState.Subscribed) {
      userAgent.voicemailSub.unsubscribe().catch(function (error) {
        console.warn("Error removing voicemail notifications:", error);
      });
    }
    userAgent.voicemailSub.dispose().catch(function (error) {
      console.warn("Error disposing voicemail notifications:", error);
    });
  } else {
    console.log("Not subscribed to MWI");
  }
  userAgent.voicemailSub = null;
}
function SelfUnsubscribe() {
  if (!userAgent.isRegistered()) return;

  if (userAgent.selfSub) {
    console.log("Unsubscribe from yourself...", userAgent.selfSub.state);
    if (userAgent.selfSub.state == SubscriptionState.Subscribed) {
      userAgent.selfSub.unsubscribe().catch(function (error) {
        console.warn("Error self subscription:", error);
      });
    }
    userAgent.selfSub.dispose().catch(function (error) {
      console.warn("Error disposing self subscription:", error);
    });
  } else {
    console.log("Not subscribed to Yourself");
  }
  userAgent.selfSub = null;
}
var lineObj = null;
var remoteAudio = null;
/**
 * Primary method for making a call.
 * @param {string} type (required) Either "audio" or "video". Will setup UI according to this type.
 * @param {Buddy} buddy (optional) The buddy to dial if provided.
 * @param {string} numToDial (required) The number to dial.
 * @param {string} CallerID (optional) If no buddy provided, one is generated automatically using this callerID and the numToDial
 * @param {Array<string>} extraHeaders = (optional) Array of headers to include in the INVITE eg: ["foo: bar"] (Note the space after the :)
 */
export function DialByLine({ type, num, name, audioElementRef }) {
  remoteAudio = audioElementRef;
  console.log("audio element:" + remoteAudio == null);
  if (userAgent == null) {
    console.log("User is not Registered");
    return;
  }
  var numDial = num;
  if (EnableAlphanumericDial) {
    numDial = numDial
      .replace(telAlphanumericRegEx, "")
      .substring(0, MaxDidLength);
  } else {
    numDial = num.replace(telNumericRegEx, "").substring(0, MaxDidLength);
  }
  if (numDial.length == 0) {
    console.warn("Enter number to dial");
    return;
  }

  // ShowContacts();

  // // Create a Buddy if one is not already existing
  var buddyObj = FindBuddyByDid(numDial);
  if (buddyObj == null) {
    var buddyType = numDial.length > DidLength ? "contact" : "extension";
    // Assumption but anyway: If the number starts with a * or # then its probably not a subscribable did,
    // and is probably a feature code.
    if (numDial.substring(0, 1) == "*" || numDial.substring(0, 1) == "#")
      buddyType = "contact";
    buddyObj = MakeBuddy(
      buddyType,
      true,
      false,
      false,
      name ? name : numDial,
      numDial,
      null,
      false,
      null,
      AutoDeleteDefault
    );
  }

  // Create a Line
  newLineNumber = newLineNumber + 1;
  lineObj = new Line(newLineNumber, buddyObj.CallerIDName, numDial, buddyObj);
  Lines.push(lineObj);
  // AddLineHtml(lineObj, "outbound");
  // SelectLine(newLineNumber);

  // Start Call Invite
  if (type == "audio") {
    AudioCall(lineObj, numDial, null);
  } else {
    VideoCall(lineObj, numDial);
  }
}
var Buddy = function (
  type,
  identity,
  CallerIDName,
  ExtNo,
  MobileNumber,
  ContactNumber1,
  ContactNumber2,
  lastActivity,
  desc,
  Email,
  jid,
  dnd,
  subscribe,
  subscription,
  autoDelete,
  pinned
) {
  this.type = type; // extension | xmpp | contact | group
  this.identity = identity;
  this.jid = jid;
  this.CallerIDName = CallerIDName ? CallerIDName : "";
  this.Email = Email ? Email : "";
  this.Desc = desc ? desc : "";
  this.ExtNo = ExtNo;
  this.MobileNumber = MobileNumber;
  this.ContactNumber1 = ContactNumber1;
  this.ContactNumber2 = ContactNumber2;
  this.lastActivity = lastActivity; // Full Date as string eg "1208-03-21 15:34:23 UTC"
  this.devState = "dotOffline";
  this.presence = "Unknown";
  this.missed = 0;
  this.IsSelected = false;
  this.imageObjectURL = "";
  this.presenceText = lang.default_status;
  this.EnableDuringDnd = dnd;
  this.EnableSubscribe = subscribe;
  this.SubscribeUser = subscription ? subscription : ExtNo;
  this.AllowAutoDelete =
    typeof autoDelete !== "undefined" ? autoDelete : AutoDeleteDefault;
  this.Pinned = typeof pinned !== "undefined" ? pinned : false;
};

export function earlyHangUp() {
  lineObj.SipSession.cancel();
}

function AudioCall(lineObj, dialledNumber, extraHeaders, customHooks) {
  if (userAgent == null) return;
  if (userAgent.isRegistered() == false) return;
  if (lineObj == null) return;

  // if (HasAudioDevice == false) {
  //   Alert("Mic not Found");
  //   return;
  // }

  var supportedConstraints = navigator.mediaDevices.getSupportedConstraints();

  var spdOptions = {
    earlyMedia: true,
    sessionDescriptionHandlerOptions: {
      constraints: {
        audio: { deviceId: "default" },
        video: false,
      },
    },
  };
  // Configure Audio
  var currentAudioDevice = getAudioSrcID();
  currentAudioDevice = "default";
  if (currentAudioDevice != "default") {
    var confirmedAudioDevice = false;
    for (var i = 0; i < AudioinputDevices.length; ++i) {
      if (currentAudioDevice == AudioinputDevices[i].deviceId) {
        confirmedAudioDevice = true;
        break;
      }
    }
    if (confirmedAudioDevice) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
        exact: currentAudioDevice,
      };
    } else {
      console.warn(
        "The audio device you used before is no longer available, default settings applied."
      );
    }
  }
  // Add additional Constraints
  if (supportedConstraints.autoGainControl) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl =
      AutoGainControl;
  }
  if (supportedConstraints.echoCancellation) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
      EchoCancellation;
  }
  if (supportedConstraints.noiseSuppression) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
      NoiseSuppression;
  }
  // Extra Headers
  if (extraHeaders) {
    spdOptions.extraHeaders = extraHeaders;
  }

  //starting

  // Invite
  console.log("INVITE (audio): " + dialledNumber + "@" + domain);

  var targetURI = UserAgent.makeURI(
    "sip:" + dialledNumber.replace(/#/g, "%23") + "@" + domain
  );
  lineObj.SipSession = new Inviter(userAgent, targetURI, spdOptions);
  lineObj.SipSession.data = {};
  lineObj.SipSession.data.line = lineObj.LineNumber;
  lineObj.SipSession.data.buddyId = lineObj.BuddyObj.identity;
  lineObj.SipSession.data.calldirection = "outbound";
  lineObj.SipSession.data.dst = dialledNumber;
  lineObj.SipSession.data.callstart = utcDateNow();
  // lineObj.SipSession.data.callTimer = window.setInterval(function () {
  //   var now = moment.utc();
  //   var duration = moment.duration(now.diff(startTime));
  //   var timeStr = formatShortDuration(duration.asSeconds());

  // }, 1000);
  lineObj.SipSession.data.VideoSourceDevice = null;
  lineObj.SipSession.data.AudioSourceDevice = "default";
  lineObj.SipSession.data.AudioOutputDevice = "default";
  lineObj.SipSession.data.terminateby = "them";
  lineObj.SipSession.data.withvideo = false;
  lineObj.SipSession.data.earlyReject = false;
  lineObj.SipSession.isOnHold = false;
  lineObj.SipSession.delegate = {
    onBye: function (sip) {
      outgoingCallbacks?.onEnd();
      setTimeout(outgoingCallbacks?.onHang(), 2000);
      onSessionReceivedBye(lineObj, sip);
    },
    onMessage: function (sip) {
      onSessionReceivedMessage(lineObj, sip);
    },
    onInvite: function (sip) {
      onSessionReinvited(lineObj, sip);
    },
    onSessionDescriptionHandler: function (sdh, provisional) {
      onSessionDescriptionHandlerCreated(lineObj, sdh, provisional, false);
    },
  };
  var inviterOptions = {
    requestDelegate: {
      // OutgoingRequestDelegate
      onTrying: function (sip) {
        outgoingCallbacks?.onTry();
        onInviteTrying(lineObj, sip);
      },
      onProgress: function (sip) {
        outgoingCallbacks?.onRinging();
        onInviteProgress(lineObj, sip);
      },
      onRedirect: function (sip) {
        outgoingCallbacks?.onRedirect();
        onInviteRedirected(lineObj, sip);
      },
      onAccept: function (sip) {
        outgoingCallbacks?.onAccept();
        onInviteAccepted(lineObj, false, sip);
      },
      onReject: function (sip) {
        outgoingCallbacks?.onReject();
        setTimeout(() => outgoingCallbacks?.onHang(), 1000);
        onInviteRejected(lineObj, sip);
      },
    },
  };
  lineObj.SipSession.invite(inviterOptions).catch(function (e) {
    console.warn("Failed to send INVITE:", e);
    setTimeout(customHooks.onHang(), 1000);
  });
}

function Alert(str) {
  window.alert(str);
}

// Outbound Calling
// ================
function VideoCall(lineObj, dialledNumber, extraHeaders) {
  if (userAgent == null) return;
  if (!userAgent.isRegistered()) return;
  if (lineObj == null) return;

  if (HasAudioDevice == false) {
    Alert(lang.alert_no_microphone);
    return;
  }

  if (HasVideoDevice == false) {
    console.warn("No video devices (webcam) found, switching to audio call.");
    AudioCall(lineObj, dialledNumber);
    return;
  }

  var supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
  var spdOptions = {
    earlyMedia: true,
    sessionDescriptionHandlerOptions: {
      constraints: {
        audio: { deviceId: "default" },
        video: { deviceId: "default" },
      },
    },
  };

  // Configure Audio
  var currentAudioDevice = getAudioSrcID();
  if (currentAudioDevice != "default") {
    var confirmedAudioDevice = false;
    for (var i = 0; i < AudioinputDevices.length; ++i) {
      if (currentAudioDevice == AudioinputDevices[i].deviceId) {
        confirmedAudioDevice = true;
        break;
      }
    }
    if (confirmedAudioDevice) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
        exact: currentAudioDevice,
      };
    } else {
      console.warn(
        "The audio device you used before is no longer available, default settings applied."
      );
      localStorage.setItem("AudioSrcId", "default");
    }
  }
  // Add additional Constraints
  if (supportedConstraints.autoGainControl) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl =
      AutoGainControl;
  }
  if (supportedConstraints.echoCancellation) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
      EchoCancellation;
  }
  if (supportedConstraints.noiseSuppression) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
      NoiseSuppression;
  }

  // Configure Video
  var currentVideoDevice = getVideoSrcID();
  if (currentVideoDevice != "default") {
    var confirmedVideoDevice = false;
    for (var i = 0; i < VideoinputDevices.length; ++i) {
      if (currentVideoDevice == VideoinputDevices[i].deviceId) {
        confirmedVideoDevice = true;
        break;
      }
    }
    if (confirmedVideoDevice) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.deviceId = {
        exact: currentVideoDevice,
      };
    } else {
      console.warn(
        "The video device you used before is no longer available, default settings applied."
      );
      localStorage.setItem("VideoSrcId", "default"); // resets for later and subsequent calls
    }
  }
  // Add additional Constraints
  if (supportedConstraints.frameRate && maxFrameRate != "") {
    spdOptions.sessionDescriptionHandlerOptions.constraints.video.frameRate =
      maxFrameRate;
  }
  if (supportedConstraints.height && videoHeight != "") {
    spdOptions.sessionDescriptionHandlerOptions.constraints.video.height =
      videoHeight;
  }
  if (supportedConstraints.aspectRatio && videoAspectRatio != "") {
    spdOptions.sessionDescriptionHandlerOptions.constraints.video.aspectRatio =
      videoAspectRatio;
  }
  // Extra Headers
  if (extraHeaders) {
    spdOptions.extraHeaders = extraHeaders;
  }

  //"#line-" + lineObj.LineNumber + "-msg").html(lang.starting_video_call);
  //"#line-" + lineObj.LineNumber + "-timer").show();

  var startTime = moment.utc();

  // Invite
  console.log("INVITE (video): " + dialledNumber + "@" + domain);

  var targetURI = UserAgent.makeURI(
    "sip:" + dialledNumber.replace(/#/g, "%23") + "@" + domain
  );
  lineObj.SipSession = new Inviter(userAgent, targetURI, spdOptions);
  lineObj.SipSession.data = {};
  lineObj.SipSession.data.line = lineObj.LineNumber;
  lineObj.SipSession.data.buddyId = lineObj.BuddyObj.identity;
  lineObj.SipSession.data.calldirection = "outbound";
  lineObj.SipSession.data.dst = dialledNumber;
  lineObj.SipSession.data.callstart = startTime.format(
    "YYYY-MM-DD HH:mm:ss UTC"
  );
  lineObj.SipSession.data.callTimer = window.setInterval(function () {}, 1000);
  lineObj.SipSession.data.VideoSourceDevice = getVideoSrcID();
  lineObj.SipSession.data.AudioSourceDevice = getAudioSrcID();
  lineObj.SipSession.data.AudioOutputDevice = getAudioOutputID();
  lineObj.SipSession.data.terminateby = "them";
  lineObj.SipSession.data.withvideo = true;
  lineObj.SipSession.data.earlyReject = false;
  lineObj.SipSession.isOnHold = false;
  lineObj.SipSession.delegate = {
    onBye: function (sip) {
      onSessionReceivedBye(lineObj, sip);
    },
    onMessage: function (sip) {
      onSessionReceivedMessage(lineObj, sip);
    },
    onInvite: function (sip) {
      onSessionReinvited(lineObj, sip);
    },
    onSessionDescriptionHandler: function (sdh, provisional) {
      onSessionDescriptionHandlerCreated(lineObj, sdh, provisional, true);
    },
  };
  var inviterOptions = {
    requestDelegate: {
      // OutgoingRequestDelegate
      onTrying: function (sip) {
        onInviteTrying(lineObj, sip);
      },
      onProgress: function (sip) {
        onInviteProgress(lineObj, sip);
      },
      onRedirect: function (sip) {
        onInviteRedirected(lineObj, sip);
      },
      onAccept: function (sip) {
        onInviteAccepted(lineObj, true, sip);
      },
      onReject: function (sip) {
        onInviteRejected(lineObj, sip);
      },
    },
  };
  lineObj.SipSession.invite(inviterOptions).catch(function (e) {
    console.warn("Failed to send INVITE:", e);
  });

  // //"#line-" + lineObj.LineNumber + "-btn-settings").removeAttr("disabled");
  // //"#line-" + lineObj.LineNumber + "-btn-audioCall").prop(
  //   "disabled",
  //   "disabled"
  // );
  // //"#line-" + lineObj.LineNumber + "-btn-videoCall").prop(
  //   "disabled",
  //   "disabled"
  // );
  // //"#line-" + lineObj.LineNumber + "-btn-search").removeAttr("disabled");

  // //"#line-" + lineObj.LineNumber + "-progress").show();
  // //"#line-" + lineObj.LineNumber + "-msg").show();
}

function InitUserBuddies() {
  var template = { TotalRows: 0, DataCollection: [] };
  localStorage.setItem(profileUserID + "-Buddies", JSON.stringify(template));
  return JSON.parse(localStorage.getItem(profileUserID + "-Buddies"));
}
/**
 * Method used to create a permanent buddy (saved to the local store).
 * Note: This method also makes the memory object for display it on the left hand side, using ()
 * @param {string} type One of extension | xmpp | contact | group
 * @param {boolean} update Option to issue UpdateBuddyList() once done.
 * @param {boolean} focus Option to focus/select the buddy once done.
 * @param {boolean} subscribe Option to create a subscription to the user. (also see subscribeUser)
 * @param {string} callerID The Display Name or Caller ID of the Buddy
 * @param {string} did The Extension Number/DID/SipID of the Buddy
 * @param {string} jid The Jabber Identifier of the XMPP buddy (only if type=xmpp)
 * @param {boolean} AllowDuringDnd Option to allowing inbound calls when on DND
 * @param {string} subscribeUser If subscribe=true, you can optionally specify a SipID to subscribe to.
 * @param {boolean} autoDelete Option to have this buddy delete after MaxBuddyAge
 **/
function MakeBuddy(
  type,
  update,
  focus,
  subscribe,
  callerID,
  did,
  jid,
  AllowDuringDnd,
  subscribeUser,
  autoDelete
) {
  var json = JSON.parse(localStorage.getItem(profileUserID + "-Buddies"));
  if (json == null) json = InitUserBuddies();

  var dateNow = utcDateNow();
  var buddyObj = null;
  var id = uID();

  if (type == "extension") {
    json.DataCollection.push({
      Type: "extension",
      LastActivity: dateNow,
      ExtensionNumber: did,
      MobileNumber: "",
      ContactNumber1: "",
      ContactNumber2: "",
      uID: id,
      cID: null,
      gID: null,
      jid: null,
      DisplayName: callerID,
      Description: "",
      Email: "",
      MemberCount: 0,
      EnableDuringDnd: AllowDuringDnd,
      Subscribe: subscribe,
      SubscribeUser: subscribeUser,
      AutoDelete: autoDelete,
    });
    buddyObj = new Buddy(
      "extension",
      id,
      callerID,
      did,
      "",
      "",
      "",
      dateNow,
      "",
      "",
      null,
      AllowDuringDnd,
      subscribe,
      subscribeUser,
      autoDelete
    );
    // (buddyObj, update, focus, subscribe, true);
  }
  if (type == "xmpp") {
    json.DataCollection.push({
      Type: "xmpp",
      LastActivity: dateNow,
      ExtensionNumber: did,
      MobileNumber: "",
      ContactNumber1: "",
      ContactNumber2: "",
      uID: id,
      cID: null,
      gID: null,
      jid: jid,
      DisplayName: callerID,
      Description: "",
      Email: "",
      MemberCount: 0,
      EnableDuringDnd: AllowDuringDnd,
      Subscribe: subscribe,
      SubscribeUser: subscribeUser,
      AutoDelete: autoDelete,
    });
    buddyObj = new Buddy(
      "xmpp",
      id,
      callerID,
      did,
      "",
      "",
      "",
      dateNow,
      "",
      "",
      jid,
      AllowDuringDnd,
      subscribe,
      subscribeUser,
      autoDelete
    );
    // (buddyObj, update, focus, subscribe, true);
  }
  if (type == "contact") {
    json.DataCollection.push({
      Type: "contact",
      LastActivity: dateNow,
      ExtensionNumber: "",
      MobileNumber: "",
      ContactNumber1: did,
      ContactNumber2: "",
      uID: null,
      cID: id,
      gID: null,
      jid: null,
      DisplayName: callerID,
      Description: "",
      Email: "",
      MemberCount: 0,
      EnableDuringDnd: AllowDuringDnd,
      Subscribe: false,
      SubscribeUser: null,
      AutoDelete: autoDelete,
    });
    buddyObj = new Buddy(
      "contact",
      id,
      callerID,
      "",
      "",
      did,
      "",
      dateNow,
      "",
      "",
      null,
      AllowDuringDnd,
      false,
      null,
      autoDelete
    );
    // (buddyObj, update, focus, false, true);
  }
  if (type == "group") {
    json.DataCollection.push({
      Type: "group",
      LastActivity: dateNow,
      ExtensionNumber: did,
      MobileNumber: "",
      ContactNumber1: "",
      ContactNumber2: "",
      uID: null,
      cID: null,
      gID: id,
      jid: null,
      DisplayName: callerID,
      Description: "",
      Email: "",
      MemberCount: 0,
      EnableDuringDnd: false,
      Subscribe: false,
      SubscribeUser: null,
      AutoDelete: autoDelete,
    });
    buddyObj = new Buddy(
      "group",
      id,
      callerID,
      did,
      "",
      "",
      "",
      dateNow,
      "",
      "",
      null,
      false,
      false,
      null,
      autoDelete
    );
    // (buddyObj, update, focus, false, true);
  }
  // Update Size:
  json.TotalRows = json.DataCollection.length;

  // Save To DB
  localStorage.setItem(profileUserID + "-Buddies", JSON.stringify(json));

  // Return new buddy
  return buddyObj;
}

function onRegistered() {
  // This code fires on re-register after session timeout
  // to ensure that events are not fired multiple times
  // a isReRegister state is kept.
  // TODO: This check appears obsolete

  userAgent.registrationCompleted = true;
  if (!userAgent.isReRegister) {
    console.log("Registered!");

    // Start Subscribe Loop
    window.setTimeout(function () {
      SubscribeAll();
    }, 500);

    userAgent.registering = false;

    // Close possible Alerts that may be open. (Can be from failed registers)
    // if (alertObj != null) {
    //   alertObj.dialog("close");
    //   alertObj = null;
    // }
  } else {
    userAgent.registering = false;

    console.log("ReRegistered!");
  }
  userAgent.isReRegister = true;
}

// Session Events
// ==============

// Incoming INVITE
function onInviteCancel(lineObj, response) {
  // Remote Party Canceled while ringing...

  // Check to see if this call has been completed elsewhere
  // https://github.com/InnovateAsterisk/Browser-Phone/issues/405
  var temp_cause = 0;
  var reason = response.headers["Reason"];
  if (reason !== undefined && reason.length > 0) {
    for (var i = 0; i < reason.length; i++) {
      var cause = reason[i].raw.toLowerCase().trim(); // Reason: Q.850 ;cause=16 ;text="Terminated"
      var items = cause.split(";");
      if (
        items.length >= 2 &&
        (items[0].trim() == "sip" || items[0].trim() == "q.850") &&
        items[1].includes("cause") &&
        cause.includes("call completed elsewhere")
      ) {
        temp_cause = parseInt(
          items[1].substring(items[1].indexOf("=") + 1).trim()
        );
        // No sample provided for "token"
        break;
      }
    }
  }

  lineObj.SipSession.data.terminateby = "them";
  lineObj.SipSession.data.reasonCode = temp_cause;
  if (temp_cause == 0) {
    lineObj.SipSession.data.reasonText = "Call Cancelled";
    console.log("Call canceled by remote party before answer");
  } else {
    lineObj.SipSession.data.reasonText = "Call completed elsewhere";
    console.log("Call completed elsewhere before answer");
  }

  lineObj.SipSession.dispose().catch(function (error) {
    console.log("Failed to dispose the cancel dialog", error);
  });

  teardownSession(lineObj);
}
// Both Incoming an outgoing INVITE
function onInviteAccepted(lineObj, includeVideo, response) {
  incomingCallBacks?.onSuccess();

  // Call in progress
  var session = lineObj.SipSession;

  if (session.data.earlyMedia) {
    session.data.earlyMedia.pause();
    session.data.earlyMedia.removeAttribute("src");
    session.data.earlyMedia.load();
    session.data.earlyMedia = null;
  }

  session.isOnHold = false;
  session.data.started = true;

  if (includeVideo) {
    // Preview our stream from peer connection
    var localVideoStream = new MediaStream();
    var pc = session.sessionDescriptionHandler.peerConnection;
    pc.getSenders().forEach(function (sender) {
      if (sender.track && sender.track.kind == "video") {
        localVideoStream.addTrack(sender.track);
      }
    });
    // var localVideo = //"#line-" + lineObj.LineNumber + "-localVideo").get(0);
    // localVideo.srcObject = localVideoStream;
    // localVideo.onloadedmetadata = function (e) {
    //   localVideo.play();
    // };

    // Apply Call Bandwidth Limits
    if (MaxVideoBandwidth > -1) {
      pc.getSenders().forEach(function (sender) {
        if (sender.track && sender.track.kind == "video") {
          var parameters = sender.getParameters();
          if (!parameters.encodings) parameters.encodings = [{}];
          parameters.encodings[0].maxBitrate = MaxVideoBandwidth * 1000;

          console.log(
            "Applying limit for Bandwidth to: ",
            MaxVideoBandwidth + "kb per second"
          );

          // Only going to try without re-negotiations
          sender.setParameters(parameters).catch(function (e) {
            console.warn("Cannot apply Bandwidth Limits", e);
          });
        }
      });
    }
  }

  // // Start Call Recording
  // if (RecordAllCalls || CallRecordingPolicy == "enabled") {
  //   StartRecording(lineObj.LineNumber);
  // }

  // if (includeVideo) {
  //   // Layout for Video Call
  //   //"#line-" + lineObj.LineNumber + "-progress").hide();
  //   //"#line-" + lineObj.LineNumber + "-VideoCall").show();
  //   //"#line-" + lineObj.LineNumber + "-ActiveCall").show();

  //   //"#line-" + lineObj.LineNumber + "-btn-Conference").hide(); // Cannot conference a Video Call (Yet...)
  //   //"#line-" + lineObj.LineNumber + "-btn-CancelConference").hide();
  //   //"#line-" + lineObj.LineNumber + "-Conference").hide();

  //   //"#line-" + lineObj.LineNumber + "-btn-Transfer").hide(); // Cannot transfer a Video Call (Yet...)
  //   //"#line-" + lineObj.LineNumber + "-btn-CancelTransfer").hide();
  //   //"#line-" + lineObj.LineNumber + "-Transfer").hide();

  //   // Default to use Camera
  //   //"#line-" + lineObj.LineNumber + "-src-camera").prop("disabled", true);
  //   //"#line-" + lineObj.LineNumber + "-src-canvas").prop("disabled", false);
  //   //"#line-" + lineObj.LineNumber + "-src-desktop").prop("disabled", false);
  //   //"#line-" + lineObj.LineNumber + "-src-video").prop("disabled", false);
  // } else {
  //   // Layout for Audio Call
  //   //"#line-" + lineObj.LineNumber + "-progress").hide();
  //   //"#line-" + lineObj.LineNumber + "-VideoCall").hide();
  //   //"#line-" + lineObj.LineNumber + "-AudioCall").show();
  //   // Call Control
  //   //"#line-" + lineObj.LineNumber + "-btn-Mute").show();
  //   //"#line-" + lineObj.LineNumber + "-btn-Unmute").hide();
  //   //"#line-" + lineObj.LineNumber + "-btn-start-recording").show();
  //   //"#line-" + lineObj.LineNumber + "-btn-stop-recording").hide();
  //   //"#line-" + lineObj.LineNumber + "-btn-Hold").show();
  //   //"#line-" + lineObj.LineNumber + "-btn-Unhold").hide();
  //   //"#line-" + lineObj.LineNumber + "-btn-Transfer").show();
  //   //"#line-" + lineObj.LineNumber + "-btn-CancelTransfer").hide();
  //   //"#line-" + lineObj.LineNumber + "-btn-Conference").show();
  //   //"#line-" + lineObj.LineNumber + "-btn-CancelConference").hide();
  //   //"#line-" + lineObj.LineNumber + "-btn-ShowDtmf").show();
  //   //"#line-" + lineObj.LineNumber + "-btn-settings").show();
  //   //"#line-" + lineObj.LineNumber + "-btn-ShowCallStats").show();
  //   //"#line-" + lineObj.LineNumber + "-btn-HideCallStats").hide();
  //   //"#line-" + lineObj.LineNumber + "-btn-ShowTimeline").show();
  //   //"#line-" + lineObj.LineNumber + "-btn-HideTimeline").hide();
  //   //"#line-" + lineObj.LineNumber + "-btn-present-src").hide();
  //   //"#line-" + lineObj.LineNumber + "-btn-expand").hide();
  //   //"#line-" + lineObj.LineNumber + "-btn-restore").hide();
  //   //"#line-" + lineObj.LineNumber + "-btn-End").show();
  //   // Show the Call
  //   //"#line-" + lineObj.LineNumber + "-ActiveCall").show();
  // }

  // UpdateBuddyList();
  // updateLineScroll(lineObj.LineNumber);

  // Start Audio Monitoring
  // lineObj.LocalSoundMeter = StartLocalAudioMediaMonitoring(
  //   lineObj.LineNumber,
  //   session
  // );
  // lineObj.RemoteSoundMeter = StartRemoteAudioMediaMonitoring(
  //   lineObj.LineNumber,
  //   session
  // );

  // if (includeVideo && StartVideoFullScreen) ExpandVideoArea(lineObj.LineNumber);
}
// Outgoing INVITE
function onInviteTrying(lineObj, response) {
  console.log("onInviteTrying");
}
var hostingPrefix = "./";

function PreloadAudioFiles() {
  audioBlobs.Alert = {
    file: "Alert.mp3",
    url: hostingPrefix + "media/Alert.mp3",
  };
  audioBlobs.Ringtone = {
    file: "Ringtone_1.mp3",
    url: hostingPrefix + "media/Ringtone_1.mp3",
  };
  audioBlobs.speech_orig = {
    file: "speech_orig.mp3",
    url: hostingPrefix + "media/speech_orig.mp3",
  };
  audioBlobs.Busy_UK = {
    file: "Tone_Busy-UK.mp3",
    url: hostingPrefix + "media/Tone_Busy-UK.mp3",
  };
  audioBlobs.Busy_US = {
    file: "Tone_Busy-US.mp3",
    url: hostingPrefix + "media/Tone_Busy-US.mp3",
  };
  audioBlobs.CallWaiting = {
    file: "Tone_CallWaiting.mp3",
    url: hostingPrefix + "media/Tone_CallWaiting.mp3",
  };
  audioBlobs.Congestion_UK = {
    file: "Tone_Congestion-UK.mp3",
    url: hostingPrefix + "media/Tone_Congestion-UK.mp3",
  };
  audioBlobs.Congestion_US = {
    file: "Tone_Congestion-US.mp3",
    url: hostingPrefix + "media/Tone_Congestion-US.mp3",
  };
  audioBlobs.EarlyMedia_Australia = {
    file: "Tone_EarlyMedia-Australia.mp3",
    url: hostingPrefix + "media/Tone_EarlyMedia-Australia.mp3",
  };
  audioBlobs.EarlyMedia_European = {
    file: "Tone_EarlyMedia-European.mp3",
    url: hostingPrefix + "media/Tone_EarlyMedia-European.mp3",
  };
  audioBlobs.EarlyMedia_Japan = {
    file: "Tone_EarlyMedia-Japan.mp3",
    url: hostingPrefix + "media/Tone_EarlyMedia-Japan.mp3",
  };
  audioBlobs.EarlyMedia_UK = {
    file: "Tone_EarlyMedia-UK.mp3",
    url: hostingPrefix + "media/Tone_EarlyMedia-UK.mp3",
  };
  audioBlobs.EarlyMedia_US = {
    file: "Tone_EarlyMedia-US.mp3",
    url: hostingPrefix + "media/Tone_EarlyMedia-US.mp3",
  };

  const promises = Object.keys(audioBlobs).map((key) => {
    const item = audioBlobs[key];
    return fetch(item.url)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = () => {
            item.blob = reader.result;
            resolve();
          };
          reader.readAsDataURL(blob);
        });
      });
  });

  Promise.all(promises).then(() => {
    // All data has been fetched and processed
    console.log("Audio blobs fetched and processed:", audioBlobs);
  });
}
function onInviteProgress(lineObj, response) {
  console.log("Call Progress:", response.message.statusCode);

  // Provisional 1xx
  // response.message.reasonPhrase
  if (response.message.statusCode == 180) {
    // //"#line-" + lineObj.LineNumber + "-msg").html(lang.ringing);
    console.log("Ringing...");

    var soundFile = audioBlobs.EarlyMedia_European;
    soundFile = audioBlobs.EarlyMedia_US;
    // if (UserLocale().indexOf("gb") > -1) soundFile = audioBlobs.EarlyMedia_UK;
    // if (UserLocale().indexOf("au") > -1)
    //   soundFile = audioBlobs.EarlyMedia_Australia;
    // if (UserLocale().indexOf("jp") > -1)
    //   soundFile = audioBlobs.EarlyMedia_Japan;

    // Play Early Media
    console.log("Audio:", soundFile.url);
    if (lineObj.SipSession.data.earlyMedia) {
      // There is already early media playing
      // onProgress can be called multiple times
      // Don't add it again
      console.log("Early Media already playing");
    } else {
      var earlyMedia = new Audio(soundFile.blob);
      earlyMedia.preload = "auto";
      earlyMedia.loop = true;
      earlyMedia.oncanplaythrough = function () {
        if (
          typeof earlyMedia.sinkId !== "undefined" &&
          getAudioOutputID() != "default"
        ) {
          earlyMedia
            .setSinkId(getAudioOutputID())
            .then(function () {
              console.log("Set sinkId to:", getAudioOutputID());
            })
            .catch(function (e) {
              console.warn("Failed not apply setSinkId.", e);
            });
        }
        earlyMedia
          .play()
          .then(function () {
            // Audio Is Playing
          })
          .catch(function (e) {
            console.warn("Unable to play audio file.", e);
          });
      };
      lineObj.SipSession.data.earlyMedia = earlyMedia;
    }
  } else if (response.message.statusCode === 183) {
    // //"#line-" + lineObj.LineNumber + "-msg").html(
    //   response.message.reasonPhrase + "..."
    // );

    //   response.message.reasonPhrase + "..."
    console.log(response.message.reasonPhrase + "...");

    // // Add UI to allow DTMF
    // //"#line-" + lineObj.LineNumber + "-early-dtmf").show();
  } else {
    // 181 = Call is Being Forwarded
    // 182 = Call is queued (Busy server!)
    // 199 = Call is Terminated (Early Dialog)

    // //"#line-" + lineObj.LineNumber + "-msg").html(
    //   response.message.reasonPhrase + "..."
    // );
    console.log(response.message.reasonPhrase + "...");
  }
}
function onInviteRejected(lineObj, response) {
  console.log("INVITE Rejected:", response.message.reasonPhrase);

  lineObj.SipSession.data.terminateby = "them";
  lineObj.SipSession.data.reasonCode = response.message.statusCode;
  lineObj.SipSession.data.reasonText = response.message.reasonPhrase;

  teardownSession(lineObj);
}
function onInviteRedirected(response) {
  console.log("onInviteRedirected", response);
  // Follow???
}

// General end of Session
function teardownSession(lineObj) {
  if (lineObj == null || lineObj.SipSession == null) return;

  var session = lineObj.SipSession;
  if (session.data.teardownComplete == true) return;
  session.data.teardownComplete = true; // Run this code only once

  // Call UI
  if (session.data.earlyReject != true) {
    // HidePopup();
    console.log("Early Rejected");
  }

  // End any child calls
  if (session.data.childsession) {
    session.data.childsession
      .dispose()
      .then(function () {
        session.data.childsession = null;
      })
      .catch(function () {
        session.data.childsession = null;
        // Suppress message
      });
  }

  // Mixed Tracks
  if (
    session.data.AudioSourceTrack &&
    session.data.AudioSourceTrack.kind == "audio"
  ) {
    session.data.AudioSourceTrack.stop();
    session.data.AudioSourceTrack = null;
  }
  // Stop any Early Media
  if (session.data.earlyMedia) {
    session.data.earlyMedia.pause();
    session.data.earlyMedia.removeAttribute("src");
    session.data.earlyMedia.load();
    session.data.earlyMedia = null;
  }
  // Stop any ringing calls
  if (session.data.ringerObj) {
    session.data.ringerObj.pause();
    session.data.ringerObj.removeAttribute("src");
    session.data.ringerObj.load();
    session.data.ringerObj = null;
  }

  // Stop Recording if we are
  // StopRecording(lineObj.LineNumber, true);

  // Audio Meters
  if (lineObj.LocalSoundMeter != null) {
    lineObj.LocalSoundMeter.stop();
    lineObj.LocalSoundMeter = null;
  }
  if (lineObj.RemoteSoundMeter != null) {
    lineObj.RemoteSoundMeter.stop();
    lineObj.RemoteSoundMeter = null;
  }

  // Make sure you have released the microphone
  if (
    session &&
    session.sessionDescriptionHandler &&
    session.sessionDescriptionHandler.peerConnection
  ) {
    var pc = session.sessionDescriptionHandler.peerConnection;
    pc.getSenders().forEach(function (RTCRtpSender) {
      if (RTCRtpSender.track && RTCRtpSender.track.kind == "audio") {
        RTCRtpSender.track.stop();
      }
    });
  }

  // End timers
  window.clearInterval(session.data.videoResampleInterval);
  window.clearInterval(session.data.callTimer);

  // Add to stream
  // AddCallMessage(lineObj.BuddyObj.identity, session);

  // Check if this call was missed
  if (session.data.calldirection == "inbound") {
    if (session.data.earlyReject) {
      // Call was rejected without even ringing
      // IncreaseMissedBadge(session.data.buddyId);
      console.log("Missed call from " + session.data.buddyId);
    } else if (
      session.data.terminateby == "them" &&
      session.data.startTime == null
    ) {
      // Call Terminated by them during ringing
      if (session.data.reasonCode == 0) {
        // Call was canceled, and not answered elsewhere
        // IncreaseMissedBadge(session.data.buddyId);
        console.log("Not Answered, terminated by them");
        incomingCallBacks.onStatusChange("Call Cancelled by remote User");
        setTimeout(() => incomingCallBacks.onCancleInvite());
      }
    }
  }
}

var incomingCallBacks = {};
var outgoingCallbacks = {};

export function bindIncomingCallBacks(callBacks, audioElementRef) {
  incomingCallBacks = callBacks;
  remoteAudio = audioElementRef;
}
export function bindOutgoingBacks(callBacks, audioElementRef) {
  outgoingCallbacks = callBacks;
  remoteAudio = audioElementRef;
}

var invitation = null;
export function rejectInvite() {
  if (invitation != null) {
    invitation.reject();
  }
  lineObj = null;
}
// Inbound Calls
// =============
function ReceiveCall(session) {
  invitation = session;
  var callerID = session.remoteIdentity.displayName;
  var did = session.remoteIdentity.uri.user;
  if (typeof callerID === "undefined") callerID = did;

  console.log("New Incoming Call!", callerID + " <" + did + ">");
  incomingCallBacks.onInvite(did);

  var CurrentCalls = countSessions(session.id);
  console.log("Current Call Count:", CurrentCalls);

  var buddyObj = FindBuddyByDid(did);
  // Make new contact of its not there
  if (buddyObj == null) {
    // Check if Privacy DND is enabled

    var buddyType = did.length > DidLength ? "contact" : "extension";
    var focusOnBuddy = CurrentCalls == 0;
    buddyObj = MakeBuddy(
      buddyType,
      true,
      focusOnBuddy,
      false,
      callerID,
      did,
      null,
      false,
      null,
      AutoDeleteDefault
    );
  } else {
    // Double check that the buddy has the same caller ID as the incoming call
    // With Buddies that are contacts, eg +441234567890 <+441234567890> leave as as
    if (buddyObj.type == "extension" && buddyObj.CallerIDName != callerID) {
      // UpdateBuddyCallerID(buddyObj, callerID);
    } else if (
      buddyObj.type == "contact" &&
      callerID != did &&
      buddyObj.CallerIDName != callerID
    ) {
      // UpdateBuddyCallerID(buddyObj, callerID);
    }
  }

  // Create the line and add the session so we can answer or reject it.
  newLineNumber = newLineNumber + 1;
  lineObj = new Line(newLineNumber, callerID, did, buddyObj);
  lineObj.SipSession = session;
  lineObj.SipSession.data = {};
  lineObj.SipSession.data.line = lineObj.LineNumber;
  lineObj.SipSession.data.calldirection = "inbound";
  lineObj.SipSession.data.terminateby = "";
  lineObj.SipSession.data.src = did;
  lineObj.SipSession.data.buddyId = lineObj.BuddyObj.identity;
  lineObj.SipSession.data.callstart = utcDateNow();
  lineObj.SipSession.data.earlyReject = false;
  Lines.push(lineObj);
  // Detect Video
  lineObj.SipSession.data.withvideo = false;
  if (EnableVideoCalling == true && lineObj.SipSession.request.body) {
    // Asterisk 13 PJ_SIP always sends m=video if endpoint has video codec,
    // even if original invite does not specify video.
    if (lineObj.SipSession.request.body.indexOf("m=video") > -1) {
      lineObj.SipSession.data.withvideo = true;
      // The invite may have video, but the buddy may be a contact
      if (buddyObj.type == "contact") {
        // videoInvite = false;
        // TODO: Is this limitation necessary?
      }
    }
  }

  // Session Delegates
  lineObj.SipSession.delegate = {
    onBye: function (sip) {
      onSessionReceivedBye(lineObj, sip);
    },
    onMessage: function (sip) {
      onSessionReceivedMessage(lineObj, sip);
    },
    onInvite: function (sip) {
      onSessionReinvited(lineObj, sip);
    },
    onSessionDescriptionHandler: function (sdh, provisional) {
      onSessionDescriptionHandlerCreated(
        lineObj,
        sdh,
        provisional,
        lineObj.SipSession.data.withvideo
      );
    },
  };
  // incomingInviteRequestDelegate
  lineObj.SipSession.incomingInviteRequest.delegate = {
    onCancel: function (sip) {
      onInviteCancel(lineObj, sip);
    },
  };

  // Possible Early Rejection options
  // if (DoNotDisturbEnabled == true || DoNotDisturbPolicy == "enabled") {
  //   if (DoNotDisturbEnabled == true && buddyObj.EnableDuringDnd == true) {
  //     // This buddy has been allowed
  //     console.log("Buddy is allowed to call while you are on DND");
  //   } else {
  //     console.log("Do Not Disturb Enabled, rejecting call.");
  //     lineObj.SipSession.data.earlyReject = true;
  //     RejectCall(lineObj.LineNumber, true);
  //     return;
  //   }
  // }

  if (CurrentCalls >= 1) {
    if (CallWaitingEnabled == false || CallWaitingEnabled == "disabled") {
      console.log("Call Waiting Disabled, rejecting call.");
      lineObj.SipSession.data.earlyReject = true;
      RejectCall(lineObj.LineNumber, true);
      return;
    }
  }

  // // Create the call HTML
  // AddLineHtml(lineObj, "inbound");
  // //"#line-" + lineObj.LineNumber + "-msg").html(lang.incoming_call);
  // //"#line-" + lineObj.LineNumber + "-msg").show();
  // //"#line-" + lineObj.LineNumber + "-timer").show();
  // if (lineObj.SipSession.data.withvideo) {
  //   //"#line-" + lineObj.LineNumber + "-answer-video").show();
  // } else {
  //   //"#line-" + lineObj.LineNumber + "-answer-video").hide();
  // }
  // //"#line-" + lineObj.LineNumber + "-AnswerCall").show();

  // Update the buddy list now so that any early rejected calls don't flash on
  // UpdateBuddyList();

  // Auto Answer options
  var autoAnswerRequested = false;
  var answerTimeout = 1000;
  if (!AutoAnswerEnabled && IntercomPolicy == "enabled") {
    // Check headers only if policy is allow

    // https://github.com/InnovateAsterisk/Browser-Phone/issues/126
    // Alert-Info: info=alert-autoanswer
    // Alert-Info: answer-after=0
    // Call-info: answer-after=0; x=y
    // Call-Info: Answer-After=0
    // Alert-Info: ;info=alert-autoanswer
    // Alert-Info: <sip:>;info=alert-autoanswer
    // Alert-Info: <sip:domain>;info=alert-autoanswer

    var ci = session.request.headers["Call-Info"];
    if (ci !== undefined && ci.length > 0) {
      for (var i = 0; i < ci.length; i++) {
        var raw_ci = ci[i].raw.toLowerCase();
        if (raw_ci.indexOf("answer-after=") > 0) {
          var temp_seconds_autoanswer = parseInt(
            raw_ci
              .substring(
                raw_ci.indexOf("answer-after=") + "answer-after=".length
              )
              .split(";")[0]
          );
          if (
            Number.isInteger(temp_seconds_autoanswer) &&
            temp_seconds_autoanswer >= 0
          ) {
            autoAnswerRequested = true;
            if (temp_seconds_autoanswer > 1)
              answerTimeout = temp_seconds_autoanswer * 1000;
            break;
          }
        }
      }
    }
    var ai = session.request.headers["Alert-Info"];
    if (autoAnswerRequested === false && ai !== undefined && ai.length > 0) {
      for (var i = 0; i < ai.length; i++) {
        var raw_ai = ai[i].raw.toLowerCase();
        if (
          raw_ai.indexOf("auto answer") > 0 ||
          raw_ai.indexOf("alert-autoanswer") > 0
        ) {
          var autoAnswerRequested = true;
          break;
        }
        if (raw_ai.indexOf("answer-after=") > 0) {
          var temp_seconds_autoanswer = parseInt(
            raw_ai
              .substring(
                raw_ai.indexOf("answer-after=") + "answer-after=".length
              )
              .split(";")[0]
          );
          if (
            Number.isInteger(temp_seconds_autoanswer) &&
            temp_seconds_autoanswer >= 0
          ) {
            autoAnswerRequested = true;
            if (temp_seconds_autoanswer > 1)
              answerTimeout = temp_seconds_autoanswer * 1000;
            break;
          }
        }
      }
    }
  }

  if (
    false //case about auto answering
  ) {
    if (CurrentCalls == 0) {
      // There are no other calls, so you can answer
      console.log("Going to Auto Answer this call...");
      window.setTimeout(function () {
        // If the call is with video, assume the auto answer is also
        // In order for this to work nicely, the recipient maut be "ready" to accept video calls
        // In order to ensure video call compatibility (i.e. the recipient must have their web cam in, and working)
        // The NULL video should be configured
        // https://github.com/InnovateAsterisk/Browser-Phone/issues/26
        if (lineObj.SipSession.data.withvideo) {
          AnswerVideoCall(lineObj.LineNumber);
        } else {
          AnswerAudioCall(lineObj.LineNumber);
        }
      }, answerTimeout);

      // // Select Buddy
      // SelectLine(lineObj.LineNumber);
      return;
    } else {
      console.warn("Could not auto answer call, already on a call.");
    }
  }

  // Check if that buddy is not already on a call??
  var streamVisible = false; ////"#stream-" + buddyObj.identity).is(":visible");
  if (streamVisible || CurrentCalls == 0) {
    // If you are already on the selected buddy who is now calling you, switch to his call.
    // NOTE: This will put other calls on hold
    // if (CurrentCalls == 0) SelectLine(lineObj.LineNumber);
  }

  // Show notification / Ring / Windows Etc
  // ======================================

  // Browser Window Notification
  // if ("Notification" in window) {
  //   if (Notification.permission === "granted") {
  //     var noticeOptions = {
  //       body: lang.incoming_call_from + " " + callerID + " <" + did + ">",
  //       icon: getPicture(buddyObj.identity),
  //     };
  //     var inComingCallNotification = new Notification(
  //       lang.incoming_call,
  //       noticeOptions
  //     );
  //     inComingCallNotification.onclick = function (event) {
  //       var lineNo = lineObj.LineNumber;
  //       var videoInvite = lineObj.SipSession.data.withvideo;
  //       window.setTimeout(function () {
  //         // https://github.com/InnovateAsterisk/Browser-Phone/issues/26
  //         if (videoInvite) {
  //           AnswerVideoCall(lineNo);
  //         } else {
  //           AnswerAudioCall(lineNo);
  //         }
  //       }, 1000);

  //       // Select Buddy
  //       SelectLine(lineNo);
  //       return;
  //     };
  //   }
  // }

  // Play Ring Tone if not on the phone
  if (EnableRingtone == true) {
    if (CurrentCalls >= 1) {
      // Play Alert
      console.log("Audio:", audioBlobs.CallWaiting.url);
      var ringer = new Audio(audioBlobs.CallWaiting.blob);
      ringer.preload = "auto";
      ringer.loop = false;
      ringer.oncanplaythrough = function () {
        if (
          typeof ringer.sinkId !== "undefined" &&
          getRingerOutputID() != "default"
        ) {
          ringer
            .setSinkId(getRingerOutputID())
            .then(function () {
              console.log("Set sinkId to:", getRingerOutputID());
            })
            .catch(function (e) {
              console.warn("Failed not apply setSinkId.", e);
            });
        }
        // If there has been no interaction with the page at all... this page will not work
        ringer
          .play()
          .then(function () {
            // Audio Is Playing
          })
          .catch(function (e) {
            console.warn("Unable to play audio file.", e);
          });
      };
      lineObj.SipSession.data.ringerObj = ringer;
    } else {
      // Play Ring Tone
      console.log("Audio:", audioBlobs.Ringtone.url);
      var ringer = new Audio(audioBlobs.Ringtone.blob);
      ringer.preload = "auto";
      ringer.loop = true;
      ringer.oncanplaythrough = function () {
        if (
          typeof ringer.sinkId !== "undefined" &&
          getRingerOutputID() != "default"
        ) {
          ringer
            .setSinkId(getRingerOutputID())
            .then(function () {
              console.log("Set sinkId to:", getRingerOutputID());
            })
            .catch(function (e) {
              console.warn("Failed not apply setSinkId.", e);
            });
        }
        // If there has been no interaction with the page at all... this page will not work
        ringer
          .play()
          .then(function () {
            // Audio Is Playing
          })
          .catch(function (e) {
            console.warn("Unable to play audio file.", e);
          });
      };
      lineObj.SipSession.data.ringerObj = ringer;
    }
  }
}
export function AnswerAudioCall() {
  var lineNumber = lineObj.LineNumber;
  if (lineObj == null) {
    console.warn("Failed to get line (" + lineNumber + ")");
    return;
  }
  var session = lineObj.SipSession;
  // Stop the ringtone
  if (session.data.ringerObj) {
    session.data.ringerObj.pause();
    session.data.ringerObj.removeAttribute("src");
    session.data.ringerObj.load();
    session.data.ringerObj = null;
  }
  // Check vitals
  if (false) {
    window.alert("Audio Device not Found");

    return;
  }

  // Update UI
  // //"#line-" + lineObj.LineNumber + "-AnswerCall").hide();

  // Start SIP handling
  var supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
  var spdOptions = {
    sessionDescriptionHandlerOptions: {
      constraints: {
        audio: { deviceId: "default" },
        video: false,
      },
    },
  };

  // Configure Audio
  var currentAudioDevice = getAudioSrcID();
  if (currentAudioDevice != "default") {
    var confirmedAudioDevice = false;
    for (var i = 0; i < AudioinputDevices.length; ++i) {
      if (currentAudioDevice == AudioinputDevices[i].deviceId) {
        confirmedAudioDevice = true;
        break;
      }
    }
    if (confirmedAudioDevice) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
        exact: currentAudioDevice,
      };
    } else {
      console.warn(
        "The audio device you used before is no longer available, default settings applied."
      );
      // localStorage.setItem("AudioSrcId", "default");
    }
  }
  // Add additional Constraints
  if (supportedConstraints.autoGainControl) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl =
      AutoGainControl;
  }
  if (supportedConstraints.echoCancellation) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
      EchoCancellation;
  }
  if (supportedConstraints.noiseSuppression) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
      NoiseSuppression;
  }

  // Save Devices
  lineObj.SipSession.data.withvideo = false;
  lineObj.SipSession.data.VideoSourceDevice = null;
  lineObj.SipSession.data.AudioSourceDevice = getAudioSrcID();
  lineObj.SipSession.data.AudioOutputDevice = getAudioOutputID();

  // Send Answer
  lineObj.SipSession.accept(spdOptions)
    .then(function () {
      onInviteAccepted(lineObj, false);
    })
    .catch(function (error) {
      console.warn("Failed to answer call", error, lineObj.SipSession);
      lineObj.SipSession.data.reasonCode = 500;
      lineObj.SipSession.data.reasonText = "Client Error";
      teardownSession(lineObj);
    });
}
function FindLineByNumber(lineNum) {
  for (var l = 0; l < Lines.length; l++) {
    if (Lines[l].LineNumber == lineNum) return Lines[l];
  }
  return null;
}
function AnswerVideoCall(lineNumber) {
  // CloseWindow();

  var lineObj = FindLineByNumber(lineNumber);
  if (lineObj == null) {
    console.warn("Failed to get line (" + lineNumber + ")");
    return;
  }
  var session = lineObj.SipSession;
  // Stop the ringtone
  if (session.data.ringerObj) {
    session.data.ringerObj.pause();
    session.data.ringerObj.removeAttribute("src");
    session.data.ringerObj.load();
    session.data.ringerObj = null;
  }
  // Check vitals
  if (HasAudioDevice == false) {
    window.alert("No Mic Found");
    // //"#line-" + lineObj.LineNumber + "-msg").html(lang.call_failed);
    // //"#line-" + lineObj.LineNumber + "-AnswerCall").hide();
    return;
  }

  // Update UI

  // Start SIP handling
  var supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
  var spdOptions = {
    sessionDescriptionHandlerOptions: {
      constraints: {
        audio: { deviceId: "default" },
        video: { deviceId: "default" },
      },
    },
  };

  // Configure Audio
  var currentAudioDevice = getAudioSrcID();
  if (currentAudioDevice != "default") {
    var confirmedAudioDevice = false;
    for (var i = 0; i < AudioinputDevices.length; ++i) {
      if (currentAudioDevice == AudioinputDevices[i].deviceId) {
        confirmedAudioDevice = true;
        break;
      }
    }
    if (confirmedAudioDevice) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
        exact: currentAudioDevice,
      };
    } else {
      console.warn(
        "The audio device you used before is no longer available, default settings applied."
      );
      // localStorage.setItem("AudioSrcId", "default");
    }
  }
  // Add additional Constraints
  if (supportedConstraints.autoGainControl) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl =
      AutoGainControl;
  }
  if (supportedConstraints.echoCancellation) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
      EchoCancellation;
  }
  if (supportedConstraints.noiseSuppression) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
      NoiseSuppression;
  }

  // Configure Video
  var currentVideoDevice = getVideoSrcID();
  if (currentVideoDevice != "default") {
    var confirmedVideoDevice = false;
    for (var i = 0; i < VideoinputDevices.length; ++i) {
      if (currentVideoDevice == VideoinputDevices[i].deviceId) {
        confirmedVideoDevice = true;
        break;
      }
    }
    if (confirmedVideoDevice) {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.deviceId = {
        exact: currentVideoDevice,
      };
    } else {
      console.warn(
        "The video device you used before is no longer available, default settings applied."
      );
      localStorage.setItem("VideoSrcId", "default"); // resets for later and subsequent calls
    }
  }
  // Add additional Constraints
  if (supportedConstraints.frameRate && maxFrameRate != "") {
    spdOptions.sessionDescriptionHandlerOptions.constraints.video.frameRate =
      maxFrameRate;
  }
  if (supportedConstraints.height && videoHeight != "") {
    spdOptions.sessionDescriptionHandlerOptions.constraints.video.height =
      videoHeight;
  }
  if (supportedConstraints.aspectRatio && videoAspectRatio != "") {
    spdOptions.sessionDescriptionHandlerOptions.constraints.video.aspectRatio =
      videoAspectRatio;
  }

  // Save Devices
  lineObj.SipSession.data.withvideo = true;
  lineObj.SipSession.data.VideoSourceDevice = getVideoSrcID();
  lineObj.SipSession.data.AudioSourceDevice = getAudioSrcID();
  lineObj.SipSession.data.AudioOutputDevice = getAudioOutputID();

  // if (StartVideoFullScreen) ExpandVideoArea(lineObj.LineNumber);

  // Send Answer
  lineObj.SipSession.accept(spdOptions)
    .then(function () {
      onInviteAccepted(lineObj, true);
    })
    .catch(function (error) {
      console.warn("Failed to answer call", error, lineObj.SipSession);
      lineObj.SipSession.data.reasonCode = 500;
      lineObj.SipSession.data.reasonText = "Client Error";
      teardownSession(lineObj);
    });
}

export function BlindTransfer(dstNo, callbacks) {
  if (EnableAlphanumericDial) {
    dstNo = dstNo.replace(telAlphanumericRegEx, "").substring(0, MaxDidLength);
  } else {
    dstNo = dstNo.replace(telNumericRegEx, "").substring(0, MaxDidLength);
  }
  if (dstNo == "") {
    console.warn("Cannot transfer, no number");
    return;
  }

  if (lineObj == null || lineObj.SipSession == null) {
    console.warn("Null line or session");
    return;
  }
  var session = lineObj.SipSession;

  if (!session.data.transfer) session.data.transfer = [];
  session.data.transfer.push({
    type: "Blind",
    to: dstNo,
    transferTime: utcDateNow(),
    disposition: "refer",
    dispositionTime: utcDateNow(),
    accept: {
      complete: null,
      eventTime: null,
      disposition: "",
    },
  });
  var transferId = session.data.transfer.length - 1;

  var transferOptions = {
    requestDelegate: {
      onAccept: function (sip) {
        console.log("Blind transfer Accepted");

        session.data.terminateby = "us";
        session.data.reasonCode = 202;
        session.data.reasonText = "Transfer";

        session.data.transfer[transferId].accept.complete = true;
        session.data.transfer[transferId].accept.disposition =
          sip.message.reasonPhrase;
        session.data.transfer[transferId].accept.eventTime = utcDateNow();

        // TODO: use lang pack
        callbacks.onAccept();

        session.bye().catch(function (error) {
          console.warn("Could not BYE after blind transfer:", error);
        });
        teardownSession(lineObj);
      },
      onReject: function (sip) {
        callbacks.onReject();
        console.warn("REFER rejected:", sip);

        session.data.transfer[transferId].accept.complete = false;
        session.data.transfer[transferId].accept.disposition =
          sip.message.reasonPhrase;
        session.data.transfer[transferId].accept.eventTime = utcDateNow();

        // Session should still be up, so just allow them to try again
      },
    },
  };
  console.log("REFER: ", dstNo + "@" + domain);
  var referTo = UserAgent.makeURI(
    "sip:" + dstNo.replace(/#/g, "%23") + "@" + domain
  );
  session.refer(referTo, transferOptions).catch(function (error) {
    console.warn("Failed to REFER", error);
  });

  // $("#line-" + lineNum + "-msg").html(lang.call_blind_transfered);
}

export function AttendedTransfer(num, callbacks) {
  if (EnableAlphanumericDial) {
    num = num.replace(telAlphanumericRegEx, "").substring(0, MaxDidLength);
  } else {
    num = num.replace(telNumericRegEx, "").substring(0, MaxDidLength);
  }
  if (num == "") {
    console.warn("Cannot transfer, no number");
    return;
  }

  if (lineObj == null || lineObj.SipSession == null) {
    console.warn("Null line or session");
    return;
  }
  var session = lineObj.SipSession;

  if (!session.data.transfer) session.data.transfer = [];
  session.data.transfer.push({
    type: "Attended",
    to: num,
    transferTime: utcDateNow(),
    disposition: "invite",
    dispositionTime: utcDateNow(),
    accept: {
      complete: null,
      eventTime: null,
      disposition: "",
    },
  });
  var transferId = session.data.transfer.length - 1;

  // SDP options
  var supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
  var spdOptions = {
    earlyMedia: true,
    sessionDescriptionHandlerOptions: {
      constraints: {
        audio: { deviceId: "default" },
        video: false,
      },
    },
  };
  if (session.data.AudioSourceDevice != "default") {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
      exact: session.data.AudioSourceDevice,
    };
  }
  // Add additional Constraints
  if (supportedConstraints.autoGainControl) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl =
      AutoGainControl;
  }
  if (supportedConstraints.echoCancellation) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
      EchoCancellation;
  }
  if (supportedConstraints.noiseSuppression) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
      NoiseSuppression;
  }

  // Not sure if its possible to transfer a Video call???
  if (session.data.withvideo) {
    spdOptions.sessionDescriptionHandlerOptions.constraints.video = true;
    if (session.data.VideoSourceDevice != "default") {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.deviceId = {
        exact: session.data.VideoSourceDevice,
      };
    }
    // Add additional Constraints
    if (supportedConstraints.frameRate && maxFrameRate != "") {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.frameRate =
        maxFrameRate;
    }
    if (supportedConstraints.height && videoHeight != "") {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.height =
        videoHeight;
    }
    if (supportedConstraints.aspectRatio && videoAspectRatio != "") {
      spdOptions.sessionDescriptionHandlerOptions.constraints.video.aspectRatio =
        videoAspectRatio;
    }
  }

  // Create new call session
  console.log("TRANSFER INVITE: ", "sip:" + num + "@" + domain);
  var targetURI = UserAgent.makeURI(
    "sip:" + num.replace(/#/g, "%23") + "@" + domain
  );
  var newSession = new Inviter(userAgent, targetURI, spdOptions);
  newSession.data = {};
  newSession.delegate = {
    onBye: function (sip) {
      callbacks?.onBye();
      session.data.transfer[transferId].disposition = "bye";
      session.data.transfer[transferId].dispositionTime = utcDateNow();
    },
    onSessionDescriptionHandler: function (sdh, provisional) {
      if (sdh) {
        if (sdh.peerConnection) {
          sdh.peerConnection.ontrack = function (event) {
            var pc = sdh.peerConnection;

            // Gets Remote Audio Track (Local audio is setup via initial GUM)
            var remoteStream = new MediaStream();
            pc.getReceivers().forEach(function (receiver) {
              if (receiver.track && receiver.track.kind == "audio") {
                remoteStream.addTrack(receiver.track);
              }
            });

            remoteAudio.srcObject = remoteStream;
            remoteAudio.onloadedmetadata = function (e) {
              if (typeof remoteAudio.sinkId !== "undefined") {
                remoteAudio
                  .setSinkId(session.data.AudioOutputDevice)
                  .then(function () {
                    console.log(
                      "sinkId applied: " + session.data.AudioOutputDevice
                    );
                  })
                  .catch(function (e) {
                    console.warn("Error using setSinkId: ", e);
                  });
              }
              remoteAudio.play();
            };
          };
        } else {
          console.warn(
            "onSessionDescriptionHandler fired without a peerConnection"
          );
        }
      } else {
        console.warn(
          "onSessionDescriptionHandler fired without a sessionDescriptionHandler"
        );
      }
    },
  };
  session.data.childsession = newSession;
  callbacks?.onSessionReceived(session, newSession, transferId);
  var inviterOptions = {
    requestDelegate: {
      onTrying: function (sip) {
        callbacks?.onTrying();
        session.data.transfer[transferId].disposition = "trying";
        session.data.transfer[transferId].dispositionTime = utcDateNow();
      },
      onProgress: function (sip) {
        callbacks?.onRinging();
        session.data.transfer[transferId].disposition = "progress";
        session.data.transfer[transferId].dispositionTime = utcDateNow();
      },
      onRedirect: function (sip) {
        callbacks?.onRedirect();
        console.log("Redirect received:", sip);
      },
      onAccept: function (sip) {
        callbacks?.onAccept(session, transferId);
        session.data.transfer[transferId].disposition = "accepted";
        session.data.transfer[transferId].dispositionTime = utcDateNow();

        // window.setTimeout(function () {
        //   newCallStatus.hide();
        //   CancelTransferSession(lineNum);

        // }, 1000);
      },
      onReject: function (sip) {
        console.log("New call session rejected: ", sip.message.reasonPhrase);
        this.onReject();
        session.data.transfer[transferId].disposition =
          sip.message.reasonPhrase;
        session.data.transfer[transferId].dispositionTime = utcDateNow();
      },
    },
  };
  newSession.invite(inviterOptions).catch(function (e) {
    console.warn("Failed to send INVITE:", e);
  });
}

export function cancelBySession(session) {
  session.cancel().catch(function (error) {
    console.warn("Failed to CANCEL", error);
  });
}

export function terminateAttendedTransfer(mainSession, subSession, transferId) {
  subSession.bye().catch(function (error) {
    console.warn("Failed to BYE", error);
  });

  mainSession.data.transfer[transferId].accept.complete = false;
  mainSession.data.transfer[transferId].accept.disposition = "bye";
  mainSession.data.transfer[transferId].accept.eventTime = utcDateNow();
}

export function CompleteTransfer(session, newSession, transferId, callbacks) {
  var transferOptions = {
    requestDelegate: {
      onAccept: function (sip) {
        console.log("Attended transfer Accepted");
        session.data.terminateby = "us";
        session.data.reasonCode = 202;
        session.data.reasonText = "Attended Transfer";
        session.data.transfer[transferId].accept.complete = true;
        session.data.transfer[transferId].accept.disposition =
          sip.message.reasonPhrase;
        session.data.transfer[transferId].accept.eventTime = utcDateNow();

        session.bye().catch(function (error) {
          console.warn("Could not BYE after blind transfer:", error);
        });

        teardownSession(lineObj);
        callbacks?.onAccept();
      },
      onReject: function (sip) {
        callbacks?.onReject();
        console.warn("Attended transfer rejected:", sip);

        session.data.transfer[transferId].accept.complete = false;
        session.data.transfer[transferId].accept.disposition =
          sip.message.reasonPhrase;
        session.data.transfer[transferId].accept.eventTime = utcDateNow();
      },
    },
  };

  // Send REFER
  session.refer(newSession, transferOptions).catch(function (error) {
    console.warn("Failed to REFER", error);
  });
}

export function RejectCall() {
  var lineNumber = lineObj.LineNumber;
  if (lineObj == null) {
    console.warn("Unable to find line (" + lineNumber + ")");
    return;
  }
  var session = lineObj.SipSession;
  if (session == null) {
    console.warn("Reject failed, null session");
  }
  if (session.state == SessionState.Established) {
    session.bye().catch(function (e) {
      console.warn("Problem in RejectCall(), could not bye() call", e, session);
    });
  } else {
    session
      .reject({
        statusCode: 486,
        reasonPhrase: "Busy Here",
      })
      .catch(function (e) {
        console.warn(
          "Problem in RejectCall(), could not reject() call",
          e,
          session
        );
      });
  }
  console.log("call rejected");

  session.data.terminateby = "us";
  session.data.reasonCode = 486;
  session.data.reasonText = "Busy Here";
  teardownSession(lineObj);
}

// General Session delegates
function onSessionReceivedBye(lineObj, response) {
  // They Ended the call

  console.log("Call ended, bye!");

  lineObj.SipSession.data.terminateby = "them";
  lineObj.SipSession.data.reasonCode = 16;
  lineObj.SipSession.data.reasonText = "Normal Call clearing";

  response.accept(); // Send OK

  teardownSession(lineObj);
}
function onSessionReinvited(lineObj, response) {
  // This may be used to include video streams
  var sdp = response.body;

  // All the possible streams will get
  // Note, this will probably happen after the streams are added
  lineObj.SipSession.data.videoChannelNames = [];
  var videoSections = sdp.split("m=video");
  if (videoSections.length >= 1) {
    for (var m = 0; m < videoSections.length; m++) {
      if (
        videoSections[m].indexOf("a=mid:") > -1 &&
        videoSections[m].indexOf("a=label:") > -1
      ) {
        // We have a label for the media
        var lines = videoSections[m].split("\r\n");
        var channel = "";
        var mid = "";
        for (var i = 0; i < lines.length; i++) {
          if (lines[i].indexOf("a=label:") == 0) {
            channel = lines[i].replace("a=label:", "");
          }
          if (lines[i].indexOf("a=mid:") == 0) {
            mid = lines[i].replace("a=mid:", "");
          }
        }
        lineObj.SipSession.data.videoChannelNames.push({
          mid: mid,
          channel: channel,
        });
      }
    }
    console.log(
      "videoChannelNames:",
      lineObj.SipSession.data.videoChannelNames
    );
    // RedrawStage(lineObj.LineNumber, false);
  }
}
function onSessionReceivedMessage(lineObj, response) {
  var messageType =
    response.request.headers["Content-Type"].length >= 1
      ? response.request.headers["Content-Type"][0].parsed
      : "Unknown";
  if (messageType.indexOf("application/x-asterisk-confbridge-event") > -1) {
    // Conference Events JSON
    var msgJson = JSON.parse(response.request.body);

    var session = lineObj.SipSession;
    if (!session.data.ConfbridgeChannels) session.data.ConfbridgeChannels = [];
    if (!session.data.ConfbridgeEvents) session.data.ConfbridgeEvents = [];

    if (msgJson.type == "ConfbridgeStart") {
      console.log("ConfbridgeStart!");
    } else if (msgJson.type == "ConfbridgeWelcome") {
      console.log("Welcome to the Asterisk Conference");
      console.log("Bridge ID:", msgJson.bridge.id);
      console.log("Bridge Name:", msgJson.bridge.name);
      console.log("Created at:", msgJson.bridge.creationtime);
      console.log("Video Mode:", msgJson.bridge.video_mode);

      session.data.ConfbridgeChannels = msgJson.channels; // Write over this
      session.data.ConfbridgeChannels.forEach(function (chan) {
        // The mute and unmute status doesn't appear to be a realtime state, only what the
        // startmuted= setting of the default profile is.
        console.log(
          chan.caller.name,
          "Is in the conference. Muted:",
          chan.muted,
          "Admin:",
          chan.admin
        );
      });
    } else if (msgJson.type == "ConfbridgeJoin") {
      msgJson.channels.forEach(function (chan) {
        var found = false;
        session.data.ConfbridgeChannels.forEach(function (existingChan) {
          if (existingChan.id == chan.id) found = true;
        });
        if (!found) {
          session.data.ConfbridgeChannels.push(chan);
          session.data.ConfbridgeEvents.push({
            event:
              chan.caller.name +
              " (" +
              chan.caller.number +
              ") joined the conference",
            eventTime: utcDateNow(),
          });
          console.log(
            chan.caller.name,
            "Joined the conference. Muted: ",
            chan.muted
          );
        }
      });
    } else if (msgJson.type == "ConfbridgeLeave") {
      msgJson.channels.forEach(function (chan) {
        session.data.ConfbridgeChannels.forEach(function (existingChan, i) {
          if (existingChan.id == chan.id) {
            session.data.ConfbridgeChannels.splice(i, 1);
            console.log(chan.caller.name, "Left the conference");
            session.data.ConfbridgeEvents.push({
              event:
                chan.caller.name +
                " (" +
                chan.caller.number +
                ") left the conference",
              eventTime: utcDateNow(),
            });
          }
        });
      });
    } else if (msgJson.type == "ConfbridgeTalking") {
      // var videoContainer = //"#line-" + lineObj.LineNumber + "-remote-videos");
      // if (videoContainer) {
      //   msgJson.channels.forEach(function (chan) {
      //     videoContainer.find("video").each(function () {
      //       if (this.srcObject.channel && this.srcObject.channel == chan.id) {
      //         if (chan.talking_status == "on") {
      //           console.log(chan.caller.name, "is talking.");
      //           this.srcObject.isTalking = true;
      //           // //this).css("border", "1px solid red");
      //         } else {
      //           console.log(chan.caller.name, "stopped talking.");
      //           this.srcObject.isTalking = false;
      //           // //this).css("border", "1px solid transparent");
      //         }
      //       }
      //     });
      //   });
      // }
    } else if (msgJson.type == "ConfbridgeMute") {
      msgJson.channels.forEach(function (chan) {
        session.data.ConfbridgeChannels.forEach(function (existingChan) {
          if (existingChan.id == chan.id) {
            console.log(existingChan.caller.name, "is now muted");
            existingChan.muted = true;
          }
        });
      });
      // RedrawStage(lineObj.LineNumber, false);
    } else if (msgJson.type == "ConfbridgeUnmute") {
      msgJson.channels.forEach(function (chan) {
        session.data.ConfbridgeChannels.forEach(function (existingChan) {
          if (existingChan.id == chan.id) {
            console.log(existingChan.caller.name, "is now unmuted");
            existingChan.muted = false;
          }
        });
      });
      // RedrawStage(lineObj.LineNumber, false);
    } else if (msgJson.type == "ConfbridgeEnd") {
      console.log("The Asterisk Conference has ended, bye!");
    } else {
      console.warn("Unknown Asterisk Conference Event:", msgJson.type, msgJson);
    }
    // RefreshLineActivity(lineObj.LineNumber);
    response.accept();
  } else if (
    messageType.indexOf("application/x-myphone-confbridge-chat") > -1
  ) {
    console.log("x-myphone-confbridge-chat", response);

    response.accept();
  } else {
    console.warn("Unknown message type");
    response.reject();
  }
}

function onSessionDescriptionHandlerCreated(
  lineObj,
  sdh,
  provisional,
  includeVideo
) {
  if (sdh) {
    if (sdh.peerConnection) {
      // console.log(sdh);
      sdh.peerConnection.ontrack = function () {
        // console.log(event);
        onTrackAddedEvent(lineObj, includeVideo);
      };
      // sdh.peerConnectionDelegate = {
      //     ontrack: function(event){
      //         console.log(event);
      //         onTrackAddedEvent(lineObj, includeVideo);
      //     }
      // }
    } else {
      console.warn(
        "onSessionDescriptionHandler fired without a peerConnection"
      );
    }
  } else {
    console.warn(
      "onSessionDescriptionHandler fired without a sessionDescriptionHandler"
    );
  }
}
var inCall = false;
function onTrackAddedEvent(lineObj, includeVideo) {
  // Gets remote tracks
  var session = lineObj.SipSession;
  // TODO: look at detecting video, so that UI switches to audio/video automatically.

  var pc = session.sessionDescriptionHandler.peerConnection;

  var remoteAudioStream = new MediaStream();
  var remoteVideoStream = new MediaStream();

  pc.getTransceivers().forEach(function (transceiver) {
    // Add Media
    var receiver = transceiver.receiver;
    if (receiver.track) {
      if (receiver.track.kind == "audio") {
        console.log("Adding Remote Audio Track");
        inCall = true;
        remoteAudioStream.addTrack(receiver.track);
      }
      if (includeVideo && receiver.track.kind == "video") {
        if (transceiver.mid) {
          receiver.track.mid = transceiver.mid;
          console.log(
            "Adding Remote Video Track - ",
            receiver.track.readyState,
            "MID:",
            receiver.track.mid
          );
          remoteVideoStream.addTrack(receiver.track);
        }
      }
    }
  });

  // Attach Audio
  if (remoteAudioStream.getAudioTracks().length >= 1) {
    remoteAudio.srcObject = remoteAudioStream;
    remoteAudio.onloadedmetadata = function () {
      if (typeof remoteAudio.sinkId !== "undefined") {
        remoteAudio
          .setSinkId(getAudioOutputID())
          .then(function () {
            console.log("sinkId applied: " + getAudioOutputID());
            OnStatusChange("In Progress");
          })
          .catch(function (e) {
            console.warn("Error using setSinkId: ", e);
          });
      }
      remoteAudio.play();
    };
  }

  // if (includeVideo) {
  //   // Single Or Multiple View
  //   // //"#line-" + lineObj.LineNumber + "-remote-videos").empty();
  //   if (remoteVideoStream.getVideoTracks().length >= 1) {
  //     var remoteVideoStreamTracks = remoteVideoStream.getVideoTracks();
  //     remoteVideoStreamTracks.forEach(function (remoteVideoStreamTrack) {
  //       var thisRemoteVideoStream = new MediaStream();
  //       thisRemoteVideoStream.trackID = remoteVideoStreamTrack.id;
  //       thisRemoteVideoStream.mid = remoteVideoStreamTrack.mid;
  //       remoteVideoStreamTrack.onended = function () {
  //         console.log("Video Track Ended: ", this.mid);
  //         RedrawStage(lineObj.LineNumber, true);
  //       };
  //       thisRemoteVideoStream.addTrack(remoteVideoStreamTrack);

  //       var wrapper = //"<span />", {
  //         class: "VideoWrapper",
  //       });
  //       wrapper.css("width", "1px");
  //       wrapper.css("heigh", "1px");
  //       wrapper.hide();

  //       var callerID = //"<div />", {
  //         class: "callerID",
  //       });
  //       wrapper.append(callerID);

  //       var Actions = //"<div />", {
  //         class: "Actions",
  //       });
  //       wrapper.append(Actions);

  //       var videoEl = //"<video />", {
  //         id: remoteVideoStreamTrack.id,
  //         mid: remoteVideoStreamTrack.mid,
  //         muted: true,
  //         autoplay: true,
  //         playsinline: true,
  //         controls: false,
  //       });
  //       videoEl.hide();

  //       var videoObj = videoEl.get(0);
  //       videoObj.srcObject = thisRemoteVideoStream;
  //       videoObj.onloadedmetadata = function (e) {
  //         // videoObj.play();
  //         videoEl.show();
  //         videoEl.parent().show();
  //         console.log("Playing Video Stream MID:", thisRemoteVideoStream.mid);
  //         RedrawStage(lineObj.LineNumber, true);
  //       };
  //       wrapper.append(videoEl);

  //       //"#line-" + lineObj.LineNumber + "-remote-videos").append(wrapper);

  //       console.log("Added Video Element MID:", thisRemoteVideoStream.mid);
  //     });
  //   } else {
  //     console.log("No Video Streams");
  //     RedrawStage(lineObj.LineNumber, true);
  //   }
  // }
}
