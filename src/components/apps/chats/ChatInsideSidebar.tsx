import React, { useState } from "react";
import {
  Box,
  Theme,
  useMediaQuery,
  Typography,
  Stack,
  Avatar,
  Grid,
  Alert,
  IconButton,
  styled,
} from "@mui/material";
import { uniq, flatten } from "lodash";
import { IconDownload } from "@tabler/icons-react";
import { Chat, ChatMessage } from "../../../types/response_schemas";
import ImageViewDialog from "../../imageViewDialog";

interface chatType {
  isInSidebar?: boolean;
  chat?: Chat;
}

const drawerWidth = 320;

const ChatInsideSidebar = ({ isInSidebar, chat }: chatType) => {



  const [imageToView, setImageToView] = useState<string | null>(null);



  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  // const totalAttachment = uniq(
  //   flatten(chat?.messages.map((item) => item.attachment_url))
  // ).length;

  
  const mediaMessages:ChatMessage[] = [];
  chat?.messages.forEach((x)=>{
    if(x.type=='image') mediaMessages.push(x);
  });

  const StyledStack = styled(Stack)(() => ({
    ".showOnHover": {
      display: "none",
    },
    "&:hover .showOnHover": {
      display: "block",
    },
  }));

  return (
    <>

      {isInSidebar ? (
        <Box
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            border: "0",
            borderLeft: "1px",
            borderStyle: "solid",
            right: "0",
            height: "100%",
            background: (theme) => theme.palette.background.paper,
            boxShadow: lgUp ? null : (theme) => theme.shadows[9],
            position: lgUp ? "relative" : "absolute",
            borderColor: (theme) => theme.palette.divider,
          }}
          p={3}
        >
          <ImageViewDialog
            label=""
            open={imageToView != null}
            imageUrl={imageToView ?? ''}
            onClose={() => setImageToView(null)}
          />
          <Typography variant="h6" mb={2}>
            Media ({mediaMessages.length})
          </Typography>
          <Grid container rowSpacing={2} columnSpacing={0} >
            {mediaMessages.map((c) => {
              return (
                <Grid item xs={12} lg={4} key={c.id}>
                  {c?.type === "image" ? (
                    <Avatar
                      onClick={() => setImageToView(c?.attachment_url)}
                      src={c?.attachment_url}
                      alt="media"
                      variant="rounded"
                      sx={{ width: "85px", height: "85px" }}
                    />
                  ) : (
                    ""
                  )}
                </Grid>
              );
            })}
            <Grid item xs={12} lg={12}>
              {mediaMessages.length === 0 ? (
                <Alert severity="error">No Media Found!</Alert>
              ) : null}
            </Grid>
          </Grid>

          {/* <Typography variant="h6" mt={5} mb={2}>
            Attachments ({totalAttachment})
          </Typography> */}
          <Box sx={{ display: 'none' }}>
            {chat?.messages.map((c, index) => {
              return (
                <Stack spacing={2.5} key={index} direction="column">
                  {/* {c?.attachment_url?.map((a, index) => {
                    return (
                      <StyledStack key={index} direction="row" gap={2}>
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: "48px",
                            height: "48px",
                            bgcolor: (theme) => theme.palette.grey[100],
                          }}
                        >
                          <Avatar
                            src={a.icon}
                            alt="av"
                            variant="rounded"
                            sx={{ width: "24px", height: "24px" }}
                          ></Avatar>
                        </Avatar>
                        <Box mr={"auto"}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            mb={1}
                          >
                            {a.file}
                          </Typography>
                          <Typography variant="body2">{a.fileSize}</Typography>
                        </Box>
                        <Box className="showOnHover">
                          <IconButton aria-label="delete">
                            <IconDownload stroke={1.5} size="20" />
                          </IconButton>
                        </Box>
                      </StyledStack>
                    );
                  })} */}
                </Stack>
              );
            })}
            {/* {totalAttachment === 0 ? (
              <Alert severity="error">No Attachment Found!</Alert>
            ) : null} */}
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default ChatInsideSidebar;
