import { Button, Stack } from "@mui/material";
import Link from "next/link";

import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../../src/components/forms/theme-elements/CustomFormLabel";
import { useState } from "react";
import WarningDialog from "../../../src/components/ui-components/dialog/WarningDialog";
import { forgetPassword } from "../../../src/utils/API";






const AuthForgotPassword = () => {
  const [email, setEmail] = useState<string>('');

  const [warningTitle,setWarningTitle] = useState<string>('');
  const [message,setMessage] = useState<string>('');
  const [open,setOpen] = useState<boolean>(false);



  


  async function makeCall(email: string) :Promise<any> {

    const response =await forgetPassword(email);
    setOpen(true);
  
    setWarningTitle("Response");
    setMessage(response['message']);
    


  }  



  return (

    <>
      <Stack mt={4} spacing={2}>
        <CustomFormLabel  htmlFor="reset-email">Email Adddress</CustomFormLabel>
        <CustomTextField onChange={(e: any) => {
          setEmail(e.target.value);
        }} id="reset-email" variant="outlined" fullWidth />

        <WarningDialog
          title={warningTitle}
          warning={message}
           open={open}
           setOpen={setOpen}
         />

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={() => makeCall(email)}


        >
          Forgot Password
        </Button>
        <Button
          color="primary"
          size="large"
          fullWidth
          component={Link}
          href="/auth/login"
        >
          Back to Login
        </Button>
      </Stack>
    </>
  )

};

export default AuthForgotPassword;
