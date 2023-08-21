import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

const CustomDialog = ({ visible, Child }) => {
  return (
    <Dialog open={visible}>
      <DialogContent>
        <Box display="flex" alignItems="center">
          {Child}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
