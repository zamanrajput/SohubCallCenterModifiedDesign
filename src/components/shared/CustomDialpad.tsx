import { Box, Button, Container, Grid } from '@mui/material';


interface AppDialpadProps  {
    onCharReceived:(char:string)=>void
}




function AppDialpad(props:AppDialpadProps) {
  return (
    <Container maxWidth="xs">
      <Box mt={2}>
        <Grid container spacing={1.2}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((digit) => (
            <Grid item xs={4} key={digit}>
              <Button onClick={()=>props.onCharReceived(digit.toString())} variant="contained" style={{ width: '100%', height: '100%', fontSize: '1.5rem' }}>
                {digit}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default AppDialpad;
