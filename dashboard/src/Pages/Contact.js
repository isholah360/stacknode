import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IconButton, Avatar, Box, Typography } from "@mui/material";
import imageUpload from "../functions/uploadImage";
import { writeData } from "../functions/writeData";
import { useParams } from "react-router-dom";
import { fireDB } from "../config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { PhotoCamera, FileUpload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function AddNewCategory() {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    email: "",
    description: "",
  });

  const createCategory = async () => {
    if (inputData.description !== null && inputData.email !== null) {
      let data = {
        email: inputData.email,
        description: inputData.description,
      };
      await writeData("contact", data);
      alert("Message has been Sent.");
      navigate("/");
    }
  };

  return (
    <div
      style={{
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        width: "40%",
        marginLeft: "30%",
        marginTop: "5%",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="subtitle2">
        If you have any query related to our Nizams app please contact us
      </Typography>
      <TextField
        label="Enter Email"
        style={{ marginTop: 10 }}
        fullWidth
        type="email"
        color="primary"
        value={inputData.email}
        onChange={(e) => setInputData({ ...inputData, email: e.target.value })}
      />
      <TextField
        label="Enter Description"
        style={{ marginTop: 10 }}
        fullWidth
        color="primary"
        multiline
        rows={3}
        value={inputData.description}
        onChange={(e) =>
          setInputData({ ...inputData, description: e.target.value })
        }
      />

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
        onClick={() => createCategory()}
      >
        Send
      </Button>
    </div>
  );
}
