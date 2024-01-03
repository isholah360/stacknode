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
} from "firebase/firestore";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useTheme } from "@mui/material/styles";

import { useNavigate, useParams } from "react-router-dom";
import { fireDB } from "../config";
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

export default function AddCoupons() {
  const theme = useTheme();
  const params = useParams();
  const navigate = useNavigate();

  const [inputData, setInputData] = React.useState({
    product_id: [],
    limit: "",
    discount: "",
    code: "",
    validity: new Date().toJSON(),
    limit: "",
    type: "",
    range: "",
  });
  useEffect(() => {
    if (params?.item) {
      let item = JSON.parse(params.item);

      setInputData({
        ...inputData,
        limit: item.limit,
        discount: item.discount,
        code: item.code,
        product_id: item.productId,
        type: item.type,
        validity: new Date(
          item.validity.seconds * 1000 + item.validity.nanoseconds / 1000000
        )
          .toJSON()
          .split(".")[0],
        id: item.id,
        range: item?.range,
      });
    }
  }, [params]);

  const [colData, setColData] = React.useState();

  async function collectionData() {
    let data = await getData("products");

    setColData(data);
  }
  // const totalAmount = useMemo(() => {
  //   if (!inputData?.product_id) {
  //     alert("Please Select Product ");
  //     return 0.0;
  //   }
  //   const getData = colData?.find((item) => item.id === inputData.product_id);

  //   return (
  //     getData?.data?.price -
  //     (getData?.data?.price * parseInt(inputData.discount)) / 100
  //   ).toFixed(2);
  // }, [inputData.discount]);
  // const tokenrenew = async () => {
  //   const users = await getDocs(collection(db, "users"));
  //   users.forEach((doc) => sendPushNotification(doc.data().token));
  // };

  useEffect(() => {
    collectionData();
  }, []);

  const handleChange = (event) => {
    setInputData({ ...inputData, [event.target.name]: event.target.value });
  };
  const handleMultiple = (event) => {
    const {
      target: { value },
    } = event;

    setInputData({
      ...inputData,
      product_id: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let body = {
      limit: inputData.limit,
      discount: inputData.discount,
      code: inputData.code,
      validity: Timestamp.fromDate(new Date(inputData.validity)),
      productId: inputData?.product_id?.map((row) =>
        doc(fireDB, "products/" + row)
      ),
      coords: {
        latitude: inputData?.type?.split(",")[0],
        longitude: inputData?.type?.split(",")[1],
      },
      range: inputData?.range,
      status: true,
      users: [],
    };

    if (inputData?.id) {
      await setDoc(doc(fireDB, "coupons", inputData?.id), body);
      alert("the coupon is set successfully");
      navigate("/dashboard/coupons");
    } else {
      await writeData("coupons", body);
      alert("the coupon is added successfully");
      navigate("/dashboard/coupons");
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
      <Typography variant="h4">Add a Coupon</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ my: 1 }}>
          {/* <InputLabel id="demo-simple-select-label">Select Type</InputLabel> */}

          <Select
            name="type"
            label="Location"
            value={inputData.type}
            onChange={handleChange}
          >
            <MenuItem value={"43.639478,-79.563069"}>
              1 Eva Road, Suite 108, Etobicoke, ON, M9C 4Z5
            </MenuItem>
            <MenuItem value={"43.361472,-79.791369"}>
              3390 S Service Rd, unit 101 Burlington, ON L7N 3J5 Canada
            </MenuItem>
            <MenuItem value={"43.756078,-79.275739"}>
              1225 Kennedy Rd unit D &amp; E, Scarborough, ON M1P 4Y1
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          name="limit"
          fullWidth
          label="Enter Discount Limit"
          color={"primary"}
          value={inputData.limit}
          onChange={handleChange}
        />

        <FormControl fullWidth sx={{ my: 1 }}>
          {/* <InputLabel id="demo-simple-select-label">Select Product</InputLabel> */}

          <Select
            labelId="demo-simple-select-label"
            name="product_id"
            label=" Select Product"
            value={inputData.product_id}
            onChange={handleMultiple}
            multiple
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {colData?.map((item, index) => (
              <MenuItem
                value={item.id}
                key={index}
                style={getStyles(item.id, inputData?.product_id, theme)}
              >
                {item?.data?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          name="code"
          fullWidth
          label="code"
          sx={{ my: 1 }}
          color="primary"
          value={inputData.code}
          onChange={handleChange}
        />
        <TextField
          name="discount"
          fullWidth
          label="Discount (in Dollars)"
          sx={{ my: 1 }}
          color="primary"
          value={inputData.discount}
          onChange={handleChange}
        />
        <TextField
          name="range"
          fullWidth
          label="Range (in Kilometers)"
          sx={{ my: 1 }}
          color="primary"
          value={inputData.range}
          onChange={handleChange}
        />

        <TextField
          label="Validity"
          type="datetime-local"
          // defaultValue="2017-05-24T10:30"
          value={inputData.validity}
          name="validity"
          onChange={handleChange}
          sx={{ my: 1 }}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: new Date().toJSON().split(".")[0],
            step: "any",
          }}
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
            fontcode: "bold",
          }}
        >
          Add Coupons
        </Button>
      </form>
    </div>
  );
}
