import { ReactNode } from "react";
import Sidebar from "../components/sidebar";
import "./Layout.css";


interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="layout-container">
            <Sidebar />

            <div className="content">
                {children}
            </div>
            
        </div>
    );
};

export default Layout;
