import React from "react";
import TextField from "@mui/material/TextField";
type Props = {
  name: string;
  type: string;
  label: string;
};
const CustomizedInput = (props: Props) => {
  return (
    <TextField
      margin="normal"
      InputLabelProps={{ style: { color: "white" } }}
      name={props.name}
      label={props.label}
      type={props.type}
      InputProps={{
        style: {
          height: 55,
          width: "400px",
          borderRadius: 10,
          fontSize: 18,
          color: "white",
        },
      }}
    />
  );
};

export default CustomizedInput;
