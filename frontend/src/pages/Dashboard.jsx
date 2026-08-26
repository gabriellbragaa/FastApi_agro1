import {
    Users,
    Building2,
    Package,
    Handshake,
    Sprout,
    Beef,
    UserRound,
    BriefcaseBusiness,
    ArrowUpRight,
    Activity
} from "lucide-react";

function Dashboard() {
    const cards = [
        {
            title: "Produtores",
            value: "125",
            description: "produtores cadastrados",
            icon: Users,
        },
        {
            title: "Empresas",
            value: "32",
            description: "empresas cadastradas",
            icon: Building2,
        },
        {
            title: "Recursos",
            value: "87",
            description: "recursos disponíveis",
            icon: Package,
        },
        {
            title: "Parcerias",
            value: "24",
            description: "parcerias ativas",
            icon: Handshake,
        },
    ];

    const statistics = [
        {
            title: "Agricultores",
            value: "78",
            icon: Sprout,
        },
        {
            title: "Pecuaristas",
            value: "47",
            icon: Beef,
        },
        {
            title: "Funcionários",
            value: "18",
            icon: BriefcaseBusiness,
        },
        {
            title: "Clientes",
            value: "64",
            icon: UserRound,
        },
    ];

    return (
        <div className="dashboard">

            {/* CABEÇALHO */}
            <div className="dashboard-header">
                <div>
                    <h2>Dashboard</h2>

                    <p>
                        Visão geral da plataforma AgroLinker
                    </p>
                </div>

                <div className="dashboard-date">
                    <span>Visão geral</span>
                </div>
            </div>


            {/* CARDS PRINCIPAIS */}
            <div className="dashboard-cards">

                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            className="dashboard-card"
                            key={card.title}
                        >

                            <div className="dashboard-card-header">

                                <div className="dashboard-icon">
                                    <Icon size={21} />
                                </div>

                                <ArrowUpRight
                                    size={18}
                                    className="dashboard-arrow"
                                />

                            </div>

                            <div className="dashboard-value">
                                {card.value}
                            </div>

                            <div className="dashboard-card-title">
                                {card.title}
                            </div>

                            <div className="dashboard-description">
                                {card.description}
                            </div>

                        </div>
                    );
                })}

            </div>


            {/* SEGUNDA LINHA */}
            <div className="dashboard-section">

                <div className="section-title">

                    <div>
                        <h3>Resumo da plataforma</h3>

                        <p>
                            Informações gerais do AgroLinker
                        </p>
                    </div>

                </div>


                <div className="statistics-grid">

                    {statistics.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                className="statistic-item"
                                key={item.title}
                            >

                                <div className="statistic-icon">
                                    <Icon size={19} />
                                </div>

                                <div className="statistic-info">

                                    <span>
                                        {item.title}
                                    </span>

                                    <strong>
                                        {item.value}
                                    </strong>

                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>


            {/* ATIVIDADES */}
            <div className="dashboard-section">

                <div className="section-title">

                    <div className="section-heading">

                        <div className="section-heading-icon">
                            <Activity size={18} />
                        </div>

                        <div>
                            <h3>Atividade recente</h3>

                            <p>
                                Últimas movimentações do sistema
                            </p>
                        </div>

                    </div>

                </div>


                <div className="activity-empty">

                    <Activity size={28} />

                    <strong>
                        Nenhuma atividade recente
                    </strong>

                    <span>
                        As movimentações do sistema aparecerão aqui.
                    </span>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;