import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { loginType } from "../../../src/types/auth/auth";
import CustomCheckbox from "../../../src/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../../src/components/forms/theme-elements/CustomFormLabel";

import AuthSocialButtons from "./AuthSocialButtons";
import { useState } from "react";
import WarningDialog from "../../../src/components/ui-components/dialog/WarningDialog";
import { loginWithPanel } from "../../../src/utils/API";
import { UserDataType, getData, navigateTo, saveData } from "../../../src/utils/utils";

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [warning,setWarning] = useState<string>('');
  const [warningTitle,setWarningTitle] = useState<string>('');
  const [open,setOpen]  = useState<boolean>(false);

  const data = getData();


  if(data.login_status==='success'){
    navigateTo('/');
  }


function login(){
  if(password==="" || username===""){
    setWarning('Fill the both fields\n and try again');
    setWarningTitle('');
    setOpen(true);
    return;
  }
  loginWithPanel(username,password,(error,result)=>{
    if(error){
      setWarning(error.message);
      setWarningTitle('Authentication Failed');
      setOpen(true);
    }else{
      try{
        const status = result.login_status;
        if(status!=="success"){
          setWarning(status);
          setWarningTitle('Authentication Failed');
          setOpen(true);
          return;
        }
        
        saveData(result as UserDataType);
        navigateTo("/");

      }catch(e){
        saveData(result as UserDataType);

        navigateTo("/");
      }
      
    }
  });
  
}


  return (<>
    {title ? (
      <Typography fontWeight="700" variant="h3" mb={1}>
        {title}
      </Typography>
    ) : null}



    {subtext}
    <WarningDialog title={warningTitle} warning={warning} open={open} setOpen={setOpen} />
    <AuthSocialButtons title="Sign in with" />
    <Box mt={3}>
      <Divider>
        <Typography
          component="span"
          color="textSecondary"
          variant="h6"
          fontWeight="400"
          position="relative"
          px={2}
        >
          or sign in with
        </Typography>
      </Divider>
    </Box>

    <Stack>
      <Box>
        <CustomFormLabel htmlFor="username">Username</CustomFormLabel>
        <CustomTextField           value = {username}
          onChange={(e: any) => {setUsername( e.target.value)}} id="username" variant="outlined" fullWidth />
      </Box>
      <Box>
        <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
        <CustomTextField
          value = {password}
          onChange={(e: any) => {setPassword( e.target.value)}}
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
  )



};

export default AuthLogin;
