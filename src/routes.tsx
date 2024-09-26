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

export const router = createBrowserRouter([

  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/gioithieu",
    element: <Gioithieu />,
  },
  { path: "/gioithieu/lichsu", element: <Lichsu /> },
  { path: "/gioithieu/thanhvien", element: <Thanhvien /> },

  {
    path: "/khampha",
    element: <Khampha />,
  },
  {
    path: "/khampha/map",
    element: <Map />,
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
 
]);
