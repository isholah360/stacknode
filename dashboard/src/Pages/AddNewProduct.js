import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { getData, writeData } from "../functions/writeData";
import imageUpload from "../functions/uploadImage";
import { useParams } from "react-router-dom";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { fireDB } from "../config";
import { Avatar, Box } from "@mui/material";
import { FileUpload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
export default function AddNewProduct() {
  const params = useParams();
  const navigate = useNavigate();
  const [inputData, setInputData] = React.useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    cals: "",
    file: "",
    image: "",
    position: "",
  });

  const [colData, setColData] = React.useState();

  async function collectionData() {
    let data = await getData("categories");

    setColData(data);
  }

  React.useEffect(() => {
    collectionData();
  }, []);

  const handleChange = (event) => {
    setInputData({ ...inputData, [event.target.name]: event.target.value });
  };
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setInputData({
          ...inputData,
          image: e.target.result,
          file: event.target.files[0],
        });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  useEffect(() => {
    if (params.productId) {
      handleCategory();
    }
  }, [params]);
  async function handleCategory() {
    const docRef = doc(fireDB, "products", params.productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setInputData({ ...docSnap.data(), id: docSnap.id });
    } else {
      console.log("No such document!");
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    let image;
    console.log(inputData);
    if (inputData.file) {
      image = await imageUpload(inputData.file);
    }

    if (
      (image !== null || inputData.image !== undefined) &&
      inputData.title !== null
    ) {
      let data = {
        category_id: inputData.category_id,
        name: inputData.name,
        description: inputData.description,
        price: inputData.price,
        cals: inputData.cals,
        position: inputData.position,
        image: image ? image : inputData.image,
      };
      if (params.productId) {
        await setDoc(doc(fireDB, "products", params.productId), data);
        alert("update productId");
      } else {
        await writeData("products", data);
        alert("create productId");
      }
      navigate("/dashboard/products");
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
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          fullWidth
          label="Enter Product Name"
          color="primary"
          value={inputData.name}
          onChange={handleChange}
        />

        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel id="demo-simple-select-label">Select Category</InputLabel>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="category_id"
            label="Category"
            value={inputData.category_id}
            onChange={handleChange}
          >
            {colData?.map((item, index) => (
              <MenuItem value={item.id} key={index}>
                {item.data.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          name="cals"
          fullWidth
          label="Calories"
          color="primary"
          value={inputData.cals}
          onChange={handleChange}
        />
        <TextField
          label="Enter Position"
          fullWidth
          sx={{ my: 1 }}
          color="primary"
          value={inputData.position}
          name="position"
          onChange={(e) =>
            setInputData({ ...inputData, position: e.target.value })
          }
        />
        <TextField
          name="price"
          fullWidth
          label="Price"
          sx={{ my: 2 }}
          color="primary"
          value={inputData.price}
          onChange={handleChange}
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
            src={inputData?.image}
            sx={{ width: "50%", height: "100px", objectfit: "contain" }}
            variant="rounded"
          />
          <Typography>{inputData?.image}</Typography>
        </Box>

        <TextareaAutosize
          name="description"
          style={{
            marginTop: "40px",
            width: "100%",
            padding: 20,
            fontSize: 18,
            minHeight: 50,
          }}
          minRows={3}
          placeholder="Description"
          value={inputData.description}
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
            fontWeight: "bold",
          }}
        >
          Add Product
        </Button>
      </form>
    </div>
  );
}
