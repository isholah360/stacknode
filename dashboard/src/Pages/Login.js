import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { fireDB, auth } from "../config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Keventers Cafe &amp; Wraps
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    try {
      signInWithEmailAndPassword(auth, email, password)
        .then(async (res) => {
          console.log(res, res.user.uid);
          const docRef = doc(fireDB, "users", res.user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            login(docSnap.data());
            navigate("/dashboard/orders");
          } else {
            alert("No such document!");
          }
        })
        .catch((err) => {
          console.log(err);
          alert(err.message);
        });

      // const querySnapshot = await getDocs(
      //   query(collection(fireDB, "users"), where("email", "==", email))
      // );

      // if (!querySnapshot.empty) {
      //   const userDoc = querySnapshot.docs[0];
      //   const user = { id: userDoc.id, ...userDoc.data() };

      //   if (
      //     email === "keventersapp@gmail.com" &&
      //     password === "keventers@123"
      //   ) {
      //     user.type = "owner";
      //     login(user);
      //     navigate("/dashboard/orders");
      //   } else if (user.type === "manager" && user.password === password) {
      //     login(user);
      //     navigate("/dashboard/orders");
      //   } else {
      //     alert("You provided wrong credentials");
      //   }
      // } else {
      //   alert("User not found");
      // }
    } catch (error) {
      console.error("Error fetching user:", error);
      alert("An error occurred while fetching user data");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: "secondary.main",
              height: 100,
              width: "auto",
              objectfit: "contain",
            }}
            src={"/logo.jpeg"}
            variant="square"
          ></Avatar>
          <Typography component="h1" variant="h5">
            Keventers Cafe &amp; Wraps
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#E4780E" }}
            >
              Access Dashboard
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
