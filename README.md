# Diagnóstico POO · Pensamiento Computacional

Prototipo web académico diseñado para transformar entregas individuales de código Python (`.py`) en **evidencia pedagógica comprensible**: identifica posibles deficiencias en los cuatro pilares de la Programación Orientada a Objetos (Abstracción, Encapsulamiento, Herencia y Polimorfismo) y ofrece una estimación interpretativa del pensamiento computacional, sin convertir el diagnóstico en una calificación numérica ni en una rúbrica obligatoria.

> **Nota de alcance:** Esta aplicación es un **prototipo funcional 100 % frontend**. No existe conexión a backend, base de datos ni ejecución real de Python; toda la información, validaciones de flujo y resultados se gestionan en memoria durante la sesión y se reinician al recargar el navegador.

---

## Funcionalidades implementadas

### 1. Portada Metodológica y Acceso por Rol (`HU-01`, `HU-02`)
- **Landing Page:** Presentación del enfoque metodológico, esquema visual del pipeline en 4 etapas y acceso directo al sistema.
- **Autenticación simulada y guardas de ruta:** Inicio de sesión con validación de estado de cuenta (bloqueo de cuentas inactivas), aislamiento de vistas por rol (`Administrador` vs. `Docente`), cierre de sesión y botones de acceso rápido de demostración.

### 2. Panel Docente (`HU-08` a `HU-14`)
- **Gestión de Grupos NRC:** Creación, edición y eliminación de grupos propios por NRC, asignatura y período académico (ej. `2026-A`).
- **Carga Masiva de Entregas `.py`:** Selector múltiple y zona *drag & drop* que valida la extensión `.py` (rechazando formatos no permitidos como `.cs` o `.zip`) y permite asociar cada archivo a un estudiante.
- **Simulación del Pipeline de Análisis:** Animación secuencial de 4 etapas (`Parser AST` → `Métricas C&K` → `SonarQube` → `Motor de Reglas + IA`) que incorpora los nuevos diagnósticos al grupo.
- **Resumen del Grupo:** Visualización agregada mediante gráficos SVG (dominio por pilar y distribución de niveles *Deficiente*, *En desarrollo* y *Satisfactorio*), filtros por estudiante, fecha o nivel, y tabla de resultados.
- **Diagnóstico Individual Detallado:**
  - **Desglose por los 4 pilares de la POO:** Nivel estimado, umbrales de referencia, métricas de Chidamber & Kemerer (`WMC`, `DIT`, `NOC`, `CBO`, `RFC`, `LCOM`), indicadores de calidad de código y visor de líneas estilo GitHub con evidencias AST resaltadas (`ABC`, `@abstractmethod`, `Protocol`, `_`, `__`, herencia).
  - **Sugerencias Pedagógicas Orientativas (Solo lectura):** Recomendaciones didácticas opcionales generadas por IA vinculadas a las evidencias detectadas, mostrando la versión del prompt aplicado y aclarando explícitamente que no son obligatorias ni constituyen rúbricas de evaluación.
  - **Estimación de Pensamiento Computacional (Solo lectura):** Visualización de dimensiones teóricas mediante nodos hexagonales conectados, evidencias del código, cita del artículo base y aviso explícito de que es una estimación interpretativa y no una medición directa.

### 3. Panel Administrador (`HU-03` a `HU-07`, `HU-19`)
- **Gestión de Cuentas y Roles:** CRUD completo de usuarios (`Administrador` / `Docente`) y control de estado (`Activo` / `Inactivo`), con protección que impide desactivar o eliminar la propia sesión activa.
- **Monitoreo de Servicios:** Indicadores visuales de estado (`En línea` / `Fuera de línea`) para API REST, PostgreSQL, SonarQube y Servicio de IA, más un acceso externo independiente hacia Grafana (sin incrustar).
- **Criterios, Umbrales y Prompts de IA (Solo lectura):** Consulta estructurada de los parámetros vigentes por pilar, referencias científicas, versión y fecha de definición.
- **Supervisión Global (Solo lectura):** Inspección de todos los grupos NRC y diagnósticos de los docentes reutilizando las vistas de análisis sin permisos de modificación.

---

## Stack tecnológico y arquitectura UI

| Capa | Tecnología / Implementación |
| :--- | :--- |
| **Framework UI** | React 19 + Vite 8 |
| **Estilos** | Tailwind CSS 4 (`@tailwindcss/vite`, tokens en `@theme`, sin `tailwind.config.js`) |
| **Diseño de Interfaz** | Arquitectura técnica estilo GitHub Primer (cabecera contextual, pestañas con contador, cajas de repositorio y visor de código con numeración de líneas) |
| **Visualización de Datos** | Componentes SVG propios (`src/components/charts/`): arcos concéntricos radiales, barras segmentadas por bloques, barras sobre grilla con línea de nodos, nodos hexagonales conectados y chevrons de pipeline |
| **Iconografía** | `lucide-react` |
| **Calidad de Código** | ESLint 10 (configuración plana con `react-hooks` y `react-refresh`) |
| **Accesibilidad** | Interfaz 100 % en español, navegación por teclado en `tablist`, atributos `aria-*`, diálogos nativos, descripciones en gráficos SVG y diseño adaptable a pantallas pequeñas |

Sin router externo, gestor de estado global, cliente HTTP, librería de i18n ni framework de pruebas. La navegación se controla con estado interno y guardas de rol en `src/App.jsx`.

---

## Requisitos e instalación

- **Node.js** (versión compatible con Vite 8) y **npm**.

```powershell
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (http://localhost:5173)
npm run dev

# Generar build de producción en dist/
npm run build

# Previsualizar el build localmente
npm run preview

# Ejecutar linter
npm run lint