import React, { useCallback, useEffect, useState } from "react";

import Collapse from "@mui/material/Collapse";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import {
  Container,
  Box,
  Typography,
  IconButton,
  Pagination,
  Button,
} from "@mui/material";
import {
  collection,
  getDocs,
  doc,
  onSnapshot,
  query,
  limit,
  startAfter,
  startAt,
  orderBy,
  setDoc,
} from "firebase/firestore";
import { fireDB } from "../config";
import { Edit, Delete, LineAxisOutlined } from "@mui/icons-material";
export default function Orders() {
  const [orders, setOrders] = useState();
  const [page, setPage] = React.useState(1);
  const [perPage] = useState(10);
  const [lastVisible, setLastVisible] = useState(0);
  const handleChange = async (event, value) => {
    setPage(value);
    let start = parseInt((value - 1) * perPage);
    const q = query(
      collection(fireDB, "orders"),
      orderBy("pickUptimeandDate"),
      startAfter(lastVisible),
      limit(perPage)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        cities.push(doc.data());
      });
      setOrders(cities);
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
    getData();
  }, []);
  async function getData() {
    const q = query(
      collection(fireDB, "orders"),
      orderBy("pickUptimeandDate", "desc")
    );
    const documentSnapshots = await getDocs(q);
    // const lv = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    // setLastVisible(lv);
    onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        cities.push({ ...doc.data(), id: doc.id });
      });
      setOrders(cities);
    });
  }
  const handleDone = useCallback(async (id) => {
    const cityRef = doc(fireDB, "orders", id);
    await setDoc(cityRef, { status: true }, { merge: true });
  }, []);

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Pick Up Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Total Bill</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((row, index) => (
              <Row key={index} row={row} handleDone={handleDone} />
            ))}
          </TableBody>
        </Table>
        <Pagination count={10} page={page} onChange={handleChange} />
      </TableContainer>
    </Container>
  );
}

function Row(props) {
  const { row, handleDone } = props;
  const [open, setOpen] = React.useState(false);
  const getDate = (data) => {
    return (
      new Date(data.seconds * 1000).toLocaleTimeString() +
      " " +
      new Date(data.seconds * 1000).toLocaleDateString()
    );
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row?.customerDetail?.name}
        </TableCell>
        <TableCell>{row?.customerDetail?.phoneNumber}</TableCell>
        <TableCell>{getDate(row?.pickUptimeandDate)}</TableCell>
        <TableCell>
          <Button onClick={() => handleDone(row?.id)}>
            {row?.status ? " Done " : " Pending "}
          </Button>
        </TableCell>
        <TableCell align="right">$ {row?.total}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Cart Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    {/* <TableCell>Customer</TableCell> */}
                    {/* <TableCell align="right">Total price ($)</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.productsToBuy?.map((historyRow, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row" align="right">
                        {historyRow?.name}
                      </TableCell>
                      <TableCell align="right">
                        {historyRow?.quantity}
                      </TableCell>
                      {/* <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
