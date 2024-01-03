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
  const params = useParams();
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    title: "",
    file: "",
    category_img: "",
    position: "",
  });

  useEffect(() => {
    if (params.categoryId) {
      handleCategory();
    }
  }, [params]);
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setInputData({
          ...inputData,
          category_img: e.target.result,
          file: event.target.files[0],
        });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  async function handleCategory() {
    const docRef = doc(fireDB, "categories", params.categoryId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setInputData({ ...docSnap.data(), id: docSnap.id });
    } else {
    }
  }
  const createCategory = async () => {
    let category_img;
    if (inputData.file) {
      category_img = await imageUpload(inputData.file);
    }

    if (
      (category_img !== null || inputData.category_img !== undefined) &&
      inputData.title !== null
    ) {
      let data = {
        category_img: category_img ? category_img : inputData.category_img,
        title: inputData.title,
        position: inputData.position,
      };
      if (params.categoryId) {
        await setDoc(doc(fireDB, "categories", params.categoryId), data);
        alert("update");
        navigate("/dashboard/category");
      } else {
        await writeData("categories", data);
        alert("Crate");
        navigate("/dashboard/category");
      }
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
      <TextField
        label="Enter Category Name"
        style={{ marginTop: 10 }}
        fullWidth
        color="primary"
        value={inputData.title}
        onChange={(e) => setInputData({ ...inputData, title: e.target.value })}
      />
      <TextField
        label="Enter Position"
        style={{ marginTop: 10 }}
        fullWidth
        color="primary"
        value={inputData.position}
        type="number"
        onChange={(e) =>
          setInputData({ ...inputData, position: e.target.value })
        }
      />
      <Box sx={{ my: 1, display: "flex", justifyContent: "space-between" }}>
        <Button
          color="primary"
          component="label"
          variant="contained"
          sx={{ width: "100%", mr: 1 }}
        >
          <input
            type="file"
            onChange={onImageChange}
            accept=".jpg, .jpeg, .png"
            hidden
          />
          <FileUpload fontSize="large" />
        </Button>
        <Avatar
          src={inputData?.category_img}
          sx={{ width: "50%", height: "100px" }}
          variant="rounded"
        />
      </Box>
      {/* <Typography>{inputData?.category_img}</Typography> */}

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
        onClick={() => createCategory()}
      >
        Add Category
      </Button>
    </div>
  );
}
