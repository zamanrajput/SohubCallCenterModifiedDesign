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
  navigateTo,

} from "../../../src/utils/utils";
import Image from "next/image";
import { dispatch, useSelector } from "../../../src/store/Store";
import { getCreds, loadUser as loginUser, setCreds, setError, setWarning } from "../../../src/store/auth/AuthSlice";

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const [warningTitle, setWarningTitle] = useState<string>("Authentication Failed!");

  
  const authReducer = useSelector((state)=>state.authReducer);



  function setOpen(value:any){
    dispatch(setError(value));
  }


  function login() {
    if (password === "" || username === "") {
      dispatch(setWarning("Fill the both fields\n and try again"));
      setWarningTitle("");
      dispatch(setError(true));
      return;
    }
    setWarningTitle("Authentication Failed!");
    dispatch(loginUser({ email: username, password: password },(/*success*/)=>{
      navigateTo('/');
    },()=>{
      dispatch(setError(true));
      dispatch(setWarning("Invalid email or password"));
    }))

  }

  if(getCreds().email!=''){
    navigateTo('/');
  }

  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: 'center', marginBottom: '40px' }}>
        <div style={{ width: 200, height: 40 }}>
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
        warning={authReducer.message}
        open={authReducer.error}
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
