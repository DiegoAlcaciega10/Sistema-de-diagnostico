export const ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  PUBLIC: 'PUBLIC',
}

export const LEVELS = {
  DEFICIENT: 'Deficiente',
  IN_DEVELOPMENT: 'En desarrollo',
  SATISFACTORY: 'Satisfactorio',
}

export const PILLARS = [
  {
    id: 'abstraction',
    name: 'Abstracción',
    description: 'Identificación de entidades, atributos y modelos relevantes del dominio.',
  },
  {
    id: 'encapsulation',
    name: 'Encapsulamiento',
    description: 'Protección del estado interno y exposición controlada mediante interfaces.',
  },
  {
    id: 'inheritance',
    name: 'Herencia',
    description: 'Reutilización y especialización correcta de comportamientos comunes.',
  },
  {
    id: 'polymorphism',
    name: 'Polimorfismo',
    description: 'Uso de interfaces y sobrescritura para tratar objetos de forma uniforme.',
  },
]

export const PIPELINE_STEPS = [
  { id: 'ast', label: 'Parser AST', shortLabel: 'Parser AST', detail: 'Árbol de sintaxis abstracta' },
  { id: 'ck', label: 'Métricas C&K', shortLabel: 'Métricas C&K', detail: 'Chidamber & Kemerer' },
  { id: 'sonar', label: 'SonarQube', shortLabel: 'SonarQube', detail: 'Calidad y deuda técnica' },
  { id: 'rules-ai', label: 'Motor de Reglas + IA', shortLabel: 'Reglas + IA', detail: 'Umbrales y apoyo formativo' },
]

export const CT_DIMENSIONS = [
  'Descomposición',
  'Reconocimiento de patrones',
  'Abstracción',
  'Diseño de algoritmos',
]

export const CT_REFERENCES = {
  Descomposición:
    'Wing, J. M. (2006). Computational thinking. Communications of the ACM, 49(3), 33–35.',
  'Reconocimiento de patrones':
    'Wing, J. M. (2006). Computational thinking. Communications of the ACM, 49(3), 33–35.',
  Abstracción:
    'Booch, G., Rumbaugh, J., & Jacobson, I. (2007). Unified Modeling Language User Guide (2.ª ed.). Addison-Wesley.',
  'Diseño de algoritmos':
    'Wing, J. M. (2006). Computational thinking. Communications of the ACM, 49(3), 33–35.',
}

export const initialUsers = [
  {
    id: 'u-1',
    name: 'Dra. Ana Salazar',
    email: 'admin@diagnostico.edu',
    password: 'admin123',
    role: ROLES.ADMIN,
    active: true,
  },
  {
    id: 'u-2',
    name: 'Prof. Luis Ramírez',
    email: 'docente@diagnostico.edu',
    password: 'docente123',
    role: ROLES.TEACHER,
    active: true,
  },
  {
    id: 'u-3',
    name: 'Prof. Marta Ruiz',
    email: 'marta@diagnostico.edu',
    password: 'docente123',
    role: ROLES.TEACHER,
    active: true,
  },
  {
    id: 'u-4',
    name: 'Prof. Diego Fuentes',
    email: 'inactivo@diagnostico.edu',
    password: 'docente123',
    role: ROLES.TEACHER,
    active: false,
  },
]

export const initialGroups = [
  {
    id: 'g-1',
    nrc: '4521',
    subject: 'Programación Orientada a Objetos',
    period: '2026-A',
    teacherId: 'u-2',
  },
  {
    id: 'g-2',
    nrc: '4527',
    subject: 'Estructuras de Datos con Python',
    period: '2026-A',
    teacherId: 'u-2',
  },
  {
    id: 'g-3',
    nrc: '4533',
    subject: 'Pensamiento Computacional',
    period: '2026-A',
    teacherId: 'u-3',
  },
]

