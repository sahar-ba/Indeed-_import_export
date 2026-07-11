import { useRef, useState } from "react";
import { Paperclip, X, FileText } from "lucide-react";

// Contraintes de validation des fichiers uploadés (certificats, fiches techniques...).
// À terme ces règles seront revalidées côté serveur, mais on évite déjà côté
// client qu'un .exe/.zip ou un fichier trop volumineux soit accepté.
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo

export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const ACCEPTED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];

export function isAcceptedFile(file) {
  const name = file.name?.toLowerCase() || "";
  const hasAcceptedExtension = ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
  const hasAcceptedMime = ACCEPTED_MIME_TYPES.includes(file.type);
  // On accepte si le MIME OU l'extension correspond (certains navigateurs/OS
  // ne renseignent pas toujours file.type de façon fiable).
  return hasAcceptedMime || hasAcceptedExtension;
}

export const DOCUMENT_TYPES = [
  {
    value: "photo",
    label: "📸 Photo produit",
  },
  {
    value: "technical_sheet",
    label: "📄 Fiche technique",
  },
  {
    value: "certificate",
    label: "✅ Certification",
  },
  {
    value: "lab_report",
    label: "🧪 Analyse labo",
  },
  {
    value: "brochure",
    label: "📚 Brochure",
  },
  {
    value: "other",
    label: "📎 Autre",
  },
];

