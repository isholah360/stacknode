import React, { useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { Typography, Chip, Box } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { getData, writeData } from "../functions/writeData";
import {
  Timestamp,
  doc,
  setDoc,
  getDocs,
  collection,
  addDoc,
} from "firebase/firestore";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useTheme } from "@mui/material/styles";
import toast from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";
import { auth, fireDB } from "../config";
import { createUserWithEmailAndPassword } from "firebase/auth";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function AddUser() {
  const theme = useTheme();
  const params = useParams();
  const navigate = useNavigate();

  const [inputData, setInputData] = React.useState({
    email: "",
    password: "",
    location: "",
    type: "",
    status: 1,
  });
  useEffect(() => {
    if (params?.item) {
      let item = JSON.parse(params.item);

      setInputData({
        ...inputData,
        email: item.email,
        type: item.type,
        password: item.password,
        location: item.location,
        status: item.status ? 1 : 0,
        id: item.id,
      });
    }
  }, [params]);

  const handleChange = (event) => {
    setInputData({ ...inputData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let body = {
      email: inputData.email,
      password: inputData.password,
      location: inputData?.location,
      type: inputData.type,
      status: inputData.status == 1 ? true : false,
    };
    // Configure the request
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
      body: JSON.stringify(body), // Convert the data object to JSON string
    };

    // Make the POST request using Fetch
    try {
      if (inputData?.id) {
        await setDoc(doc(fireDB, "users", inputData?.id), body);
        alert("the user is set successfully");
        navigate("/dashboard/users");
      } else {
        const response = await fetch(
          "http://localhost:5000/keventers/adduser",
          requestOptions
        );
        const data = await response.json();
        if (data.uid) {
          await setDoc(doc(fireDB, "users", data.uid), body);
          // await addDoc(collection(fireDB, "users"), body);
          alert("the user is added successfully");
          navigate("/dashboard/users");
        }
      }
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  return (
    <div
      style={{
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        width: "50%",
        marginLeft: "25%",
        marginTop: "5%",
      }}
    >
      <Typography variant="h4">Create User</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel>Location</InputLabel>

          <Select
            name="location"
            label="Location"
            value={inputData.location}
            onChange={handleChange}
          >
            <MenuItem value={"1 Eva Rd #108, Etobicoke, ON M9C 4Z5,    Canada"}>
              1 Eva Rd #108, Etobicoke, ON M9C 4Z5, Canada
            </MenuItem>
            <MenuItem
              value={"3390 S Service Rd, Burlington, ON L7N 3J5, Canada"}
            >
              3390 S Service Rd, Burlington, ON L7N 3J5, Canada
            </MenuItem>
            <MenuItem
              value={"1225 Kennedy Rd, Scarborough, ON M1P 4Y1, Canada"}
            >
              1225 Kennedy Rd, Scarborough, ON M1P 4Y1, Canada
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          name="email"
          fullWidth
          label="Enter email"
          color={"primary"}
          value={inputData.email}
          onChange={handleChange}
        />
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel>Type</InputLabel>

          <Select
            name="type"
            label="User Type"
            value={inputData.type}
            onChange={handleChange}
          >
            <MenuItem value={"owner"}>Admin</MenuItem>
            <MenuItem value={"manager"}>Manager</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel>Status</InputLabel>

          <Select
            name="status"
            label="User status"
            value={inputData.status}
            onChange={handleChange}
          >
            <MenuItem value={0}>In-Active</MenuItem>
            <MenuItem value={1}>Active</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="password"
          fullWidth
          label="password"
          sx={{ my: 1 }}
          color="primary"
          value={inputData.password}
          onChange={handleChange}
        />

        <br />
        <Button
          type="submit"
          variant="contained"
          sx={{
            marginTop: 5,
            marginBottom: 10,
            backgroundColor: "#E4780E",
            fontSize: "18px",
            fontpassword: "bold",
          }}
        >
          Add users
        </Button>
      </form>
    </div>
  );
}
