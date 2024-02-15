import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { BiTrash } from "react-icons/bi";

interface DeleteModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteChats: () => void;
}

export default function DeleteModal({
  open,
  setOpen,
  handleDeleteChats,
}: DeleteModalProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    handleDeleteChats();
    handleClose();
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <div
        onClick={handleClickOpen}
        style={{
          zIndex: "99",
          position: "fixed",
          padding: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          borderRadius: "100px",
        }}
      >
        <BiTrash color="red" size={24} />
      </div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          sx={{ fontWeight: "bold", color: "black" }}
          id="responsive-dialog-title"
        >
          Clear Conversation
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: "black" }}>
            Are you sure you want to clear this conversation? This action cannot
            be undone
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button style={{ color: "red" }} onClick={handleDelete} autoFocus>
            Clear Conversation
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
