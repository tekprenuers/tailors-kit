import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./pages/layouts/Navbar";
import Footer from "./pages/layouts/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import PageNotFound from "./pages/PageNotFound";
import Privacy from "./pages/Privacy";

//Dashboard
// import './pages/admin/assets/main.min.css';
import DashHome from "./pages/admin/Home";
import Nav from "./pages/admin/layouts/Nav";
import Aside from "./pages/admin/layouts/Aside";
import BreadCrumb from "./pages/admin/layouts/Crumb";
import DashFooter from "./pages/admin/layouts/Footer";

//customers
import AddCustomer from "./pages/admin/customers/AddCustomer";
import UpdateCustomer from "./pages/admin/customers/UpdateCustomer";
import ViewCustomers from "./pages/admin/customers/ViewCustomers";
import UpdateProfile from "./pages/admin/settings/updateProfile";
import SingleCustomer from "./pages/admin/customers/SingleCustomer";

//measurement
import MeasurementCustomerSearch from "./pages/admin/measurements/CustomerSearch";
import AddMeasurement from "./pages/admin/measurements/AddMeasurement";

//requests
import RequestCustomerSearch from "./pages/admin/requests/CustomerSearch";
import UpdateRequest from "./pages/admin/requests/UpdateRequest";
import ViewRequestCustomerSearch from "./pages/admin/requests/ViewCustomerSearch";
import AddRequest from "./pages/admin/requests/AddRequest";
import ViewRequests from "./pages/admin/requests/ViewRequests";

//settings
import Settings from "./pages/admin/settings/Settings";
import ConfigureMeasurement from "./pages/admin/settings/ConfigureMeasurement";
import License from "./pages/admin/License";

//help desk
import HelpDesk from "./pages/admin/helpDesk/helpDesk";
import Support from "./pages/admin/helpDesk/support";
import KnowledgePanel from "./pages/admin/helpDesk/knowledgePanel";

function App() {
  // ??????? scroll to top on page change
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
            path="contact"
            element={
              <>
                <Contact /> <Footer />
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
            path="privacy"
            element={
              <>
                <Privacy /> <Footer />
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
        <Route path={import.meta.env.VITE_DASHBOARD_URL}>
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
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/home'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="Dashboard" />
              <DashHome />
              <DashFooter />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/add-customer'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="Add Customer" showButton="true" buttonProp={{ buttonClass: "button is-app-primary", iconClass: "mdi mdi-account-multiple", buttonText: "View Customers", buttonLink: import.meta.env.VITE_DASHBOARD_URL + '/view-customers' }} />
              <AddCustomer />
              <DashFooter />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/update-customer/:cusId'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="View Data" showButton="false" />
              <UpdateCustomer />
              <DashFooter />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/view-customers'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="View Customers" showButton="true" buttonProp={{ buttonClass: "button is-app-primary", iconClass: "mdi mdi-plus", buttonText: "Add Customer", buttonLink: import.meta.env.VITE_DASHBOARD_URL + '/add-customer' }} />
              <ViewCustomers />
              <DashFooter />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/customers/:cusId'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="View Customer" showButton="false" />
              <SingleCustomer />
              <DashFooter />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/add-measurement'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="Search for a customer" showButton="false" />
              <MeasurementCustomerSearch />
              <DashFooter />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/add-measurement/:cusId'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="Add measurement" showButton="false" />
              <AddMeasurement />
              <DashFooter />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/new-order'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="Search for a customer" showButton="false" buttonProp={{ buttonClass: "button is-primary", iconClass: "mdi mdi-eye", buttonText: "View requests", buttonLink: import.meta.env.VITE_DASHBOARD_URL + '/view-orders/' }} />
              <RequestCustomerSearch />
              <DashFooter />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/new-order/:cusId'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="New Request" showButton="false" />
              <AddRequest />
              <DashFooter />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/view-orders'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="Search for a customer" showButton="false" buttonProp={{ buttonClass: "button is-primary", iconClass: "mdi mdi-plus", buttonText: "New request", buttonLink: import.meta.env.VITE_DASHBOARD_URL + '/new-order/' }} />
              <ViewRequestCustomerSearch />
              <DashFooter />
            </>
          } />

          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/orders/:cusId'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="View Order" showButton="false" />
              <ViewRequests />
              <DashFooter />
            </>
          } />

          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/update-order/:reqId'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="Update this order" showButton="false" />
              <UpdateRequest />
              <DashFooter />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/license'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="My License" showButton="false" />
              <License />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/settings'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="Account Settings" showButton="false" />
              <Settings />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/settings/update-profile'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="Update Profile" showButton="false" />
              <UpdateProfile />
              <DashFooter />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/settings/configure-measurements'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="Configure measurements" showButton="false" />
              <ConfigureMeasurement />
              <DashFooter />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/help-desk'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="Help Desk" showButton="false" />
              <HelpDesk />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/help-desk/knowledge-panel'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="Help Desk - Knowledge panel" showButton="false" />
              <KnowledgePanel />
            </>
          } />
          <Route path={import.meta.env.VITE_DASHBOARD_URL + '/help-desk/support'} element={
            <>
              <Nav />
              <Aside />
              <BreadCrumb pageName="Help Desk - Support" showButton="false" />
              <Support />
            </>
          } />
          {/* <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="reset" element={<Reset />} />
            <Route path="/dashboard/" element={<DashHome />} />
            <Route path="/dashboard/home" element={<DashHome />} /> */}
          <Route path="*" element={
            <>
              <Navbar />
              <PageNotFound />
              <Footer />
            </>
} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
