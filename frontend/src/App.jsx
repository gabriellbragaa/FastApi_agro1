import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Sprout,
  Beef,
  Building2,
  UserRound,
  BriefcaseBusiness,
  Package,
  Handshake,
  BarChart3,
  Bell,
  Search,
  Leaf
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Produtores from "./pages/Produtores";
import Agricultores from "./pages/Agricultores";
import Pecuaristas from "./pages/Pecuaristas";
import Empresas from "./pages/Empresas";
import Clientes from "./pages/Clientes";
import Funcionarios from "./pages/Funcionarios";
import Recursos from "./pages/Recursos";


function App() {

  const menuPrincipal = [
    {
      nome: "Dashboard",
      caminho: "/",
      icone: LayoutDashboard
    }
  ];

  const menuGestao = [
    {
      nome: "Produtores",
      caminho: "/produtores",
      icone: Users
    },
    {
      nome: "Agricultores",
      caminho: "/agricultores",
      icone: Sprout
    },
    {
      nome: "Pecuaristas",
      caminho: "/pecuaristas",
      icone: Beef
    },
    {
      nome: "Empresas",
      caminho: "/empresas",
      icone: Building2
    },
    {
      nome: "Clientes",
      caminho: "/clientes",
      icone: UserRound
    },
    {
      nome: "Funcionários",
      caminho: "/funcionarios",
      icone: BriefcaseBusiness
    },
    {
      nome: "Recursos",
      caminho: "/recursos",
      icone: Package
    },
    {
      nome: "Parcerias",
      caminho: "/parcerias",
      icone: Handshake
    }
  ];


  return (

    <BrowserRouter>

      <div className="app">

        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        <aside className="sidebar">

          <div className="logo">

            <div className="logo-icon">
              <Leaf size={22} />
            </div>

            <div>
              <h1>AgroLinker</h1>
              <span>Gestão Agro</span>
            </div>

          </div>


          {/* MENU PRINCIPAL */}

          <div className="menu-section">

            <span className="menu-title">
              PRINCIPAL
            </span>

            {menuPrincipal.map((item) => {

              const Icon = item.icone;

              return (

                <NavLink
                  key={item.caminho}
                  to={item.caminho}
                  className={({ isActive }) =>
                    isActive
                      ? "menu-item active"
                      : "menu-item"
                  }
                >

                  <Icon size={19} />

                  <span>{item.nome}</span>

                </NavLink>

              );

            })}

          </div>


          {/* MENU GESTÃO */}

          <div className="menu-section">

            <span className="menu-title">
              GESTÃO
            </span>

            {menuGestao.map((item) => {

              const Icon = item.icone;

              return (

                <NavLink
                  key={item.caminho}
                  to={item.caminho}
                  className={({ isActive }) =>
                    isActive
                      ? "menu-item active"
                      : "menu-item"
                  }
                >

                  <Icon size={19} />

                  <span>{item.nome}</span>

                </NavLink>

              );

            })}

          </div>


          {/* RELATÓRIOS */}

          <div className="menu-section">

            <span className="menu-title">
              ANÁLISES
            </span>

            <NavLink
              to="/relatorios"
              className="menu-item"
            >

              <BarChart3 size={19} />

              <span>Relatórios</span>

            </NavLink>

          </div>


          {/* RODAPÉ SIDEBAR */}

          <div className="sidebar-footer">

            <div className="profile">

              <div className="profile-avatar">
                GB
              </div>

              <div className="profile-info">

                <strong>
                  Administrador
                </strong>

                <span>
                  AgroLinker
                </span>

              </div>

            </div>

          </div>

        </aside>


        {/* ================================================= */}
        {/* ÁREA PRINCIPAL */}
        {/* ================================================= */}

        <div className="main">

          {/* HEADER */}

          <header className="header">

            <div className="header-search">

              <Search size={19} />

              <input
                type="text"
                placeholder="Pesquisar..."
              />

            </div>


            <div className="header-right">

              <button className="notification">

                <Bell size={19} />

                <span className="notification-dot">
                </span>

              </button>


              <div className="user">

                <div className="user-avatar">
                  GB
                </div>

                <div className="user-data">

                  <strong>
                    Gabriel
                  </strong>

                  <span>
                    Administrador
                  </span>

                </div>

              </div>

            </div>

          </header>


          {/* CONTEÚDO */}

          <main className="content">

            <Routes>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/produtores"
                element={<Produtores />}
              />

              <Route
                path="/agricultores"
                element={<Agricultores />}
              />

              <Route
                path="/pecuaristas"
                element={<Pecuaristas />}
              />

              <Route
                path="/empresas"
                element={<Empresas />}
              />

              <Route
                path="/clientes"
                element={<Clientes />}
              />

              <Route
                path="/funcionarios"
                element={<Funcionarios />}
              />

              <Route
                path="/recursos"
                element={<Recursos />}
              />

            </Routes>

          </main>

        </div>

      </div>

    </BrowserRouter>

  );
}

export default App;