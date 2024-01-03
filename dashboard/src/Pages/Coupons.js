import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Container,
  Box,
  Typography,
  IconButton,
  Pagination,
  Button,
  Badge,
} from "@mui/material";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  query,
  limit,
  startAfter,
  startAt,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { fireDB } from "../config";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
export default function Coupons() {
  const [coupons, setCoupons] = useState();
  const [page, setPage] = React.useState(1);
  const navigate = useNavigate();
  const [perPage] = useState(10);
  const [lastVisible, setLastVisible] = useState(0);

  const handleChange = async (event, value) => {
    setPage(value);
    let start = parseInt((value - 1) * perPage);

    const q = query(
      collection(fireDB, "coupons"),
      orderBy("validity"),
      startAfter(lastVisible),
      limit(perPage)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        cities.push(doc.data());
      });
      setCoupons(cities);
    });
    const documentSnapshots = await getDocs(q);
    const lv = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    if (lv) {
      setLastVisible(lv);
    } else {
      setLastVisible(10);
    }
  };

  useEffect(() => {
    handleDocument();
  }, []);
  const handleDocument = async () => {
    let products = [];
    const querySnaphot = await getDocs(collection(fireDB, "coupons"));
    querySnaphot.forEach(async (doc) => {
      let newItem = { id: doc.id, ...doc.data() };

      newItem.productData = [];
      newItem.productId?.forEach(async (item, index) => {
        let productData = await getDoc(item);
        if (productData.exists()) {
          newItem.productData[index] = {
            prodId: productData.id,
            ...productData.data(),
          };
        }
      });
      products.push(newItem);
    });
    setTimeout(() => {
      setCoupons(products);
    }, 2000);
  };
  async function getData() {
    const q = query(
      collection(fireDB, "coupons"),
      orderBy("validity"),
      limit(perPage)
    );
    const documentSnapshots = await getDocs(q);
    const lv = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastVisible(lv);
    onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach(async (doc) => {
        var tempData = doc.data();
        cities.push({
          ...tempData,
          id: doc.id,
        });
      });
      setCoupons(cities);
    });
  }
  const getDate = (data) => {
    return (
      new Date(data.seconds * 1000).toLocaleTimeString() +
      " " +
      new Date(data.seconds * 1000).toLocaleDateString()
    );
  };
  const handleDelete = async (docId) => {
    const delRef = doc(fireDB, "coupons", docId);

    const chec = await deleteDoc(delRef);
    alert("delete");
  };
  return (
    <Container>
      <Button
        variant="contained"
        onClick={() => navigate("/dashboard/addcoupons")}
      >
        {" "}
        Add New Coupons
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Limit</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Range</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Validity</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons?.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row?.limit}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row?.coords?.latitude} , {row?.coords?.longitude}
                </TableCell>
                <TableCell>{row?.code}</TableCell>
                <TableCell>${row?.discount}</TableCell>
                <TableCell>{row?.range} Kilometers</TableCell>
                <TableCell>{row?.status ? "Active" : "In-Active"}</TableCell>
                <TableCell>{getDate(row?.validity)}</TableCell>

                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      {row?.productData?.map((item, index) => (
                        <IconButton
                          onClick={() =>
                            navigate(`/dashboard/product/${item.prodId}`)
                          }
                          key={index}
                        >
                          <Badge badgeContent={index + 1} color="primary">
                            <Visibility />
                          </Badge>
                        </IconButton>
                      ))}
                    </Box>
                    <IconButton
                      onClick={() => {
                        let product = JSON.stringify(row);
                        navigate(`/dashboard/addcoupons/${product}`);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row?.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination count={10} page={page} onChange={handleChange} />
      </TableContainer>
    </Container>
  );
}

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];