export default function FileDropzone({
  files,
  onChange,
  showValidation = false,
}) {
  const inputRef = useRef(null);

  const [dragOver, setDragOver] =
    useState(false);

  const [uploadErrors, setUploadErrors] =
    useState([]);

  function addFiles(fileList) {
    const incoming = Array.from(fileList);
    const accepted = [];
    const rejected = [];

    incoming.forEach((file) => {
      if (!isAcceptedFile(file)) {
        rejected.push(
          `${file.name} : type de fichier non autorisé (PDF ou image uniquement)`
        );
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        rejected.push(
          `${file.name} : fichier trop volumineux (10 Mo maximum)`
        );
        return;
      }
      accepted.push({
        name: file.name,
        size: file.size,
        file,
        label: "",
        type: "",
      });
    });

    setUploadErrors(rejected);

    if (accepted.length > 0) {
      onChange([...files, ...accepted]);
    }
  }

  function removeFile(index) {
    onChange(
      files.filter((_, i) => i !== index)
    );
  }

  function updateFile(
    index,
    field,
    value
  ) {
    const updated = [...files];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

   onChange(updated);
  }

  function formatSize(bytes) {
    if (!bytes) return "";

    if (bytes < 1024)
      return `${bytes} o`;

    if (bytes < 1024 * 1024)
      return `${(
        bytes / 1024
      ).toFixed(0)} Ko`;

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} Mo`;
  }

  const getTypeLabel = (type) => {
    return (
      DOCUMENT_TYPES.find(
        (t) => t.value === type
      )?.label || ""
    );
  };

  return (
    <div>
      {/* Zone Upload */}

      <div
        onClick={() =>
          inputRef.current?.click()
        }
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() =>
          setDragOver(false)
        }
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);

          if (
            e.dataTransfer.files?.length
          ) {
            addFiles(
              e.dataTransfer.files
            );
          }
        }}
        style={{
          border: `2px dashed ${
            dragOver
              ? "#4f46e5"
              : "#d1d5db"
          }`,
          borderRadius: 16,
          padding: "28px 20px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: dragOver
            ? "#eef2ff"
            : "#f9fafb",
        }}
      >
        <Paperclip
          size={28}
          color="#4f46e5"
        />

        <p
          style={{
            marginTop: 10,
            fontWeight: 600,
          }}
        >
          Glissez vos fichiers ici ou
          cliquez pour parcourir
        </p>

        <p
          style={{
            color: "#6b7280",
            fontSize: 13,
          }}
        >
          Photos, certificats,
          fiches techniques,
          brochures...
        </p>

        <p
          style={{
            color: "#94a3b8",
            fontSize: 12,
            marginTop: 4,
          }}
        >
          Formats acceptés : PDF, JPG, PNG, WEBP — 10 Mo max par fichier
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={[...ACCEPTED_MIME_TYPES, ...ACCEPTED_EXTENSIONS].join(",")}
          hidden
          onChange={(e) =>
            e.target.files?.length &&
            addFiles(e.target.files)
          }
        />
      </div>

      {/* Erreurs de validation d'upload (type / taille) */}

      {uploadErrors.length > 0 && (
        <div
          style={{
            marginTop: 12,
            padding: "12px 14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 12,
          }}
        >
          {uploadErrors.map((message, i) => (
            <p
              key={i}
              style={{
                color: "#dc2626",
                fontSize: 13,
                margin: i === 0 ? 0 : "4px 0 0",
              }}
            >
              ⚠️ {message}
            </p>
          ))}
        </div>
      )}

      {/* Documents */}

      {files.length > 0 && (
        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {files.map(
            (file, index) => {
              const isIncomplete =
                showValidation &&
                (!file.label?.trim() || !file.type);

              return (
              <div
                key={`${file.name}-${index}`}
                style={{
                  background:
                    "#f8fafc",
                  border: isIncomplete
                    ? "1px solid #dc2626"
                    : "1px solid #e2e8f0",
                  borderRadius:
                    "14px",
                  padding: "16px",
                }}
              >
                {/* Header */}

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    marginBottom:
                      "12px",
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: 8,
                    }}
                  >
                    <FileText
                      size={18}
                      color="#4f46e5"
                    />

                    <span>
                      {file.name}
                    </span>

                    <span
                      style={{
                        color:
                          "#94a3b8",
                        fontSize:
                          "12px",
                      }}
                    >
                      (
                      {formatSize(
                        file.size
                      )}
                      )
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeFile(
                        index
                      )
                    }
                    style={{
                      border:
                        "none",
                      background:
                        "none",
                      cursor:
                        "pointer",
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Titre */}

                <input
                  type="text"
                  placeholder="Titre du document (ex: Certification BIO 2026)"
                  value={
                    file.label || ""
                  }
                  onChange={(e) =>
                    updateFile(
                      index,
                      "label",
                      e.target
                        .value
                    )
                  }
                  style={{
                    width: "100%",
                    padding:
                      "10px 12px",
                    marginBottom:
                      "14px",
                    border:
                      "1px solid #d1d5db",
                    borderRadius:
                      "10px",
                    boxSizing:
                      "border-box",
                  }}
                />

                {/* Types */}

                <div
                  style={{
                    display:
                      "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {DOCUMENT_TYPES.map(
                    (type) => {
                      const selected =
                        file.type ===
                        type.value;

                      return (
                        <button
                          key={
                            type.value
                          }
                          type="button"
                          onClick={() =>
                            updateFile(
                              index,
                              "type",
                              type.value
                            )
                          }
                          style={{
                            border:
                              selected
                                ? "2px solid #4f46e5"
                                : "1px solid #d1d5db",

                            background:
                              selected
                                ? "#eef2ff"
                                : "#ffffff",

                            color:
                              selected
                                ? "#4f46e5"
                                : "#374151",

                            borderRadius:
                              "999px",

                            padding:
                              "8px 14px",

                            cursor:
                              "pointer",

                            fontWeight:
                              selected
                                ? 600
                                : 500,

                            transition:
                              "all .2s ease",
                          }}
                        >
                          {
                            type.label
                          }
                        </button>
                      );
                    }
                  )}
                </div>

                {isIncomplete && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: 13,
                      marginTop: 10,
                      marginBottom: 0,
                    }}
                  >
                    ⚠️ Titre et type de document requis
                  </p>
                )}
              </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