export const initialStudents = [
  { id: 's-1', name: 'Camila Ortega', email: 'camila.ortega@estudiante.edu', groupId: 'g-1' },
  { id: 's-2', name: 'Andrés Vega', email: 'andres.vega@estudiante.edu', groupId: 'g-1' },
  { id: 's-3', name: 'Lucía Fernández', email: 'lucia.fernandez@estudiante.edu', groupId: 'g-1' },
  { id: 's-4', name: 'Mateo Ríos', email: 'mateo.rios@estudiante.edu', groupId: 'g-2' },
  { id: 's-5', name: 'Valeria Soto', email: 'valeria.soto@estudiante.edu', groupId: 'g-2' },
  { id: 's-6', name: 'Emilio Paz', email: 'emilio.paz@estudiante.edu', groupId: 'g-2' },
  { id: 's-7', name: 'Renata Silva', email: 'renata.silva@estudiante.edu', groupId: 'g-3' },
  { id: 's-8', name: 'Joaquín León', email: 'joaquin.leon@estudiante.edu', groupId: 'g-3' },
]

export const pillarCriteria = [
  {
    id: 'abstraction',
    pillar: 'Abstracción',
    threshold: 0.65,
    reference: 'Chidamber & Kemerer (1994); modelo de abstracción de Booch et al. (2007).',
    version: 'v2.1.0',
    updatedAt: '2026-06-18',
    rule: 'Presencia de clases cohesivas con responsabilidad única y nombres del dominio.',
  },
  {
    id: 'encapsulation',
    pillar: 'Encapsulamiento',
    threshold: 0.7,
    reference: 'Chidamber & Kemerer (1994), métricas LCOM y acoplamiento (CBO).',
    version: 'v2.1.0',
    updatedAt: '2026-06-18',
    rule: 'Atributos privados, acceso controlado y bajo acoplamiento entre clases.',
  },
  {
    id: 'inheritance',
    pillar: 'Herencia',
    threshold: 0.6,
    reference: 'Chidamber & Kemerer (1994), métricas DIT y NOC.',
    version: 'v2.0.4',
    updatedAt: '2026-05-30',
    rule: 'Jerarquías moderadas, sobrescritura coherente y ausencia de herencia superflua.',
  },
  {
    id: 'polymorphism',
    pillar: 'Polimorfismo',
    threshold: 0.58,
    reference: 'Gamma et al. (1994) y Hubert et al. (2018) sobre sobrescritura efectiva.',
    version: 'v2.0.4',
    updatedAt: '2026-05-30',
    rule: 'Uso de polimorfismo en puntos de extensión y despacho dinámico explícito.',
  },
]

export const aiPrompts = [
  {
    id: 'p-1',
    name: 'Sugerencias pedagógicas por pilar',
    version: 'v3.2.1',
    updatedAt: '2026-08-02',
    content:
      'Eres un tutor de POO en Python. A partir de evidencias AST, métricas C&K y hallazgos SonarQube, propón tres acciones formativas opcionales, redactadas en tono propositivo y vinculadas a cada evidencia. No emitas calificaciones numéricas ni reemplaces el criterio docente.',
  },
  {
    id: 'p-2',
    name: 'Interpretación de pensamiento computacional',
    version: 'v1.4.0',
    updatedAt: '2026-07-21',
    content:
      'Analiza la entrega como evidencia de descomposición, reconocimiento de patrones, abstracción y diseño de algoritmos. Describe observaciones, no conclusiones definitivas sobre la competencia del estudiante.',
  },
  {
    id: 'p-3',
    name: 'Resumen para el docente',
    version: 'v2.0.3',
    updatedAt: '2026-08-15',
    content:
      'Redacta un resumen neutro de hasta 120 palabras con fortalezas, dificultades y preguntas de seguimientopara la tutoría, usando únicamente evidencias del archivo .py analizado.',
  },
]

export const initialServices = [
  { id: 'sv-1', name: 'API REST / AST', detail: 'Análisis sintáctico Python', status: 'online' },
  { id: 'sv-2', name: 'PostgreSQL', detail: 'Persistencia institucional', status: 'online' },
  { id: 'sv-3', name: 'SonarQube', detail: 'Calidad de código', status: 'online' },
  { id: 'sv-4', name: 'Servicio IA', detail: 'Sugerencias formativas', status: 'offline' },
]

