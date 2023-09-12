import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";
import Link from "next/link";
import { loginType } from "../../../src/types/auth/auth";
import CustomCheckbox from "../../../src/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../../src/components/forms/theme-elements/CustomFormLabel";

import { useState } from "react";
import WarningDialog from "../../../src/components/ui-components/dialog/WarningDialog";
import { loginWithPanel } from "../../../src/utils/API";
import {
  UserDataType,
  getUserData,
  navigateTo,
  saveData,
} from "../../../src/utils/utils";
import Image from "next/image";

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [warning, setWarning] = useState<string>("");
  const [warningTitle, setWarningTitle] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const data = getUserData();

  if (data.login_status === "success") {
    navigateTo("/");
  }

  function login() {
    if (password === "" || username === "") {
      setWarning("Fill the both fields\n and try again");
      setWarningTitle("");
      setOpen(true);
      return;
    }
    loginWithPanel(username, password, (error, result) => {
      if (error) {
        setWarning(error.message);
        setWarningTitle("Authentication Failed");
        setOpen(true);
      } else {
        try {
          const status = result.login_status;
          if (status !== "success") {
            setWarning(status);
            setWarningTitle("Authentication Failed");
            setOpen(true);
            return;
          }

          saveData(result as UserDataType);
          navigateTo("/");
        } catch (e) {
          saveData(result as UserDataType);

          navigateTo("/");
        }
      }
    });
  }

  return (
    <>
      <div style={{ width: "100%", display: "flex",justifyContent:'center' ,marginBottom:'40px'}}>
        <div style={{ width: 200, height: 40}}>
          <Image
            src={"/logo_with_text.png"}
            alt={"Sohub Logo"}
            width={200}
            height={200}
            layout="responsive" // This allows responsive sizing
          />
        </div>
      </div>
      
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}
      <WarningDialog
        title={warningTitle}
        warning={warning}
        open={open}
        setOpen={setOpen}
      />

    

      <Stack>
        <Box>
          <CustomFormLabel htmlFor="username">Username</CustomFormLabel>
          <CustomTextField
            value={username}
            onChange={(e: any) => {
              setUsername(e.target.value);
            }}
            id="username"
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
            value={password}
            onChange={(e: any) => {
              setPassword(e.target.value);
            }}
            id="password"
            type="password"
            variant="outlined"
            fullWidth
          />
        </Box>
        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={<CustomCheckbox defaultChecked />}
              label="Remeber this Device"
            />
          </FormGroup>
          <Typography
            component={Link}
            href="/auth/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            Forgot Password ?
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={login}
        >
          Sign In
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthLogin;
