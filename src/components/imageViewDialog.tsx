import React, { useState } from "react";
import { Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";

type Props = {
  open: boolean,
  imageUrl: string,
  onClose: () => void,
  label: string,
};

const ImageViewDialog = (props: Props) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => {
    setZoomLevel((prevZoomLevel) => prevZoomLevel + 10);
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => prevZoomLevel - 10);
  };

  return (
    <Dialog open={props.open} maxWidth="xl">
      <DialogContent>
        <div className="flex justify-between items-center mb-2">
          <Typography variant="h6">{props.label}</Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="close"
            onClick={props.onClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className="flex justify-center items-center h-full relative">
          <div style={{ transform: `scale(${zoomLevel / 100})` }}>
            <img src={props.imageUrl} alt="Full-screen" className="max-h-full" />
          </div>
          <div className="zoom-buttons">
            <IconButton
              color="inherit"
              aria-label="zoom-in"
              disabled={zoomLevel >= 200}
              onClick={handleZoomIn}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="zoom-out"
              disabled={zoomLevel <= 50}
              onClick={handleZoomOut}
            >
              <RemoveIcon />
            </IconButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewDialog;
