import React from "react";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as IoIcons from "react-icons/io";
import * as FaIcons from "react-icons/fa";
import * as VscIcons from "react-icons/vsc";
import { Abc, Category } from "@mui/icons-material";


import Notify from "./notify";
export const SideBarData = [
  
  {
    title: "Reports",
    path: "/",
    icon: <VscIcons.VscGraph color="#E4780E" size={28} />,
    cname: "nav-text",
  },
  {
    title: "Products",
    path: "/products",
    icon: <FaIcons.FaHamburger color="#E4780E" size={28} />,
    cname: "nav-text",
  },
  {
    title: "Add Products",
    path: "/addproducts",
    icon: <AiIcons.AiOutlineAppstoreAdd color="#E4780E" size={28} />,
    cname: "nav-text",
  },
  {
    title: "Categories",
    path: "/category",
    icon: <Category sx={{ fontSize: 30, color: "#E4780E" }} />,
    cname: "nav-text",
  },
  {
    title: "Add Category",
    path: "/addcategory",
    icon: <BiIcons.BiCategoryAlt color="#E4780E" size={28} />,
    cname: "nav-text",
  },
  {
    title: "Coupons",
    path: "/coupons",
    icon: <Abc sx={{ color: "#E4780E", fontSize: 30 }} />,
    cname: "nav-text",
  },
  {
    title: "User",
    path: "/users",
    icon: <FaIcons.FaUsers color="#E4780E" size={28} />,
    cname: "nav-text",
  },
  {
    title: "Create Users",
    path: "/adduser",
    icon: <FaIcons.FaUserEdit color="#E4780E" size={28} />,
    cname: "nav-text",
  },
 
  {
    title: "Orders",
    path: "/orders",
    icon: <IoIcons.IoMdCart color="#E4780E" size={28} />,
    cname: "nav-text",
  },
 
 
];



