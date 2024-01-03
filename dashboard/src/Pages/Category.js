import React, { useState, useEffect } from "react";
import { fireDB } from "../config";

import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import "../App.css";

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

export default function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res);
    });
  }, []);

  async function getCategories() {
    var dataforTheCategories = [];
    const productForMenu = collection(fireDB, "categories");
    const docOfMenuCategories = await getDocs(productForMenu);
    docOfMenuCategories.forEach((doc) => {
      var tempData = doc.data();
      dataforTheCategories.push({
        cat_id: doc.id,
        title: tempData.title,
        cat_img: tempData.category_img,
        cat_position: tempData.position,
      });
    });
    return dataforTheCategories;
  }

  return (
    <Container sx={{ my: 2 }}>
      {categories.length !== 0 ? (
        <Grid container spacing={2}>
          {categories?.map((item, index) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
              <CategoryList
                name={item?.title}
                image={item?.cat_img}
                id={item?.cat_id}
                position={item?.cat_position}
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

const CategoryList = ({ ...props }) => {
  let navigate = useNavigate();

  const handleDetail = (propId) => {
    navigate(`/dashboard/addcategory/${propId}`);
  };
  const handleDelete = async (docId) => {
    const delRef = doc(fireDB, "categories", docId);

    const chec = await deleteDoc(delRef);

    alert("delete");
  };
  return (
    <Card sx={{ borderRadius: 5 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="190"
        image={props.image}
        sx={{ p: 1, borderRadius: 5 }}
      />
      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography gutterBottom variant="h5" component="div">
          {props.name}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {props.position}
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
