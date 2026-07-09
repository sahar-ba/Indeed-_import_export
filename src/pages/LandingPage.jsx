import { Link } from "react-router-dom";
import Button from "../components/atoms/Button";
import StepCard from "../components/organisms/StepCard";
import CategoryGrid from "../components/organisms/CategoryGrid";
import TradeRouteIllustration from "../components/organisms/TradeRouteIllustration";
import { colors, spacing } from "../styles/tokens";

export default function LandingPage() {
  return (
    <div>
      {/* HERO */}

      <div
        style={{
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          width: "100vw",
          backgroundImage:
            "linear-gradient(120deg,#0F172A 0%, #1E1B4B 100%)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: `${spacing.xxl}px ${spacing.xl}px`,
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            alignItems: "center",
            gap: spacing.xl,
            minHeight: 520,
          }}
        >
          <div
            style={{
              position: "relative",
              paddingLeft: 28,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: -12,
                bottom: 40,
                width: 10,
                borderLeft: "3px solid #818CF8",
                borderTop: "3px solid #818CF8",
                borderBottom: "3px solid #818CF8",
                opacity: 0.8,
              }}
            />

            <h1
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: spacing.md,
              }}
            >
              Trouvez Le
              <br />
              Partenaire Commercial
              <br />
              Idéal
            </h1>

            <p
              style={{
                fontSize: 18,
                color: "#C7CCE8",
                maxWidth: 500,
                marginBottom: spacing.lg,
                lineHeight: 1.7,
              }}
            >
              Indeed² connecte exportateurs et importateurs
              partout dans le monde grâce à un système
              intelligent de mise en relation.
            </p>

            <div
              style={{
                display: "flex",
                gap: spacing.md,
                flexWrap: "wrap",
              }}
            >
              <Link to="/listings/create">
                <Button>
                  Publier une annonce →
                </Button>
              </Link>

              <Link to="/listings">
                <Button variant="secondary">
                  Voir les annonces
                </Button>
              </Link>
            </div>
          </div>

          <div
            style={{
              height: 350,
            }}
          >
            <TradeRouteIllustration />
          </div>
        </div>
      </div>

      {/* SECTEURS */}

      <div
        style={{
          marginTop: spacing.xxl,
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              fontSize: 38,
              color: colors.textPrimary,
              marginBottom: "10px",
            }}
          >
            Explorer par secteur
          </h2>

        </div>

        <CategoryGrid />
      </div>

      {/* COMMENT ÇA MARCHE */}

      <div
        style={{
          marginTop: spacing.xxl,
          marginBottom: spacing.xxl,
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          <h2
            style={{
              fontSize: "42px",
              fontWeight: 800,
              color: colors.textPrimary,
              marginBottom: "16px",
            }}
          >
            Comment fonctionne Indeed² ?
          </h2>
        </div>

        {/* VERSION RESPONSIVE */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          <StepCard
            icon="🚀"
            title="Créez votre compte"
            description="Inscrivez-vous en tant qu'importateur ou exportateur et complétez votre profil professionnel."
          />

          <StepCard
            icon="📦"
            title="Publiez votre annonce"
            description="Déposez une offre d'exportation ou une demande d'importation détaillée en quelques minutes."
          />

          <StepCard
            icon="🤝"
            title="Trouvez un partenaire"
            description="Identifiez les meilleures opportunités commerciales et échangez directement avec les entreprises."
          />
        </div>
      </div>
    </div>
  );
}