// import
import Dashboard from "./views/Dashboard/Dashboard";
import Tables from "./views/Dashboard/Tables";
import Billing from "./views/Dashboard/Billing";
import Profile from "./views/Dashboard/Profile";
import MeddyHome from "./views/Dashboard/MeddyHome";
import MeddyHealth from "./views/Dashboard/MeddyHealth";
import MeddyReminders from "./views/Dashboard/MeddyReminders";
import MeddyVoiceMode from "./views/Dashboard/MeddyVoiceMode";
import MeddyChat from "./views/Dashboard/MeddyChat";

import SignIn from "./views/Auth/SignIn";
import SignUp from "./views/Auth/SignUp";

import {
  HomeIcon,
  SpotifyLogo,
  AtlassianLogo,
  JiraLogo,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
} from "./components/Icons/Icons";
// Meddy Icons
import {
  IoChatboxEllipses,
  IoHome,
  IoTimeSharp,
  IoCloudUpload,
} from "react-icons/io5";
import { RiHealthBookFill, RiUserVoiceFill } from "react-icons/ri";
import Chat from "./components/Chat";
import Health from "./components/Health.jsx";
import Uploads from "./components/Uploads.jsx";

var dashRoutes = [
  // {
  /*
        path: is appended after /dashboard automatically, so /home === /dashboard/home
        name: is the actual UI button's TEXT on the left sidebar.
        icon: is self explanatory. add a color='inherit' for react-icons or chakraicons
        ⭐ component: this is where your main component lies! 
        layout: just put /dashboard, don't worry about this at all
      */
  // }
  {
    path: "/home",
    name: "Home", // Changes the actual name of Meddy sidebar
    icon: <IoHome color="inherit" />,
    component: Dashboard, // Updated to MeddyHome
    // william pathing
    layout: "/dashboard",
  },
  {
    path: "/chat",
    name: "Chat",
    icon: <IoChatboxEllipses color="inherit" />,
    // component: MeddyChat, // Updated to MeddyChat
    component: Chat,
    // component: ChatFork,
    layout: "/dashboard",
  },
  {
    path: "/voicemode",
    name: "Voice Mode",
    icon: <RiUserVoiceFill color="inherit" />,
    component: MeddyVoiceMode, // Updated to MeddyVoiceMode
    layout: "/dashboard",
  },
  {
    path: "/health",
    name: "My Health",
    icon: <RiHealthBookFill color="inherit" />,
    // component: MeddyHealth, // Updated to MeddyHealth
    component: Health,
    layout: "/dashboard",
  },
  {
    path: "/reminders",
    name: "Reminders",
    icon: <IoTimeSharp color="inherit" />,
    component: Billing, // Updated to MeddyReminders
    layout: "/dashboard",
  },
  {
    path: "/uploads",
    name: "Uploads",
    icon: <IoCloudUpload color="inherit" />,
    component: Uploads, // Updated to MeddyReminders
    layout: "/dashboard",
  },
  // ARCHIVE IGNORE BELOW
  // {
  //   path: "/dashboard",
  //   name: "Dashboard", // Changes the actual name of Meddy sidebar
  //   icon: <JiraLogo color="inherit" />,
  //   component: Dashboard,
  //   layout: "/admin",
  // },
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   icon: <SpotifyLogo color="inherit" />,
  //   component: Tables,
  //   layout: "/admin",
  // },
  // {
  //   path: "/billing",
  //   name: "Billing",
  //   icon: <AtlassianLogo color="inherit" />,
  //   component: Billing,
  //   layout: "/admin",
  // },
  // {
  //   name: "ACCOUNT PAGES",
  //   category: "account",
  //   state: "pageCollapse",
  //   views: [
  //     {
  //       path: "/profile",
  //       name: "Profile",
  //       icon: <PersonIcon color="inherit" />,
  //       secondaryNavbar: true,
  //       component: Profile,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/signin",
  //       name: "Sign In",
  //       icon: <DocumentIcon color="inherit" />,
  //       component: SignIn,
  //       layout: "/auth",
  //     },
  //     {
  //       path: "/signup",
  //       name: "Sign Up",
  //       icon: <RocketIcon color="inherit" />,
  //       secondaryNavbar: true,
  //       component: SignUp,
  //       layout: "/auth",
  //     },
  //   ],
  // },
];
export default dashRoutes;
