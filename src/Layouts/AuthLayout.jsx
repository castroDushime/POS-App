import Bg from '../assets/inv.png';
import {Outlet} from "react-router-dom";

function AuthLayout() {
    return (
        <div className="min-vh-100" style={{
            backgroundImage: `url(${Bg})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top left',
        }}>
            <Outlet />
        </div>
    );
}

export default AuthLayout;