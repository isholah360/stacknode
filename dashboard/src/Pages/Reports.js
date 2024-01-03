import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Container, Paper, Box, Typography, Grid } from "@mui/material";
import Chart from "react-apexcharts";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { fireDB } from "../config";
import {
  People,
  Category,
  ProductionQuantityLimits,
  Abc,
} from "@mui/icons-material";
import * as IoIcons from "react-icons/io";
import * as FaIcons from "react-icons/fa";
export default function Reports() {
  const [orders, setOrders] = useState();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const countValue = useMemo(() => {
    var holder = {};
    if (orders?.length) {
      orders?.forEach((t) => {
        t?.productsToBuy?.forEach((d) => {
          if (holder.hasOwnProperty(d.name)) {
            holder[d.name] = holder[d.name] + d.quantity;
          } else {
            holder[d.name] = d.quantity;
          }
        });
      });
      var obj2 = [];
      for (var prop in holder) {
        obj2.push({ name: prop, value: holder[prop] });
      }

      return obj2;
    } else {
      return [];
    }
  }, [orders]);
  const countCoupon = useMemo(() => {
    var holder = 0;
    let coupon = 0;
    if (coupons?.length) {
      coupons?.forEach((t) => {
        holder += parseInt(t?.users?.length ? t?.users?.length : 0);
        coupon += parseInt(t?.status ? 1 : 1);
      });

      return { user: holder, coupon };
    } else {
      return [];
    }
  }, [coupons]);

  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    const q = query(
      collection(fireDB, "orders"),
      orderBy("pickUptimeandDate", "desc")
    );

    onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        cities.push({ ...doc.data(), id: doc.id });
      });
      setOrders(cities);
    });
    let user = [];
    const userQ = collection(fireDB, "users");
    const usersSnapshot = await getDocs(userQ);
    usersSnapshot.forEach((doc) => {
      user.push({ ...doc.data(), id: doc.id });
    });
    setUsers(user);
    let product = [];
    const productQ = collection(fireDB, "products");
    const productsSnapshot = await getDocs(productQ);
    productsSnapshot.forEach((doc) => {
      product.push({ ...doc.data(), id: doc.id });
    });
    setProducts(product);
    let coupon = [];
    const couponQ = collection(fireDB, "coupons");
    const couponsSnapshot = await getDocs(couponQ);
    couponsSnapshot.forEach((doc) => {
      coupon.push({ ...doc.data(), id: doc.id });
    });
    setCoupons(coupon);
  }

  return (
    <Container xs={{ my: 5 }}>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3} item>
          <Paper
            sx={{ display: "flex", justifyContent: "space-between", p: 4 }}
            elevation={5}
          >
            <Typography sx={{ fontSize: 80, fontWeight: "bolder" }}>
              {users && users?.length}
            </Typography>
            <Box sx={{ textAlign: "right" }}>
              <Box sx={{ mb: 3 }}>
                <FaIcons.FaUsers color="#E4780E" size={32} />
              </Box>
              <Typography variant="h6" color="#E4780E">
                Users
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid xs={12} sm={6} md={3} item>
          <Paper
            elevation={5}
            sx={{ display: "flex", justifyContent: "space-between", p: 4 }}
          >
            <Typography sx={{ fontSize: 80, fontWeight: "bolder" }}>
              {" "}
              {products && products?.length}
            </Typography>
            <Box sx={{ textAlign: "right" }}>
              <Box sx={{ mb: 3 }}>
                <FaIcons.FaHamburger color="#E4780E" size={35} />
              </Box>
              <Typography variant="h6" color="#E4780E">
                {" "}
                Products
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid xs={12} sm={6} md={3} item>
          <Paper
            elevation={5}
            sx={{ display: "flex", justifyContent: "space-between", p: 4 }}
          >
            <Typography sx={{ fontSize: 80, fontWeight: "bolder" }}>
              {" "}
              {orders && orders?.length}
            </Typography>
            <Box sx={{ textAlign: "right" }}>
              <Box sx={{ mb: 3 }}>
                <IoIcons.IoMdCart color="#E4780E" size={35} />
              </Box>
              <Typography variant="h6" color="#E4780E">
                Orders
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid xs={12} sm={6} md={3} item>
          <Paper
            elevation={5}
            sx={{ display: "flex", justifyContent: "space-between", p: 4 }}
          >
            <Typography sx={{ fontSize: 80, fontWeight: "bolder" }}>
              {" "}
              {countCoupon && countCoupon?.user}
            </Typography>
            <Box sx={{ textAlign: "right" }}>
              <Box sx={{ mb: 3 }}>
                <Abc sx={{ fontSize: 40, color: "#E4780E" }} />
              </Box>
              <Typography variant="h6" color="#E4780E">
                {countCoupon && countCoupon?.coupon} Coupon
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {countValue?.length && <Report countValue={countValue} />}
    </Container>
  );
}

const Report = ({ countValue }) => {
  const [state, setState] = React.useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: countValue?.map((item) => item.name),
      },
      colors: ["#E4780E", "#E91E63", "#9C27B0"],
      dataLabels: {
        style: {
          colors: ["#fff", "#fff", "#fff"],
        },
      },
      fill: {
        colors: ["#E4780E", "#E91E63", "#9C27B0"],
      },
      markers: {
        colors: ["#E4780E", "#E91E63", "#9C27B0"],
      },
    },
    series: [
      {
        name: "Pickup Product",
        data: countValue?.map((item) => item.value),
      },
    ],
  });
  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="1000"
          />
        </div>
      </div>
    </div>
  );
};