const codeSamples = {
  biblioteca: `class Biblioteca:
    def __init__(self):
        self.libros = []

    def agregar(self, titulo):
        self.libros.append(titulo)

    def prestar(self, titulo):
        if titulo in self.libros:
            self.libros.remove(titulo)
            return True
        return False`,
  vehiculos: `class Auto:
    def __init__(self, velocidad):
        self.velocidad = velocidad

    def acelerar(self, incremento):
        self.velocidad = self.velocidad + incremento

class Bicicleta:
    def __init__(self, velocidad):
        self.velocidad = velocidad

    def acelerar(self, incremento):
        self.velocidad = self.velocidad + incremento`,
  pila: `class Pila:
    def __init__(self):
        self.items = []

    def apilar(self, item):
        self.items.append(item)

    def desapilar(self):
        return self.items.pop()

    def esta_vacia(self):
        return len(self.items) == 0`,
  figuras: `class Figura:
    def area(self):
        pass

class Rectangulo(Figura):
    def __init__(self, base, altura):
        self.base = base
        self.altura = altura

    def area(self):
        return self.base * self.altura`,
  usuario: `class Usuario:
    nombre = ""

    def __init__(self, nombre):
        Usuario.nombre = nombre

    def saludar(self):
        print("Hola " + Usuario.nombre)`,
  pedidos: `class Pedido:
    def __init__(self, items):
        self.items = items

    def total(self):
        resultado = 0
        for item in self.items:
            resultado = resultado + item.precio
        return resultado`,
  calculadora: `def calcular(operacion, a, b):
    if operacion == "suma":
        return a + b
    if operacion == "resta":
        return a - b
    if operacion == "multiplica":
        return a * b
    return None`,
  tareas: `class Tarea:
    def __init__(self, titulo, prioridad):
        self.titulo = titulo
        self._prioridad = prioridad

    @property
    def prioridad(self):
        return self._prioridad

    def __str__(self):
        return f"{self.titulo} ({self.prioridad})"`,
}

const noCK = 'No calculable por falta de estructura'

