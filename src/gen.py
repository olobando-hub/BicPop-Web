import os

file_names = [
    "input.tsx",
    "label.tsx",
    "menubar.tsx",
    "navigation-menu.tsx",
    "pagination.tsx",
    "popover.tsx",
    "progress.tsx",
    "radio-group.tsx",
    "resizable.tsx",
    "scroll-area.tsx",
    "select.tsx",
    "separator.tsx",
    "sheet.tsx",
    "sidebar.tsx",
    "skeleton.tsx",
    "slider.tsx",
    "sonner.tsx",
    "switch.tsx",
    "table.tsx",
    "tabs.tsx",
    "textarea.tsx",
    "toast.tsx",
    "toaster.tsx",
    "toggle-group.tsx",
    "toggle.tsx",
    "tooltip.tsx",
    "use-toast.ts",
]

# Carpeta donde se crearán los archivos
output_dir = "components"

# Crear carpeta si no existe
os.makedirs(output_dir, exist_ok=True)

# Función para convertir kebab-case a PascalCase
def to_pascal_case(name: str) -> str:
    parts = name.replace(".tsx", "").replace(".ts", "").split("-")
    return "".join(word.capitalize() for word in parts)

# Crear cada archivo
for file_name in file_names:
    file_path = os.path.join(output_dir, file_name)

    # Si el archivo ya existe, no lo sobrescribe
    if os.path.exists(file_path):
        print(f"Ya existe: {file_name}")
        continue

    # Generar contenido inicial (boilerplate) para .tsx
    if file_name.endswith(".tsx"):
        component_name = to_pascal_case(file_name)
        content = f"""import React from "react";

export const {component_name} = () => {{
    return <div>{component_name}</div>;
}};
"""
    else:
        content = ""  # para .ts o archivos sin boilerplate

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Archivo creado: {file_name}")
