import React, { useState, useEffect } from "react";
import "../App.css";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { fireDB } from "../config";
import {
  Card,
  Box,
  Stack,
  Typography,
  Container,
  Chip,
  Switch,
  Avatar,
  IconButton,
  Grid,
  CardMedia,
  CardActions,
  CardContent,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
const CategoryList = ({ ...props }) => {
  let navigate = useNavigate();

  const handleDetail = (propId) => {
    navigate(`/dashboard/addproducts/${propId}`);
  };
  const handleDelete = async (docId) => {
    const delRef = doc(fireDB, "products", docId);

    await deleteDoc(delRef);
  };

  return (
    <Card sx={{ borderRadius: 5 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="190"
        image={props.image}
        sx={{ p: { xs: 1, sm: 2, md: 3, lg: 4 }, borderRadius: 5 }}
      />

      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="a"
          onClick={() => navigate(`/dashboard/product/${props.id}`)}
          sx={{ cursor: "pointer" }}
        >
          {props.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${props.price}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton size="small" onClick={() => handleDetail(props.id)}>
          <Edit />
        </IconButton>
        <IconButton size="small" onClick={() => handleDelete(props.id)}>
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default function Products() {
  const [products, setProduct] = useState([]);
  // get all products
  useEffect(() => {
    getProducts().then((res) => {
      setProduct(res);
    });
  }, []);

  async function getProducts() {
    var dataforTheProducts = [];
    const productForMenu = collection(fireDB, "products");
    const docOfMenuProducts = await getDocs(productForMenu);
    docOfMenuProducts.forEach((doc) => {
      var tempData = doc.data();

      dataforTheProducts.push({
        product_id: doc.id,
        name: tempData.name,
        product_img: tempData.image,
        product_price: tempData.price,
      });
    });

    return dataforTheProducts;
  }

  return (
    <Container sx={{ my: 2 }}>
      {products.length !== 0 ? (
        <Grid container spacing={2}>
          {products.map((item, index) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
              <CategoryList
                name={item.name}
                image={item.product_img}
                id={item.product_id}
                price={item.product_price}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>Loading...</Box>
      )}
    </Container>
  );
}