const seeds = [
  {
    studentId: 's-1',
    fileName: 'gestion_biblioteca.py',
    analyzedAt: '2026-09-14',
    scores: { abstraction: 0.71, encapsulation: 0.44, inheritance: 0.32, polymorphism: 0.28 },
    ck: {
      abstraction: { wmc: 4, cbo: 2, rfc: 9, lcom: 0.32, dit: null, noc: null },
      encapsulation: { wmc: 3, cbo: 5, rfc: 8, lcom: 0.74, dit: null, noc: null },
      inheritance: { wmc: null, cbo: null, rfc: null, lcom: null, dit: 0, noc: 0 },
      polymorphism: { wmc: 2, cbo: 1, rfc: 4, lcom: 0.4, dit: 0, noc: 0 },
    },
    sonar: [
      { name: 'Deuda técnica', value: '18 min', tone: 'warning' },
      { name: 'Duplicación', value: '0.0 %', tone: 'ok' },
      { name: 'Complejidad', value: 'Baja', tone: 'ok' },
    ],
    evidence: { code: codeSamples.biblioteca, astNodes: ['ClassDef: Biblioteca', 'FunctionDef: __init__', 'FunctionDef: prestar', 'Attribute: self.libros'] },
    ct: [
      { name: 'Descomposición', level: 'Satisfactorio', evidence: 'Separa el dominio en una clase con responsabilidades de inventario.' },
      { name: 'Reconocimiento de patrones', level: 'En desarrollo', evidence: 'Reutiliza listas pero no generaliza operaciones de búsqueda.' },
      { name: 'Abstracción', level: 'Satisfactorio', evidence: 'Modela el concepto Biblioteca con datos y operaciones.' },
      { name: 'Diseño de algoritmos', level: 'En desarrollo', evidence: 'Secuencia correcta, sin manejo explícito de casos límite.' },
    ],
  },
  {
    studentId: 's-2',
    fileName: 'vehiculos.py',
    analyzedAt: '2026-09-15',
    scores: { abstraction: 0.52, encapsulation: 0.61, inheritance: 0.42, polymorphism: 0.34 },
    ck: {
      abstraction: { wmc: 3, cbo: 4, rfc: 7, lcom: 0.66, dit: null, noc: null },
      encapsulation: { wmc: 2, cbo: 3, rfc: 5, lcom: 0.48, dit: null, noc: null },
      inheritance: { wmc: 2, cbo: 4, rfc: 6, lcom: 0.52, dit: 0, noc: 0 },
      polymorphism: { wmc: 2, cbo: 2, rfc: 5, lcom: 0.51, dit: 0, noc: 0 },
    },
    sonar: [
      { name: 'Deuda técnica', value: '24 min', tone: 'warning' },
      { name: 'Duplicación', value: '12.4 %', tone: 'error' },
      { name: 'Complejidad', value: 'Baja', tone: 'ok' },
    ],
    evidence: { code: codeSamples.vehiculos, astNodes: ['ClassDef: Auto', 'ClassDef: Bicicleta', 'FunctionDef: acelerar (x2)', 'DuplicateBlock'] },
    ct: [
      { name: 'Descomposición', level: 'En desarrollo', evidence: 'Divide por tipos concretos sin identificar rasgos compartidos.' },
      { name: 'Reconocimiento de patrones', level: 'Deficiente', evidence: 'Repite la misma lógica de aceleración en dos clases.' },
      { name: 'Abstracción', level: 'En desarrollo', evidence: 'No surge una superclase que represente al vehículo.' },
      { name: 'Diseño de algoritmos', level: 'Satisfactorio', evidence: 'Actualización de estado clara y predecible.' },
    ],
  },
  {
    studentId: 's-3',
    fileName: 'estructura_pila.py',
    analyzedAt: '2026-09-16',
    scores: { abstraction: 0.84, encapsulation: 0.88, inheritance: 0.79, polymorphism: 0.81 },
    ck: {
      abstraction: { wmc: 5, cbo: 1, rfc: 10, lcom: 0.18, dit: null, noc: null },
      encapsulation: { wmc: 5, cbo: 1, rfc: 10, lcom: 0.15, dit: null, noc: null },
      inheritance: { wmc: 2, cbo: 1, rfc: 3, lcom: 0.2, dit: 1, noc: 1 },
      polymorphism: { wmc: 3, cbo: 1, rfc: 6, lcom: 0.22, dit: 1, noc: 1 },
    },
    sonar: [
      { name: 'Deuda técnica', value: '4 min', tone: 'ok' },
      { name: 'Duplicación', value: '0.0 %', tone: 'ok' },
      { name: 'Complejidad', value: 'Baja', tone: 'ok' },
    ],
    evidence: { code: codeSamples.pila, astNodes: ['ClassDef: Pila', 'FunctionDef: apilar', 'FunctionDef: desapilar', 'Call: len'] },
    ct: [
      { name: 'Descomposición', level: 'Satisfactorio', evidence: 'Define operaciones atómicas para la estructura.' },
      { name: 'Reconocimiento de patrones', level: 'Satisfactorio', evidence: 'Aplica el patrón LIFO de forma consistente.' },
      { name: 'Abstracción', level: 'Satisfactorio', evidence: 'Oculta la representación interna de la pila.' },
      { name: 'Diseño de algoritmos', level: 'Satisfactorio', evidence: 'Especifica la condición de pila vacía.' },
    ],
  },
  {
    studentId: 's-4',
    fileName: 'figuras.py',
    analyzedAt: '2026-09-17',
    scores: { abstraction: 0.77, encapsulation: 0.58, inheritance: 0.82, polymorphism: 0.45 },
    ck: {
      abstraction: { wmc: 3, cbo: 2, rfc: 6, lcom: 0.28, dit: null, noc: null },
      encapsulation: { wmc: 3, cbo: 3, rfc: 6, lcom: 0.58, dit: null, noc: null },
      inheritance: { wmc: 3, cbo: 2, rfc: 7, lcom: 0.3, dit: 1, noc: 2 },
      polymorphism: { wmc: 2, cbo: 2, rfc: 4, lcom: 0.62, dit: 1, noc: 2 },
    },
    sonar: [
      { name: 'Deuda técnica', value: '11 min', tone: 'ok' },
      { name: 'Duplicación', value: '2.1 %', tone: 'ok' },
      { name: 'Complejidad', value: 'Baja', tone: 'ok' },
    ],
    evidence: { code: codeSamples.figuras, astNodes: ['ClassDef: Figura', 'ClassDef: Rectangulo', 'FunctionDef: area (override)', 'Pass'] },
    ct: [
      { name: 'Descomposición', level: 'Satisfactorio', evidence: 'Identifica una interfaz común Figura.' },
      { name: 'Reconocimiento de patrones', level: 'Satisfactorio', evidence: 'Generaliza el concepto de área.' },
      { name: 'Abstracción', level: 'Satisfactorio', evidence: 'Introduce una clase base abstracta.' },
      { name: 'Diseño de algoritmos', level: 'En desarrollo', evidence: 'El método base vacío no define contrato explícito.' },
    ],
  },
  {
    studentId: 's-5',
    fileName: 'registro_usuario.py',
    analyzedAt: '2026-09-18',
    scores: { abstraction: 0.41, encapsulation: 0.35, inheritance: 0.28, polymorphism: 0.22 },
    ck: {
      abstraction: { wmc: 2, cbo: 3, rfc: 5, lcom: 0.82, dit: null, noc: null },
      encapsulation: { wmc: 2, cbo: 4, rfc: 5, lcom: 0.9, dit: null, noc: null },
      inheritance: { wmc: null, cbo: null, rfc: null, lcom: null, dit: 0, noc: 0 },
      polymorphism: { wmc: null, cbo: null, rfc: null, lcom: null, dit: 0, noc: 0 },
    },
    sonar: [
      { name: 'Deuda técnica', value: '32 min', tone: 'error' },
      { name: 'Duplicación', value: '8.7 %', tone: 'warning' },
      { name: 'Complejidad', value: 'Media', tone: 'warning' },
    ],
    evidence: { code: codeSamples.usuario, astNodes: ['ClassDef: Usuario', 'Assign: Usuario.nombre', 'Call: print', 'ClassAttributeMutation'] },
    ct: [
      { name: 'Descomposición', level: 'Deficiente', evidence: 'Concentra el estado en una variable de clase compartida.' },
      { name: 'Reconocimiento de patrones', level: 'Deficiente', evidence: 'No distingue entre instancias.' },
      { name: 'Abstracción', level: 'En desarrollo', evidence: 'La clase existe, pero su modelo de estado es incorrecto.' },
      { name: 'Diseño de algoritmos', level: 'Satisfactorio', evidence: 'La secuencia de saludo es directa.' },
    ],
  },
  {
    studentId: 's-6',
    fileName: 'pedidos.py',
    analyzedAt: '2026-09-19',
    scores: { abstraction: 0.63, encapsulation: 0.51, inheritance: 0.36, polymorphism: 0.4 },
    ck: {
      abstraction: { wmc: 3, cbo: 3, rfc: 7, lcom: 0.44, dit: null, noc: null },
      encapsulation: { wmc: 2, cbo: 4, rfc: 6, lcom: 0.7, dit: null, noc: null },
      inheritance: { wmc: null, cbo: null, rfc: null, lcom: null, dit: 0, noc: 0 },
      polymorphism: { wmc: 2, cbo: 3, rfc: 5, lcom: 0.55, dit: 0, noc: 0 },
    },
    sonar: [
      { name: 'Deuda técnica', value: '16 min', tone: 'warning' },
      { name: 'Duplicación', value: '0.0 %', tone: 'ok' },
      { name: 'Complejidad', value: 'Media', tone: 'warning' },
    ],
    evidence: { code: codeSamples.pedidos, astNodes: ['ClassDef: Pedido', 'For: self.items', 'Attribute: item.precio', 'AugAssign: resultado'] },
    ct: [
      { name: 'Descomposición', level: 'En desarrollo', evidence: 'Separa el cálculo del total en un método.' },
      { name: 'Reconocimiento de patrones', level: 'En desarrollo', evidence: 'Recorre una colección homogénea.' },
      { name: 'Abstracción', level: 'Satisfactorio', evidence: 'Modela Pedido como agregado de ítems.' },
      { name: 'Diseño de algoritmos', level: 'Satisfactorio', evidence: 'Acumulador con inicialización explícita.' },
    ],
  },
  {
    studentId: 's-7',
    fileName: 'calculadora.py',
    analyzedAt: '2026-09-20',
    scores: { abstraction: 0.38, encapsulation: 0.3, inheritance: 0.25, polymorphism: 0.47 },
    ck: {
      abstraction: { wmc: null, cbo: null, rfc: null, lcom: null, dit: null, noc: null },
      encapsulation: { wmc: null, cbo: null, rfc: null, lcom: null, dit: null, noc: null },
      inheritance: { wmc: null, cbo: null, rfc: null, lcom: null, dit: 0, noc: 0 },
      polymorphism: { wmc: 1, cbo: 1, rfc: 3, lcom: 0.1, dit: 0, noc: 0 },
    },
    sonar: [
      { name: 'Deuda técnica', value: '21 min', tone: 'warning' },
      { name: 'Duplicación', value: '5.3 %', tone: 'warning' },
      { name: 'Complejidad', value: 'Alta', tone: 'error' },
    ],
    evidence: { code: codeSamples.calculadora, astNodes: ['FunctionDef: calcular', 'If (x3)', 'Return: None', 'NoClassDef'] },
    ct: [
      { name: 'Descomposición', level: 'Deficiente', evidence: 'Una única función concentra todas las operaciones.' },
      { name: 'Reconocimiento de patrones', level: 'En desarrollo', evidence: 'Detecta operaciones, pero no las modela como objetos.' },
      { name: 'Abstracción', level: 'Deficiente', evidence: 'Ausencia de clases en la entrega.' },
      { name: 'Diseño de algoritmos', level: 'En desarrollo', evidence: 'Cadena condicional extensible con dificultad.' },
    ],
  },
  {
    studentId: 's-8',
    fileName: 'gestion_tareas.py',
    analyzedAt: '2026-09-21',
    scores: { abstraction: 0.86, encapsulation: 0.91, inheritance: 0.74, polymorphism: 0.77 },
    ck: {
      abstraction: { wmc: 4, cbo: 1, rfc: 8, lcom: 0.16, dit: null, noc: null },
      encapsulation: { wmc: 4, cbo: 1, rfc: 8, lcom: 0.12, dit: null, noc: null },
      inheritance: { wmc: 2, cbo: 1, rfc: 4, lcom: 0.18, dit: 1, noc: 1 },
      polymorphism: { wmc: 3, cbo: 1, rfc: 7, lcom: 0.2, dit: 1, noc: 1 },
    },
    sonar: [
      { name: 'Deuda técnica', value: '3 min', tone: 'ok' },
      { name: 'Duplicación', value: '0.0 %', tone: 'ok' },
      { name: 'Complejidad', value: 'Baja', tone: 'ok' },
    ],
    evidence: { code: codeSamples.tareas, astNodes: ['ClassDef: Tarea', 'Attribute: _prioridad', 'FunctionDef: prioridad', 'FunctionDef: __str__'] },
    ct: [
      { name: 'Descomposición', level: 'Satisfactorio', evidence: 'Aísla estado, acceso y representación.' },
      { name: 'Reconocimiento de patrones', level: 'Satisfactorio', evidence: 'Emplea convenciones de propiedades Python.' },
      { name: 'Abstracción', level: 'Satisfactorio', evidence: 'Protege el atributo sensible con guion bajo.' },
      { name: 'Diseño de algoritmos', level: 'Satisfactorio', evidence: 'Define una representación legible para depuración.' },
    ],
  },
]

