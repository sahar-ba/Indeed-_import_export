import Select from "../atoms/Select";
import { spacing } from "../../styles/tokens";

/**
 * FilterBar générique piloté par config, au lieu d'un composant dédié par feature.
 *
 * fields = [
 *   { name: "country", placeholder: "Tous les pays", options: [{ value, label }] },
 *   { name: "category", placeholder: "Toutes les catégories", options: [...] },
 * ]
 */
export default function FilterBar({ fields, filters, onChange }) {
  function handleFieldChange(name, value) {
    onChange({ ...filters, [name]: value });
  }

return (
  <div
    style={{
      display: "flex",
      gap: spacing.md,
      marginBottom: spacing.lg,
      flexWrap: "wrap", // responsive
    }}
  >
    {fields.map((field) => (
      <Select
        key={field.name}
        placeholder={field.placeholder}
        options={field.options}
        value={filters[field.name]}
        onChange={(value) =>
          handleFieldChange(field.name, value)
        }
      />
    ))}
  </div>
);
}
