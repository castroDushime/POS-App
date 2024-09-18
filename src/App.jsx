import {Route, Routes,} from "react-router-dom";
import {lazy} from "react";
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const MasterLayout = lazy(() => import("./Layouts/MasterLayout.jsx"));
function App() {
    return (
        <Routes>
            <Route path="" element={<MasterLayout/>}>
                <Route path="/" element={<Dashboard/>}/>
            </Route>

        </Routes>
    )
}

export default App;