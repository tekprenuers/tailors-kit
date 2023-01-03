import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./pages/layouts/Navbar";
import Footer from "./pages/layouts/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";

//Dashboard
import './pages/admin/assets/main.min.css';
import DashHome from "./pages/admin/Home";
import Nav from "./pages/admin/layouts/Nav";
import Aside from "./pages/admin/layouts/Aside";
import BreadCrumb from "./pages/admin/layouts/Crumb";
import DashFooter from "./pages/admin/layouts/Footer";
function App() {
  // 👇️ scroll to top on page change
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route
            index
            element={
              <>
                <Home /> <Footer />
              </>
            }
          />
          <Route
            path="register"
            element={
              <>
                <Register /> <Footer />
              </>
            }
          />
          <Route
            path="login"
            element={
              <>
                <Login /> <Footer />
              </>
            }
          />
          <Route
            path="reset"
            element={
              <>
                <Reset /> <Footer />
              </>
            }
          />
          <Route
            path="*"
            element={
              <>
                <PageNotFound /> <Footer />
              </>
            }
          />
        </Route>
        <Route path="/dashboard" element={<Navbar />}>
          <Route
            index
            element={
              <>
                <Nav />
                <Aside />
                <BreadCrumb pageName="Dashboard" />
                <DashHome />
                <DashFooter />
              </>
            }
          />
          <Route path="home" element={
          <>
            <Nav />
            <Aside />
            <BreadCrumb />
            <DashHome />
            <DashFooter />
          </>
        } />
          {/* <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="reset" element={<Reset />} />
            <Route path="/dashboard/" element={<DashHome />} />
            <Route path="/dashboard/home" element={<DashHome />} /> */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
