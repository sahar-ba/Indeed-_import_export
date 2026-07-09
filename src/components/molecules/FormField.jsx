import Input from "../atoms/Input";

export default function FormField({ label, name, register, rules, error, type, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 600 }}>
          {label}
        </label>
      )}
      <Input
        name={name}
        register={(fieldName) => register(fieldName, rules)}
        error={error}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}
