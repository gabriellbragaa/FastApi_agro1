import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    UserRound,
    Building2,
    Beef,
    UserCheck,
    BriefcaseBusiness,
    Handshake,
    Package,
    BarChart3,
} from "lucide-react";

const menu = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Produtores",
        path: "/produtores",
        icon: Users,
    },
    {
        name: "Agricultores",
        path: "/agricultores",
        icon: UserRound,
    },
    {
        name: "Pecuaristas",
        path: "/pecuaristas",
        icon: Beef,
    },
    {
        name: "Empresas",
        path: "/empresas",
        icon: Building2,
    },
    {
        name: "Clientes",
        path: "/clientes",
        icon: UserCheck,
    },
    {
        name: "Funcionários",
        path: "/funcionarios",
        icon: BriefcaseBusiness,
    },
    {
        name: "Recursos",
        path: "/recursos",
        icon: Package,
    },
    {
        name: "Parcerias",
        path: "/parcerias",
        icon: Handshake,
    },
    {
        name: "Relatórios",
        path: "/relatorios",
        icon: BarChart3,
    },
];

function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="logo-area">

                <div className="logo-icon">
                    A
                </div>

                <div>
                    <h1>AgroLinker</h1>
                    <span>Gestão Agro</span>
                </div>

            </div>

            <nav>

                <p className="menu-title">
                    MENU PRINCIPAL
                </p>

                {menu.map((item) => {

                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `menu-item ${isActive ? "active" : ""}`
                            }
                        >

                            <Icon size={20} />

                            <span>
                                {item.name}
                            </span>

                        </NavLink>
                    );

                })}

            </nav>

            <div className="sidebar-footer">

                <strong>AgroLinker</strong>

                <span>
                    Plataforma de gestão agrícola
                </span>

            </div>

        </aside>
    );
}

export default Sidebar;