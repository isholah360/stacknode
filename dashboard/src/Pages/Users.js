import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Box,
  Typography,
  IconButton,
  Pagination,
  ButtonGroup,
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
  limitToLast,
  endBefore,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { fireDB } from "../config";
import { Edit, Delete } from "@mui/icons-material";
export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const pageSize = 10; // Change this to your desired page size

  const navigate = useNavigate();

  const fetchUsers = async (page) => {
    try {
      let querySnapshot;

      if (page === 1) {
        // Fetch the first page
        querySnapshot = await getDocs(
          query(collection(fireDB, "users"), orderBy("email"), limit(pageSize))
        );
      } else {
        // Fetch next or previous pages based on page number
        const lastEmail = users[users.length - 1]?.email;
        if (lastEmail && page > 1) {
          querySnapshot = await getDocs(
            query(
              collection(fireDB, "users"),
              orderBy("email"),
              startAfter(lastEmail),
              limit(pageSize)
            )
          );
        } else {
          // If page is 1 or there's no last email, fetch the first page
          querySnapshot = await getDocs(
            query(
              collection(fireDB, "users"),
              orderBy("email"),
              limit(pageSize)
            )
          );
        }
      }

      const newUsers = [];
      querySnapshot.forEach((doc) => {
        newUsers.push({ id: doc.id, ...doc.data() });
      });

      setUsers(newUsers);
      setPage(page);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const fetchInitialUsers = async () => {
      try {
        const userCountQuery = query(collection(fireDB, "users"));
        const userCountSnapshot = await getDocs(userCountQuery);
        const totalUsersCount = userCountSnapshot.size;
        setTotalUsers(totalUsersCount);

        // Fetch the initial page of users
        fetchUsers(1);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialUsers();
  }, []);
  return (
    <Container>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  {row.firstName} {row.lastName}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell component="th" scope="row">
                  {row?.location}
                </TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        let user = JSON.stringify(row);
                        navigate(`/dashboard/adduser/${user}`);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton>
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalUsers > pageSize && (
          <Pagination
            count={Math.ceil(totalUsers / pageSize)}
            page={page}
            onChange={(event, value) => fetchUsers(value)}
          />
        )}
      </TableContainer>
    </Container>
  );
}
