import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  where,
  query,
  collection,
  getDocs,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { fireDB } from "../config";
import {
  Button,
  IconButton,
  Snackbar,
  Typography,
  Box,
  Avatar,
  Container,
  Grid,
  Chip,
} from "@mui/material";
import { Close, Delete, Edit } from "@mui/icons-material";
const DetailProduct = () => {
  let params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState({});
  const [subProducts, setSubProducts] = useState({});
  const [category, setCategory] = useState({});
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  async function handleData() {
    const docRef = doc(fireDB, "products", params.productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setProducts({ ...docSnap.data(), id: docSnap.id });
    } else {
      console.log("No such document!");
    }
  }
  async function handleCategory() {
    const docRef = doc(fireDB, "categories", products.category_id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setCategory({ ...docSnap.data(), id: docSnap.id });
    } else {
      console.log("No such document!");
    }
  }
  async function handleSubData() {
    const q = query(
      collection(fireDB, "subProducts"),
      where("productId", "==", products.id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setSubProducts({ ...doc.data(), id: doc.id });
    });
  }
  React.useEffect(() => {
    handleData();
  }, []);
  useEffect(() => {
    if (products.id) {
      handleSubData();
      handleCategory();
    }
  }, [products]);

  const handleDelete = async (docId, data) => {
    const delRef = doc(fireDB, "subProducts", subProducts.id);
    await updateDoc(delRef, {
      size: arrayRemove(docId),
    });
  };

  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <Close fontSize="small" />
      </IconButton>
    </>
  );
  return (
    <Container sx={{ m: 2 }} maxWidth="lg">
      {products.id ? (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <Avatar
              src={products.image}
              sx={{ width: "100%", height: "100%", objectfit: "contain" }}
              variant="rounded"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="h4"> {products.name}</Typography>
            <Chip
              avatar={<Avatar alt="Natacha" src={category.category_img} />}
              label={category.title}
              variant="outlined"
            />
            <Typography variant="subtitle1">
              Price: ${products.price}
            </Typography>

            <Typography variant="subtitle2">{products.description}</Typography>

            <Button
              onClick={() => {
                let item = {};
                item.productId = products.id;
                let product = JSON.stringify(item);
                navigate(`/dashboard/subproducts/${product}`);
              }}
            >
              Add Sub Products
            </Button>

            {subProducts?.size?.map((item, index) => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "40%",
                }}
                key={index}
              >
                <Box>
                  <Typography variant="subtitle2">{item.name}</Typography>
                  <Typography variant="subtitle2">{item.price}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">{item.weight}</Typography>
                  <IconButton
                    onClick={() => {
                      item.productId = subProducts.productId;
                      item.id = subProducts.id;
                      let product = JSON.stringify(item);
                      navigate(`/dashboard/subproducts/${product}`);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item, subProducts)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h5">Loading...</Typography>
      )}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note archived"
        action={action}
      />
    </Container>
  );
};

export default DetailProduct;