const overallLevel = (scores) => {
  const average = Object.values(scores).reduce((sum, value) => sum + value, 0) / 4
  if (average < 0.55) return LEVELS.DEFICIENT
  if (average < 0.75) return LEVELS.IN_DEVELOPMENT
  return LEVELS.SATISFACTORY
}

const levelFor = (score, threshold) => {
  if (score < threshold - 0.15) return LEVELS.DEFICIENT
  if (score < threshold) return LEVELS.IN_DEVELOPMENT
  return LEVELS.SATISFACTORY
}

const ckLabels = {
  wmc: 'WMC',
  cbo: 'CBO',
  rfc: 'RFC',
  lcom: 'LCOM',
  dit: 'DIT',
  noc: 'NOC',
}

const pillarEvidencePatterns = {
  abstraction: /class\s+\w+|\bNoClassDef\b|Attribute:/,
  encapsulation: /self\.|_prioridad|Usuario\.|private|protegid/i,
  inheritance: /class\s+\w+\([^)]+\)|\bpass\b|@abstractmethod|Protocol/,
  polymorphism: /def\s+\w+\([^)]*\)|override|FunctionDef/i,
}

const pillarAstTokens = {
  abstraction: ['ClassDef', 'NoClassDef', 'Attribute'],
  encapsulation: ['Attribute', 'ClassAttributeMutation', 'self'],
  inheritance: ['ClassDef', 'Pass', 'abstract', 'override'],
  polymorphism: ['FunctionDef', 'override', 'DIT', 'Call'],
}

