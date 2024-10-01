import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Trangchu/Home";
import Khampha from "./pages/Khampha/khampha";
import Watershow from "./pages/Watershow/watershow";
import Cardlist from "./pages/Watershow/cardlist";
import Cardfooter from "./pages/Watershow/cardfooter";
import Cardslider from "./pages/Watershow/cardslider";
import Map from "./pages/Khampha/map";
import Gioithieu from "./pages/Gioithieu/Gioithieu";
import Lichsu from "./pages/Gioithieu/Lichsu";
import Thanhvien from "./pages/Gioithieu/Thanhvien";
import Quangtruong from "./pages/Khampha/Quangtruong";
import Cachep from "./pages/Khampha/Cachep";
import Khiduoidai from "./pages/Khampha/Khiduoidai";
import Thucvat from "./pages/Khampha/Thucvat";
import Banner from "./pages/Trangchu/Banner";
import Lichsucontent from "./pages/Gioithieu/LichsuContent";
import Thanhviencontent from "./pages/Gioithieu/ThanhvienContent";
import Cachepcontent from "./pages/Khampha/CachepContent";
import Khiduoidaicontent from "./pages/Khampha/KhiduoidaiContent";
import Thucvatcontent from "./pages/Khampha/ThucvatContent";
import Baomatcontent from "./pages/Gioithieu/Baomatcontent";
import Tapthe from "./pages/Giave/Tapthe";
import Giave from "./pages/Giave/Giave";
import Congvien from "./pages/Giave/Congvien";
import Taptheduc from "./pages/Giave/Taptheduc";
import Dichvu from "./pages/Giave/Dichvu";
import Others from "./pages/Other/Others";
import Chuy from "./pages/Other/Chuy";
import Thongtincanhan from "./pages/Other/Baomattcn";
import Baomatsubcontent from "./pages/Gioithieu/Baomatsubcontent";
import Thongtinbosung from "./pages/Other/Baomattbs";
import Dvchothue from "./pages/Other/Dvchothue";
import Dvxedien from "./pages/Other/Dvxedien";
import Dichvusub from "./pages/Giave/Dichvusub";
import Watershowcontent from "./pages/Watershow/watershowcontent";
import Giavegt from "./pages/Other/Giave";
import Gioithieucontent from "./pages/Gioithieu/Gioithieucontent";
import Gioithieulist from "./pages/Other/Gioithieulist";



export const router = createBrowserRouter([

  {
    path: "/",
    element: <Banner />,
  },
  {
    path: "/gioithieu",
    element: <Gioithieu />,
  },
  { path: "/gioithieu/gioithieucontent", element: <Gioithieucontent /> },

  { path: "/gioithieu/lichsu", element: <Lichsu /> },
  { path: "/gioithieu/thanhvien", element: <Thanhvien /> },
  { path:"/gioithieu/lichsucontent", element: <Lichsucontent /> },
  { path:"/gioithieu/thanhviencontent", element: <Thanhviencontent /> },
  { path:"/gioithieu/baomatcontent", element: <Baomatcontent /> },
  {path:"/gioithieu/baomatsubcontent", element: <Baomatsubcontent/>
  },
  {path: "/others/gioithieulist", element: <Gioithieulist/>},

  {
    path: "/khampha",
    element: <Khampha />,
  },
  {
    path: "/khampha/map",
    element: <Map />,
  },
  {path: "/khampha/cachepcontent",
    element: <Cachepcontent/>
  },
  {path: "/khampha/khiduoidaicontent",
    element: <Khiduoidaicontent/>
  },
  {path: "/khampha/thucvatcontent",
    element: <Thucvatcontent/>
  },
  {
    path: "/khampha/quangtruong",
    element: <Quangtruong />,
  },
  {
    path: "/khampha/cachep",
    element: <Cachep />,
  },  {
    path: "/khampha/khiduoidai",
    element: <Khiduoidai />,
  },
  {
    path: "/khampha/thucvat",
    element: <Thucvat />,
  },
  {
    path: "/watershow",
    element: <Watershow />,
  },
  {
    path: "/watershow/cardslider",
    element: <Cardslider />,
  },
  {
    path: "/watershow/cardlist",
    element: <Cardlist />,
  },
  {
    path: "/watershow/cardfooter",
    element: <Cardfooter />,
  },
  {
    path: "/watershow/watershowcontent",
    element: <Watershowcontent />,
  },
 {
  path: "/giave",
  element: <Giave />,
 },
 {
  path: "/giave/tapthe",
  element: <Tapthe />,
 },
 {
  path: "/giave/congvien",
  element: <Congvien />,
 },
 {
  path: "/giave/taptheduc",
  element: <Taptheduc />,
 },
 {
  path: "/giave/dichvu",
  element: <Dichvu />,
 },
 {
  path: "/giave/dichvusub",
  element: <Dichvusub />,
 },
 {
  path: "/others",
  element: <Others/>
 },
 {
  path: "/others/chuy",
  element: <Chuy/>
 },
 {
  path: "/others/thongtincanhan",
  element: <Thongtincanhan/>
 },
 {
  path: "/others/thongtinbosung",
  element: <Thongtinbosung/>
 },
 {
  path: "/others/dvchothue",
  element: <Dvchothue/>
 }
 ,
 {
  path: "/others/dvxedien",
  element: <Dvxedien/>
 },
 {
  path: "/others/giave",
  element: <Giavegt />
 }
]);
