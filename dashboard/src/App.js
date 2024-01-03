import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Orders from "./Pages/Orders";
import Products from "./Pages/Products";
import DetailProduct from "./Pages/DetailProduct";
import AddNewProduct from "./Pages/AddNewProduct";
import AddSubProduct from "./Pages/AddSubProduct";
import Reports from "./Pages/Reports";
import AddNewCategory from "./Pages/AddNewCategory";
import Category from "./Pages/Category";
import Users from "./Pages/Users";
import AddCoupons from "./Pages/AddCoupons";
import AddUser from "./Pages/AddUser";
import Coupons from "./Pages/Coupons";
import Login from "./Pages/Login";
import Contact from "./Pages/Contact";
import { Home } from "./layout/Home";
import { Layout } from "./layout";
import { AuthProvider } from "./hooks/useAuth";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ProtectedRoute } from "./layout/ProjectedRoute";
const outerTheme = createTheme({
  palette: {
    primary: {
      main: "#E4780E",
    },
    secondary: {
      main: "#000",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={outerTheme}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="contact" exact element={<Contact />} />
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Reports />} />
              <Route path="orders" exact element={<Orders />} />

              <Route
                path="users"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="adduser"
                exact
                element={
                  <ProtectedRoute>
                    <AddUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="adduser/:item"
                exact
                element={
                  <ProtectedRoute>
                    <AddUser />
                  </ProtectedRoute>
                }
              />

              <Route
                path="category"
                exact
                element={
                  <ProtectedRoute>
                    <Category />
                  </ProtectedRoute>
                }
              />
              <Route
                path="addcategory"
                exact
                element={
                  <ProtectedRoute>
                    <AddNewCategory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="addcategory/:categoryId"
                element={
                  <ProtectedRoute>
                    <AddNewCategory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="product/:productId"
                element={
                  <ProtectedRoute>
                    <DetailProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="addproducts"
                exact
                element={
                  <ProtectedRoute>
                    <AddNewProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="addproducts/:productId"
                exact
                element={
                  <ProtectedRoute>
                    <AddNewProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="subproducts/:product"
                element={
                  <ProtectedRoute>
                    <AddSubProduct />
                  </ProtectedRoute>
                }
              />

              <Route
                path="coupons"
                exact
                element={
                  <ProtectedRoute>
                    <Coupons />
                  </ProtectedRoute>
                }
              />
              <Route
                path="addcoupons"
                exact
                element={
                  <ProtectedRoute>
                    <AddCoupons />
                  </ProtectedRoute>
                }
              />
              <Route
                path="addcoupons/:item"
                exact
                element={
                  <ProtectedRoute>
                    <AddCoupons />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route element={<Home />}>
              <Route path="/" exact element={<Reports />} />
              <Route path="/login" exact element={<Login />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