const buildEvidenceFor = (pillarId, evidence) => {
  const tokens = pillarAstTokens[pillarId] ?? []
  const filtered = evidence.astNodes.filter((node) => tokens.some((token) => node.includes(token)))
  const pattern = pillarEvidencePatterns[pillarId]
  const highlightLines = evidence.code
    .split('\n')
    .reduce((lines, line, index) => (pattern?.test(line) ? [...lines, index + 1] : lines), [])

  return {
    code: evidence.code,
    astNodes: filtered.length > 0 ? filtered : evidence.astNodes,
    highlightLines: highlightLines.length > 0 ? highlightLines : [1],
  }
}

const buildPillars = (seed) =>
  PILLARS.map((pillar) => {
    const criterion = pillarCriteria.find((item) => item.id === pillar.id)
    const score = seed.scores[pillar.id]
    const rawMetrics = seed.ck[pillar.id]
    return {
      id: pillar.id,
      name: pillar.name,
      description: pillar.description,
      score,
      level: levelFor(score, criterion.threshold),
      threshold: criterion.threshold,
      ckMetrics: Object.entries(rawMetrics).map(([key, value]) => ({
        id: key,
        label: ckLabels[key],
        value: value === null ? noCK : value,
        estimable: value !== null,
      })),
      sonarIndicators: seed.sonar,
      evidence: buildEvidenceFor(pillar.id, seed.evidence),
    }
  })

