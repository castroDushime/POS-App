import {Route, Routes,} from "react-router-dom";
import {lazy} from "react";
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const MasterLayout = lazy(() => import("./Layouts/MasterLayout.jsx"));
const AuthLayout = lazy(() => import("./Layouts/AuthLayout.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Roles = lazy(() => import("./pages/Roles.jsx"));
const Suppliers = lazy(() => import("./pages/Suppliers.jsx"));
const Users = lazy(() => import("./pages/Users.jsx"));
function App() {
    return (
        <Routes>
            <Route path="" element={<AuthLayout/>}>
                <Route path="/" element={<Login/>}/>
            </Route>
            <Route path="/admin/" element={<MasterLayout/>}>
                <Route path="dashboard" element={<Dashboard/>}/>
                <Route path="profile" element={<Profile/>}/>
                <Route path="roles" element={<Roles/>}/>
                <Route path="suppliers" element={<Suppliers/>}/>
                <Route path="users" element={<Users/>}/>
            </Route>

        </Routes>
    )
}

export default App;