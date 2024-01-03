import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { getData, writeData } from "../functions/writeData";

import { fireDB } from "../config";
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  getDocs,
  arrayRemove,
  addDoc,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
export default function AddSubProduct() {
  const params = useParams();
  const navigate = useNavigate();
  const [inputData, setInputData] = React.useState({
    product_id: "",
    name: "",
    price: "",
    weight: "",
  });
  const [delData, setDelData] = React.useState({});
  useEffect(() => {
    let item = JSON.parse(params?.product);

    setDelData({
      ...delData,
      name: item.name,
      price: item.price,
      weight: item.weight,
    });
    setInputData({
      ...inputData,
      name: item.name,
      price: item.price,
      weight: item.weight,
      product_id: item.productId,
      id: item.id,
    });
  }, [params]);

  const [colData, setColData] = React.useState();

  async function collectionData() {
    let data = await getData("products");

    setColData(data);
  }

  useEffect(() => {
    collectionData();
  }, []);

  const handleChange = (event) => {
    setInputData({ ...inputData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let body = {
      name: inputData.name,
      price: inputData.price,
      weight: inputData.weight || "",
    };
    let subProducts = {};
    const colRef = collection(fireDB, "subProducts");
    const queryRef = query(
      colRef,
      where("productId", "==", inputData?.product_id)
    );
    const querySnapshot = await getDocs(queryRef);
    querySnapshot.forEach((doc) => {
      subProducts.id = doc.id;
      subProducts.data = doc.data();
    });
    if (subProducts?.id) {
      let dataId = subProducts.id;

      const collecRef = doc(fireDB, "subProducts", dataId);

      if (inputData.id) {
        const delRef = doc(fireDB, "subProducts", inputData.id);
        await updateDoc(delRef, {
          size: arrayRemove(delData),
        });
      }
      await updateDoc(collecRef, {
        size: arrayUnion(body),
      });
      alert("update array");
      navigate(`/dashboard/product/${inputData.product_id}`);
    } else {
      let bodyData = {
        productId: inputData?.product_id,
        size: [body],
      };
      // await writeData("subProducts", bodyData);
      try {
        await addDoc(collection(fireDB, "subProducts"), bodyData);
        alert("ok");
        navigate(`/dashboard/product/${inputData.product_id}`);
      } catch (err) {
        console.log(err);
      }
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

        <FormControl fullWidth sx={{ marginTop: 5 }}>
          <InputLabel id="demo-simple-select-label">Select Product</InputLabel>

          <Select
            labelId="demo-simple-select-label"
            name="product_id"
            label="Product"
            value={inputData.product_id}
            onChange={handleChange}
          >
            {colData?.map((item, index) => (
              <MenuItem value={item.id} key={index}>
                {item.data.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          name="weight"
          fullWidth
          label="Weight"
          sx={{ marginTop: 5 }}
          color="primary"
          value={inputData.weight}
          onChange={handleChange}
        />
        <TextField
          name="price"
          fullWidth
          label="Price"
          sx={{ marginTop: 5 }}
          color="primary"
          value={inputData.price}
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
          Add Sub Product
        </Button>
      </form>
    </div>
  );
}