const buildSuggestions = (seed) => {
  const ranked = PILLARS.map((pillar) => ({ id: pillar.name, score: seed.scores[pillar.id] })).sort(
    (a, b) => a.score - b.score,
  )
  return {
    promptVersion: aiPrompts[0].version,
    items: [
      {
        id: `${seed.studentId}-a1`,
        pillar: ranked[0].id,
        title: 'Explorar la responsabilidad principal',
        detail:
          'Se sugiere explorar con el estudiante, en una conversación breve, qué responsabilidad cumple cada clase antes de escribir más código.',
        evidenceRef: seed.evidence.astNodes[0],
      },
      {
        id: `${seed.studentId}-a2`,
        pillar: ranked[1].id,
        title: 'Revisar una alternativa de acceso controlado',
        detail:
          'Como alternativa opcional de refuerzo, podría revisarse el fragmento repetido o el atributo expuesto y conversar sobre una versión con acceso controlado.',
        evidenceRef: seed.evidence.astNodes[1] ?? seed.evidence.astNodes[0],
      },
      {
        id: `${seed.studentId}-a3`,
        pillar: ranked[2].id,
        title: 'Proponer una pregunta de seguimiento',
        detail:
          'Se podría proponer la pregunta «¿qué ocurriría si apareciera un nuevo caso similar?» para aproximar el concepto de extensibilidad.',
        evidenceRef: seed.fileName,
      },
    ],
  }
}

