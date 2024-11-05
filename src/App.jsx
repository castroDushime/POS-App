    import {Route, Routes,} from "react-router-dom";
import {lazy} from "react";
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const MasterLayout = lazy(() => import("./Layouts/MasterLayout.jsx"));
const AuthLayout = lazy(() => import("./Layouts/AuthLayout.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Roles = lazy(() => import("./pages/Roles.jsx"));
const Suppliers = lazy(() => import("./pages/Suppliers.jsx"));
const Users = lazy(() => import("./pages/Users.jsx"));
const Warehouse = lazy(() => import("./pages/WareHouse.jsx"));
const Customers = lazy(() => import("./pages/Customers.jsx"));
const Products = lazy(() => import("./pages/Products.jsx"));
const ProductCategory = lazy(() => import("./pages/products/ProductCategory.jsx"));
const Sales = lazy(() => import("./pages/sales/Sales.jsx"));
const CreateSale = lazy(() => import("./pages/sales/Create.jsx"));
const Purchase =lazy(()=>import("./pages/purchase/Purchase.jsx"));
const CreatePurchase =lazy(()=>import("./pages/purchase/Create.jsx"));
const POS=lazy(()=>import('./pages/POS.jsx'));
const Brands=lazy(()=>import('./pages/products/Brands.jsx'));
const Units=lazy(()=>import('./pages/products/Units.jsx'));
const Settings=lazy(()=>import('./pages/Settings.jsx'));
const Reports=lazy(()=>import('./pages/Reports.jsx'));
const ForgotPassword=lazy(()=>import('./pages/auth/ForgotPassword.jsx'));
const ResetPassword=lazy(()=>import('./pages/auth/ResetPassword.jsx'));
function App() {
    return (
        <Routes>
            <Route path="/" element={<AuthLayout/>}>
                <Route path="" element={<Login/>}/>
                <Route path="forgot-password" element={<ForgotPassword/>}/>
                <Route path="reset-password/:id" element={<ResetPassword/>}/>

            </Route>
            <Route path="/" element={<MasterLayout/>}>
                <Route path="dashboard" element={<Dashboard/>}/>
                <Route path="profile" element={<Profile/>}/>
                <Route path="roles" element={<Roles/>}/>
                <Route path="suppliers" element={<Suppliers/>}/>
                <Route path="users" element={<Users/>}/>
                <Route path="warehouse" element={<Warehouse/>}/>
                <Route path="customers" element={<Customers/>}/>
                <Route path="products" element={<Products/>}/>
                <Route path="product-category" element={<ProductCategory/>}/>
                <Route path="sales" element={<Sales/>}/>
                <Route path="pos/history" element={<Sales/>}/>
                <Route path="create-sale" element={<CreateSale/>}/>
                <Route path="create-sale/:id" element={<CreateSale/>}/>
                <Route path="purchase" element={<Purchase/>}/>
                <Route path="create-purchase" element={<CreatePurchase/>}/>
                <Route path="create-purchase/:id" element={<CreatePurchase/>}/>
                <Route path="brands" element={<Brands/>}/>
                <Route path="units" element={<Units/>}/>
                <Route path="settings" element={<Settings/>}/>
                <Route path="reports" element={<Reports/>}/>
            </Route>
            <Route path="/pos" element={<POS/>}/>
            <Route path="/pos/:id" element={<POS/>}/>

        </Routes>
    )
}

export default App;