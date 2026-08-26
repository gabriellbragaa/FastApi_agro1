import { Bell, Search } from "lucide-react";

function Header() {
    return (
        <header className="header">

            <div className="search">

                <Search size={20} />

                <input
                    type="text"
                    placeholder="Pesquisar..."
                />

            </div>

            <div className="header-actions">

                <button className="icon-button">
                    <Bell size={20} />
                </button>

                <div className="user-profile">

                    <div className="avatar">
                        GB
                    </div>

                    <div>
                        <strong>Administrador</strong>
                        <span>AgroLinker</span>
                    </div>

                </div>

            </div>

        </header>
    );
}

export default Header;