const withReferences = (dimensions) =>
  dimensions.map((dimension) => ({
    ...dimension,
    reference: CT_REFERENCES[dimension.name] ?? CT_REFERENCES.Descomposición,
  }))

export const initialDiagnoses = seeds.map((seed) => ({
  id: `dia-${seed.studentId}`,
  studentId: seed.studentId,
  fileName: seed.fileName,
  analyzedAt: seed.analyzedAt,
  overallLevel: overallLevel(seed.scores),
  pillars: buildPillars(seed),
  aiSuggestions: buildSuggestions(seed),
  computationalThinking: {
    promptVersion: aiPrompts[1].version,
    dimensions: withReferences(seed.ct),
    citation:
      'Wing, J. M. (2006). Computational thinking. Communications of the ACM, 49(3), 33–35. https://doi.org/10.1145/1118178.1118215',
  },
}))

export const createDiagnosisFromUpload = ({ studentId, fileName }) => {
  const hash = [...fileName].reduce((total, char) => total + char.charCodeAt(0), 0)
  const scoreFor = (offset) => Math.min(0.9, 0.34 + ((hash + offset) % 49) / 100)
  const scores = {
    abstraction: scoreFor(3),
    encapsulation: scoreFor(17),
    inheritance: scoreFor(29),
    polymorphism: scoreFor(41),
  }
  const levelOf = (score) => {
    if (score < 0.55) return LEVELS.DEFICIENT
    if (score < 0.75) return LEVELS.IN_DEVELOPMENT
    return LEVELS.SATISFACTORY
  }
  const seed = {
    studentId,
    fileName,
    analyzedAt: new Date().toISOString().slice(0, 10),
    scores,
    ck: {
      abstraction: { wmc: 3, cbo: 2, rfc: 8, lcom: 0.42, dit: null, noc: null },
      encapsulation: { wmc: 3, cbo: 3, rfc: 7, lcom: 0.56, dit: null, noc: null },
      inheritance: {
        wmc: scores.inheritance < 0.55 ? null : 2,
        cbo: scores.inheritance < 0.55 ? null : 2,
        rfc: scores.inheritance < 0.55 ? null : 5,
        lcom: scores.inheritance < 0.55 ? null : 0.35,
        dit: scores.inheritance < 0.55 ? 0 : 1,
        noc: 0,
      },
      polymorphism: {
        wmc: 2,
        cbo: 2,
        rfc: 5,
        lcom: 0.38,
        dit: scores.polymorphism < 0.55 ? 0 : 1,
        noc: scores.polymorphism < 0.55 ? 0 : 1,
      },
    },
    sonar: [
      { name: 'Deuda técnica', value: '14 min', tone: 'warning' },
      { name: 'Duplicación', value: '3.6 %', tone: 'ok' },
      { name: 'Complejidad', value: 'Media', tone: 'warning' },
    ],
    evidence: {
      code: codeSamples.pedidos,
      astNodes: ['ClassDef: Solucion', 'FunctionDef: __init__', 'FunctionDef: procesar', 'Attribute: self.datos'],
    },
    ct: CT_DIMENSIONS.map((name, index) => ({
      name,
      level: levelOf(scores[['abstraction', 'encapsulation', 'inheritance', 'polymorphism'][index]]),
      evidence: `Indicio estructural inferido del archivo ${fileName} para ${name.toLowerCase()}.`,
    })),
  }
  return {
    id: `dia-${studentId}`,
    studentId,
    fileName,
    analyzedAt: seed.analyzedAt,
    overallLevel: overallLevel(scores),
    pillars: buildPillars(seed),
    aiSuggestions: buildSuggestions(seed),
    computationalThinking: {
      promptVersion: aiPrompts[1].version,
      dimensions: withReferences(seed.ct),
      citation:
        'Wing, J. M. (2006). Computational thinking. Communications of the ACM, 49(3), 33–35. https://doi.org/10.1145/1118178.1118215',
    },
  }
}
