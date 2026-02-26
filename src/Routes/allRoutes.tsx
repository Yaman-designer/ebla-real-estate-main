import { Navigate } from "react-router-dom";

// Authentication
import Fourzerofour from "pages/AuthenticationInner/Errors/404Error";
import Fivezerozero from "pages/AuthenticationInner/Errors/500Error";
import Fivezerothree from "pages/AuthenticationInner/Errors/503Error";
import OfflinePage from "pages/AuthenticationInner/Errors/Offline";

// Real Estate
import ListingGrid from "pages/RealEstate/ListingGrid/ListingGrid";
import ListingMap from "pages/RealEstate/ListingMap/ListingMap";
import PropertyOverview from "pages/RealEstate/PropertyOverview/PropertyOverview";
import Requests from "pages/RealEstate/Requests/Requests";
import Calls from "pages/RealEstate/Calls/Calls";
import Contracts from "pages/RealEstate/Contracts/Contracts";
import Contacts from "pages/RealEstate/Contacts/Contacts";
import PortalsProperties from "pages/RealEstate/PortalsProperties/PortalsProperties";
import CEauction from "pages/RealEstate/CEauction/CEauction";
import CReference from "pages/RealEstate/CReference/CReference";
import CPipeline from "pages/RealEstate/CPipeline/CPipeline";
import Tasks from "pages/RealEstate/Tasks/Tasks";
import Meetings from "pages/RealEstate/Meetings/Meetings";
import Teams from "pages/RealEstate/Teams/Teams";
import Users from "pages/RealEstate/Users/Users";
import Cases from "pages/RealEstate/Cases/Cases";
import Calendar from "pages/Calendar";
import Documents from "pages/RealEstate/Documents/Documents";


// Authentication
import Login from "pages/Authentication/Login";
import Logout from "pages/Authentication/Logout";
import Register from "pages/Authentication/Register";
import ForgotPassword from "pages/Authentication/ForgotPassword";
import UserProfile from "pages/Authentication/user-profile";
import UniversalListDemo from "pages/UniversalListDemo";
import Email from "pages/Email";
import RealEstate from "../pages/Dashboard/RealEstate";
import Ecommerce from "../pages/Dashboard/Ecommerce";

const authProtectedRoutes = [
    // Dashboard
    { path: "/dashboard", component: <RealEstate /> },
    { path: "/dashboardOld", component: <Ecommerce /> },
    { path: "/email", component: <Email /> },
    { path: "/universal-list-demo", component: <UniversalListDemo /> },
    { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
    { path: "*", component: <Navigate to="/dashboard" /> },

    { path: "/properties", name: "ListingGrid", component: <ListingGrid /> },
    { path: "/properties-map", name: "ListingMap", component: <ListingMap /> },
    { path: "/property-overview/:id", name: "PropertyOverview", component: <PropertyOverview /> },
    { path: "/real-estate-request", name: "Requests", component: <Requests /> },
    { path: "/call", name: "Calls", component: <Calls /> },
    { path: "/ebla-contract", name: "Contracts", component: <Contracts /> },
    { path: "/contact", name: "Contacts", component: <Contacts /> },
    { path: "/portals-properties", name: "FSBO", component: <PortalsProperties /> },
    { path: "/ceauction", name: "CEauction", component: <CEauction /> },
    { path: "/creference", name: "CReference", component: <CReference /> },
    { path: "/cpipeline", name: "CPipeline", component: <CPipeline /> },
    { path: "/task", name: "Tasks", component: <Tasks /> },
    { path: "/meeting", name: "Meetings", component: <Meetings /> },
    { path: "/team", name: "Teams", component: <Teams /> },
    { path: "/user", name: "Users", component: <Users /> },
    { path: "/case", name: "Cases", component: <Cases /> },
    { path: "/calendar", name: "Calendar", component: <Calendar /> },
    { path: "/document", name: "Documents", component: <Documents /> },

    //user prpfile
    { path: "/user-profile", name: "UserProfile", component: <UserProfile /> },
    // this route should be at the end of all other routes
    // eslint-disable-next-line react/display-name
    { path: "/", exact: true, name: "Navigate", component: <Navigate to="/dashboard" /> },

];

const publicRoutes = [
    // Authentication
    { path: "/login", name: "Login", component: <Login /> },
    { path: "/logout", name: "Logout", component: <Logout /> },
    { path: "/register", name: "Register", component: <Register /> },
    { path: "/forgot-password", name: "ForgotPassword", component: <ForgotPassword /> },


    // Error
    // Error 404
    { path: "/auth-404", name: "Fourzerofour", component: <Fourzerofour /> },

    // Error 500
    { path: "/auth-500", name: "Fivezerozero", component: <Fivezerozero /> },

    // Error 503
    { path: "/auth-503", name: "Fivezerothree", component: <Fivezerothree /> },

    // Offline Page
    { path: "/auth-offline", name: "OfflinePage", component: <OfflinePage /> },

];

export { authProtectedRoutes, publicRoutes };
