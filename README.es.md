# nest-hex - Documentación Completa (Español)

Herramienta CLI que genera scaffolding de NestJS usando Arquitectura Hexagonal y patrones CQRS.

## Tabla de Contenidos

1. [Instalación](#instalación)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Primeros Pasos](#primeros-pasos)
4. [Referencia de Comandos](#referencia-de-comandos)
5. [Modo Interactivo](#modo-interactivo)
6. [Modo Basado en Flags](#modo-basado-en-flags)
7. [Estructura del Proyecto Generado](#estructura-del-proyecto-generado)
8. [Resumen de Arquitectura](#resumen-de-arquitectura)
9. [Ejemplos](#ejemplos)
10. [Solución de Problemas](#solución-de-problemas)
11. [Mejores Prácticas](#mejores-prácticas)

---

## Instalación

### Instalación Global (Recomendado)

Instala nest-hex globalmente para usarlo desde cualquier lugar:

```bash
npm install -g nest-hex
```

### Instalación Local

También puedes instalarlo localmente en tu proyecto:

```bash
npm install --save-dev nest-hex
```

Luego úsalo con `npx`:

```bash
npx nest-hex new mi-proyecto
```

### Verificar Instalación

Verifica si nest-hex está instalado correctamente:

```bash
nest-hex --version
```

Deberías ver el número de versión (ej: `1.0.0`).

---

## Requisitos del Sistema

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 (o yarn/pnpm equivalente)
- **Sistema Operativo**: Windows, macOS, o Linux
- **TypeScript**: Se instalará como dependencia en los proyectos generados

---

## Primeros Pasos

### 1. Crear Tu Primer Proyecto

La forma más simple de crear un nuevo proyecto:

```bash
nest-hex new mi-proyecto-awesome
```

Esto iniciará una sesión interactiva donde se te pedirá:
- Nombre del proyecto (si no se proporciona)
- Tipo de ORM (TypeORM, Prisma, o Mongoose)
- Tipo de base de datos (postgres, mysql, mongodb, etc.)
- Ruta del proyecto (por defecto: directorio actual)

### 2. Navegar a Tu Proyecto

```bash
cd mi-proyecto-awesome
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Iniciar Servidor de Desarrollo

```bash
npm run start:dev
```

Tu aplicación NestJS estará ejecutándose en `http://localhost:3000`.

---

## Referencia de Comandos

### `nest-hex new [nombre-proyecto]`

Crea un nuevo proyecto NestJS con estructura de Arquitectura Hexagonal.

#### Opciones

- `--orm <orm>`: Tipo de ORM (typeorm, prisma, mongoose). Por defecto: `typeorm`
- `--database <database>`: Tipo de base de datos (ej: postgres, mysql, mongodb). Por defecto: `postgres`
- `--path <path>`: Ruta del proyecto. Por defecto: directorio de trabajo actual

#### Ejemplos

**Modo basado en flags:**
```bash
# Crear proyecto con TypeORM y PostgreSQL
nest-hex new mi-proyecto --orm typeorm --database postgres

# Crear proyecto con Prisma y MySQL
nest-hex new mi-proyecto --orm prisma --database mysql

# Crear proyecto con Mongoose y MongoDB
nest-hex new mi-proyecto --orm mongoose --database mongodb

# Especificar ruta personalizada
nest-hex new mi-proyecto --orm typeorm --database postgres --path /ruta/a/proyectos
```

**Modo interactivo:**
```bash
# Iniciar sesión interactiva
nest-hex new

# O sin nombre de proyecto
nest-hex new
```

#### Archivos Generados

Cuando creas un nuevo proyecto, se genera la siguiente estructura:

```
mi-proyecto/
├── src/
│   ├── domain/              # Capa de Dominio (entidades, objetos de valor)
│   ├── application/         # Capa de Aplicación (casos de uso, comandos, consultas)
│   │   ├── commands/        # Comandos CQRS
│   │   ├── queries/         # Consultas CQRS
│   │   ├── use-cases/      # Lógica de negocio
│   │   └── dtos/            # Objetos de Transferencia de Datos
│   ├── infrastructure/      # Capa de Infraestructura
│   │   ├── persistence/     # Implementaciones de base de datos
│   │   └── presentation/    # Controladores API
│   ├── modules/             # Módulos de funcionalidad
│   ├── main.ts              # Punto de entrada de la aplicación
│   └── app.module.ts        # Módulo raíz
├── test/                    # Archivos de prueba
├── package.json             # Dependencias y scripts
├── tsconfig.json            # Configuración de TypeScript
├── nest-cli.json            # Configuración del CLI de NestJS
├── .gitignore              # Reglas de Git ignore
└── README.md                # Documentación del proyecto
```

---

### `nest-hex module [nombre-modulo]`

Genera un nuevo módulo de funcionalidad siguiendo Arquitectura Hexagonal.

#### Opciones

- `--project-path <path>`: Ruta al proyecto NestJS. Por defecto: directorio actual
- `--features <features>`: Lista separada por comas de características (ej: `crud,validation,pagination`)

#### Ejemplos

**Modo basado en flags:**
```bash
# Crear módulo en directorio actual
nest-hex module gestion-usuarios --features crud,validation

# Crear módulo en proyecto específico
nest-hex module procesamiento-pedidos --project-path ./mi-proyecto --features crud,pagination
```

**Modo interactivo:**
```bash
# Iniciar sesión interactiva
nest-hex module
```

#### Estructura del Módulo Generado

```
src/modules/gestion-usuarios/
├── domain/
│   ├── entities/           # Entidades de dominio
│   ├── repositories/       # Interfaces de repositorio
│   └── value-objects/      # Objetos de valor
├── application/
│   ├── commands/           # Comandos CQRS
│   ├── queries/            # Consultas CQRS
│   ├── use-cases/          # Casos de uso
│   └── dtos/               # DTOs
├── infrastructure/
│   ├── persistence/        # Implementaciones de repositorio
│   └── presentation/       # Controladores
└── module.module.ts        # Definición del módulo NestJS
```

---

### `nest-hex resource [nombre-recurso]`

Genera un recurso CRUD completo con entidad, repositorio, casos de uso y controlador.

#### Opciones

- `--project-path <path>`: Ruta al proyecto NestJS. Por defecto: directorio actual
- `--module-name <name>`: Nombre del módulo objetivo (requerido en modo basado en flags)

#### Ejemplos

**Modo basado en flags:**
```bash
# Crear recurso en un módulo
nest-hex resource producto --module-name catalogo --project-path ./mi-proyecto
```

**Modo interactivo:**
```bash
# Iniciar sesión interactiva (solicitará selección de módulo)
nest-hex resource
```

#### Creación Interactiva de Recursos

Cuando usas el modo interactivo, se te pedirá:

1. **Ingresar nombre del recurso** (kebab-case, ej: `perfil-usuario`)
2. **Seleccionar módulo** de los módulos existentes en el proyecto
3. **Agregar campos** a la entidad del recurso:
   - Nombre del campo (camelCase)
   - Tipo del campo (string, number, boolean, Date, uuid)
   - Flag de requerido
   - Flag de único

#### Archivos del Recurso Generado

Para un recurso llamado `producto` en el módulo `catalogo`:

```
src/modules/catalogo/
├── domain/
│   ├── entities/
│   │   └── producto.entity.ts          # Definición de entidad
│   └── repositories/
│       └── producto.repository.ts      # Interface de repositorio
├── application/
│   ├── commands/
│   │   ├── create-producto.command.ts
│   │   ├── update-producto.command.ts
│   │   └── delete-producto.command.ts
│   ├── queries/
│   │   ├── get-producto.query.ts
│   │   └── list-productos.query.ts
│   ├── use-cases/
│   │   ├── create-producto.use-case.ts
│   │   ├── update-producto.use-case.ts
│   │   ├── delete-producto.use-case.ts
│   │   ├── get-producto.use-case.ts
│   │   └── list-productos.use-case.ts
│   └── dtos/
│       └── producto.dto.ts
└── infrastructure/
    ├── persistence/
    │   └── producto.repository.ts      # Implementación del repositorio
    └── presentation/
        └── producto.controller.ts      # Controlador REST API
```

---

## Modo Interactivo

El modo interactivo se activa cuando no proporcionas los argumentos requeridos. El CLI te guiará a través del proceso con prompts.

### Ejemplo: Crear un Proyecto Interactivamente

```bash
$ nest-hex new

? Nombre del proyecto (kebab-case): mi-api-awesome
? Seleccionar ORM: (Usa las flechas)
  ❯ TypeORM
    Prisma
    Mongoose
? Tipo de base de datos (ej: postgres, mysql, mongodb): postgres
? Ruta del proyecto (dejar vacío para directorio actual): ./proyectos
```

### Ejemplo: Crear un Recurso Interactivamente

```bash
$ nest-hex resource

? Nombre del recurso (kebab-case): perfil-usuario
? Seleccionar módulo: (Usa las flechas)
  ❯ gestion-usuarios
    procesamiento-pedidos
    catalogo
? ¿Agregar campos al recurso? (S/n): S
? Nombre del campo (camelCase): nombre
? Tipo del campo: (Usa las flechas)
  ❯ string
    number
    boolean
    Date
    uuid
? ¿Este campo es requerido? (S/n): S
? ¿Este campo es único? (s/N): N
? ¿Agregar otro campo? (S/n): S
...
```

---

## Modo Basado en Flags

El modo basado en flags te permite proporcionar toda la información mediante argumentos de línea de comandos, ideal para automatización y pipelines CI/CD.

### Ejemplo Completo

```bash
# Crear proyecto
nest-hex new api-ecommerce \
  --orm typeorm \
  --database postgres \
  --path ./proyectos

# Navegar al proyecto
cd ./proyectos/api-ecommerce

# Instalar dependencias
npm install

# Crear módulos
nest-hex module gestion-usuarios --features crud,validation
nest-hex module catalogo-productos --features crud,pagination
nest-hex module gestion-pedidos --features crud

# Crear recursos
nest-hex resource usuario --module-name gestion-usuarios
nest-hex resource producto --module-name catalogo-productos
nest-hex resource pedido --module-name gestion-pedidos
```

---

## Estructura del Proyecto Generado

### Árbol de Directorios Completo

```
mi-proyecto/
├── src/
│   ├── domain/                    # Capa de Dominio
│   │   ├── entities/             # Entidades de dominio (objetos de negocio)
│   │   ├── repositories/         # Interfaces de repositorio (puertos)
│   │   ├── value-objects/        # Objetos de valor
│   │   └── services/             # Servicios de dominio
│   │
│   ├── application/              # Capa de Aplicación
│   │   ├── commands/            # Comandos CQRS (operaciones de escritura)
│   │   ├── queries/             # Consultas CQRS (operaciones de lectura)
│   │   ├── use-cases/           # Casos de uso de aplicación
│   │   └── dtos/                # Objetos de Transferencia de Datos
│   │
│   ├── infrastructure/           # Capa de Infraestructura
│   │   ├── persistence/         # Implementaciones de base de datos
│   │   │   └── [especifico-orm]/  # Código específico del ORM
│   │   └── presentation/        # Interfaces externas
│   │       └── controllers/     # Controladores REST API
│   │
│   ├── modules/                  # Módulos de Funcionalidad
│   │   └── [nombre-modulo]/       # Cada módulo sigue estructura hexagonal
│   │       ├── domain/
│   │       ├── application/
│   │       └── infrastructure/
│   │
│   ├── main.ts                   # Punto de entrada de la aplicación
│   └── app.module.ts             # Módulo raíz de NestJS
│
├── test/                         # Archivos de prueba
│   ├── unit/                    # Pruebas unitarias
│   └── e2e/                     # Pruebas end-to-end
│
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración de TypeScript
├── nest-cli.json                 # Configuración del CLI de NestJS
├── .gitignore                   # Reglas de Git ignore
└── README.md                     # Documentación del proyecto
```

---

## Resumen de Arquitectura

### Arquitectura Hexagonal (Puertos y Adaptadores)

nest-hex genera proyectos siguiendo los principios de Arquitectura Hexagonal, también conocida como patrón Puertos y Adaptadores.

#### Responsabilidades de las Capas

1. **Capa de Dominio** (Núcleo)
   - Contiene la lógica y reglas de negocio
   - Independiente de frameworks y dependencias externas
   - Define entidades, objetos de valor e interfaces de repositorio (puertos)
   - Sin dependencias de otras capas

2. **Capa de Aplicación**
   - Contiene casos de uso y lógica de aplicación
   - Implementa patrón CQRS (separación de Comandos y Consultas)
   - Depende solo de la capa de Dominio
   - Coordina objetos de dominio para realizar tareas

3. **Capa de Infraestructura**
   - Implementa adaptadores para preocupaciones externas
   - Implementaciones de base de datos (TypeORM, Prisma, Mongoose)
   - Integraciones con APIs externas
   - Operaciones del sistema de archivos
   - Depende de las capas de Dominio y Aplicación

4. **Capa de Presentación**
   - Interfaces de usuario (CLI, REST API, GraphQL)
   - Controladores y manejadores de peticiones
   - Depende de la capa de Aplicación

### Patrón CQRS

El código generado sigue Command Query Responsibility Segregation (CQRS):

- **Comandos**: Representan operaciones de escritura (Create, Update, Delete)
- **Consultas**: Representan operaciones de lectura (Get, List)
- **Casos de Uso**: Manejadores separados para comandos y consultas
- **Beneficios**: Separación clara, escalabilidad y mantenibilidad

### Flujo de Ejemplo

```
Petición HTTP
    ↓
Controlador (Presentación)
    ↓
Caso de Uso (Aplicación)
    ↓
Interface de Repositorio (Dominio)
    ↓
Implementación de Repositorio (Infraestructura)
    ↓
Base de Datos
```

---

## Ejemplos

### Ejemplo 1: API de E-Commerce

```bash
# 1. Crear proyecto
nest-hex new api-ecommerce --orm typeorm --database postgres

cd api-ecommerce
npm install

# 2. Crear módulos
nest-hex module gestion-usuarios
nest-hex module catalogo-productos
nest-hex module carrito-compras
nest-hex module procesamiento-pedidos

# 3. Crear recursos interactivamente
nest-hex resource
# Seguir los prompts para crear: Usuario, Producto, ItemCarrito, Pedido

# 4. Iniciar desarrollo
npm run start:dev
```

### Ejemplo 2: Plataforma de Blog

```bash
# Crear proyecto con Prisma
nest-hex new plataforma-blog --orm prisma --database postgres

cd plataforma-blog
npm install

# Crear módulos
nest-hex module gestion-contenido --features crud,validation
nest-hex module autenticacion-usuario --features crud
nest-hex module comentarios --features crud,pagination

# Crear recursos
nest-hex resource post --module-name gestion-contenido
nest-hex resource autor --module-name gestion-contenido
nest-hex resource comentario --module-name comentarios
```

### Ejemplo 3: Sistema de Gestión de Tareas

```bash
# Crear proyecto
nest-hex new gestor-tareas --orm mongoose --database mongodb

cd gestor-tareas
npm install

# Crear módulos y recursos
nest-hex module gestion-tareas
nest-hex resource tarea --module-name gestion-tareas
nest-hex resource proyecto --module-name gestion-tareas
```

---

## Solución de Problemas

### Problemas Comunes y Soluciones

#### Problema: "El proyecto ya existe"

**Error:**
```
Error: El proyecto ya existe en /ruta/a/proyecto
```

**Solución:**
- Elige un nombre de proyecto diferente
- Elimina el directorio existente
- Usa una ruta diferente con la opción `--path`

#### Problema: "Módulo no encontrado"

**Error:**
```
Error: No se encontraron módulos en el proyecto. Crea un módulo primero.
```

**Solución:**
- Asegúrate de estar en el directorio correcto del proyecto
- Crea un módulo primero: `nest-hex module mi-modulo`
- Verifica que el directorio `src/modules/` existe

#### Problema: "Nombre de proyecto inválido"

**Error:**
```
Error: El nombre del proyecto debe estar en kebab-case
```

**Solución:**
- Usa solo letras minúsculas, números y guiones
- Ejemplos: `mi-proyecto`, `api-v2`, `servicio-usuario`
- Evita: `MiProyecto`, `mi_proyecto`, `mi proyecto`

#### Problema: "Plantilla no encontrada"

**Error:**
```
Error: Plantilla no encontrada: nombre-plantilla para ORM: typeorm
```

**Solución:**
- Reinstala nest-hex: `npm install -g nest-hex`
- Verifica que el directorio de plantillas existe en la instalación
- Reporta el problema si persiste

#### Problema: "Permiso denegado"

**Error:**
```
Error: EACCES: permiso denegado
```

**Solución:**
- Usa `sudo` en Linux/macOS (no recomendado)
- Arregla permisos de npm: `npm config set prefix ~/.npm-global`
- O usa `npx` en lugar de instalación global

---

## Mejores Prácticas

### 1. Convenciones de Nomenclatura

- **Proyectos**: Usa kebab-case (ej: `servicio-usuario`, `api-gateway`)
- **Módulos**: Usa kebab-case (ej: `gestion-usuarios`, `procesamiento-pedidos`)
- **Recursos**: Usa kebab-case (ej: `perfil-usuario`, `item-pedido`)
- **Archivos**: Usa kebab-case para nombres de archivos
- **Clases**: Usa PascalCase (ej: `UserEntity`, `CreateUserCommand`)

### 2. Organización del Proyecto

- Mantén los módulos enfocados en un solo dominio de negocio
- Usa recursos para entidades que necesitan operaciones CRUD
- Agrupa funcionalidad relacionada en el mismo módulo
- Sigue la estructura hexagonal estrictamente

### 3. Flujo de Trabajo de Desarrollo

1. **Crear proyecto** con el ORM apropiado
2. **Crear módulos** para cada dominio de negocio
3. **Crear recursos** para entidades que requieren CRUD
4. **Implementar casos de uso personalizados** según sea necesario
5. **Agregar adaptadores de infraestructura** para servicios externos

### 4. Pruebas

Los proyectos generados incluyen configuración de pruebas. Siempre escribe pruebas para:
- Casos de uso (lógica de aplicación)
- Implementaciones de repositorio
- Controladores (pruebas de integración)

### 5. Selección de ORM

- **TypeORM**: Mejor para bases de datos SQL, ecosistema maduro
- **Prisma**: Moderno, type-safe, gran experiencia de desarrollador
- **Mongoose**: Requerido para MongoDB, validación de esquemas

---

## Contribuir

¡Las contribuciones son bienvenidas! Por favor lee nuestras guías de contribución antes de enviar pull requests.

## Licencia

Licencia MIT - ver archivo LICENSE para detalles

---

## Soporte

Para problemas, preguntas o contribuciones:
- Abre un issue en GitHub
- Revisa la documentación existente
- Revisa los ejemplos en esta guía

---

**¡Feliz codificación con nest-hex! 🚀**
