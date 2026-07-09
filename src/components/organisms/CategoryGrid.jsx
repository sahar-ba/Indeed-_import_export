import { Wheat, Zap, Shirt, Cpu, Car, FlaskConical, Building2, Cog, Package } from "lucide-react";
import CategoryCard from "./CategoryCard";
import { spacing } from "../../styles/tokens";

const CATEGORIES = [
  { label: "Agroalimentaire", category: "Agroalimentaire", Icon: Wheat },
  { label: "Énergie", category: "Énergie", Icon: Zap },
  { label: "Textile", category: "Textile", Icon: Shirt },
  { label: "Électronique", category: "Électronique", Icon: Cpu },
  { label: "Automobile", category: "Automobile", Icon: Car },
  { label: "Cosmétique", category: "Cosmétique", Icon: FlaskConical },
  { label: "Construction", category: "Construction", Icon: Building2 },
  { label: "Machines industrielles", category: "Machines industrielles", Icon: Cog },
  { label: "Emballage & Logistique", category: "Emballage & Logistique", Icon: Package },
];

export default function CategoryGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: spacing.md,
      }}
    >
      {CATEGORIES.map((cat) => (
        <CategoryCard key={cat.category} {...cat} />
      ))}
    </div>
  );
}
