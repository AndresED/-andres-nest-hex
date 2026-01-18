# nest-hex - Complete Documentation (English)

CLI tool that generates NestJS scaffolding using Hexagonal Architecture and CQRS patterns.

## Table of Contents

1. [Installation](#installation)
2. [System Requirements](#system-requirements)
3. [Getting Started](#getting-started)
4. [Commands Reference](#commands-reference)
5. [Interactive Mode](#interactive-mode)
6. [Flag-Based Mode](#flag-based-mode)
7. [Generated Project Structure](#generated-project-structure)
8. [Architecture Overview](#architecture-overview)
9. [Examples](#examples)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)

---

## Installation

### Global Installation (Recommended)

Install nest-hex globally to use it from anywhere:

```bash
npm install -g nest-hex
```

### Local Installation

You can also install it locally in your project:

```bash
npm install --save-dev nest-hex
```

Then use it with `npx`:

```bash
npx nest-hex new my-project
```

### Verify Installation

Check if nest-hex is installed correctly:

```bash
nest-hex --version
```

You should see the version number (e.g., `1.0.0`).

---

## System Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 (or yarn/pnpm equivalent)
- **Operating System**: Windows, macOS, or Linux
- **TypeScript**: Will be installed as a dependency in generated projects

---

## Getting Started

### 1. Create Your First Project

The simplest way to create a new project:

```bash
nest-hex new my-awesome-project
```

This will start an interactive session where you'll be prompted for:
- Project name (if not provided)
- ORM type (TypeORM, Prisma, or Mongoose)
- Database type (postgres, mysql, mongodb, etc.)
- Project path (defaults to current directory)

### 2. Navigate to Your Project

```bash
cd my-awesome-project
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run start:dev
```

Your NestJS application will be running on `http://localhost:3000`.

---

## Commands Reference

### `nest-hex new [project-name]`

Creates a new NestJS project with Hexagonal Architecture structure.

#### Options

- `--orm <orm>`: ORM type (typeorm, prisma, mongoose). Default: `typeorm`
- `--database <database>`: Database type (e.g., postgres, mysql, mongodb). Default: `postgres`
- `--path <path>`: Project path. Default: current working directory

#### Examples

**Flag-based mode:**
```bash
# Create project with TypeORM and PostgreSQL
nest-hex new my-project --orm typeorm --database postgres

# Create project with Prisma and MySQL
nest-hex new my-project --orm prisma --database mysql

# Create project with Mongoose and MongoDB
nest-hex new my-project --orm mongoose --database mongodb

# Specify custom path
nest-hex new my-project --orm typeorm --database postgres --path /path/to/projects
```

**Interactive mode:**
```bash
# Start interactive session
nest-hex new

# Or without project name
nest-hex new
```

#### Generated Files

When you create a new project, the following structure is generated:

```
my-project/
├── src/
│   ├── domain/              # Domain layer (entities, value objects)
│   ├── application/         # Application layer (use cases, commands, queries)
│   │   ├── commands/        # CQRS Commands
│   │   ├── queries/         # CQRS Queries
│   │   ├── use-cases/       # Business logic
│   │   └── dtos/            # Data Transfer Objects
│   ├── infrastructure/     # Infrastructure layer
│   │   ├── persistence/     # Database implementations
│   │   └── presentation/    # API controllers
│   ├── modules/             # Feature modules
│   ├── main.ts              # Application entry point
│   └── app.module.ts        # Root module
├── test/                    # Test files
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── nest-cli.json            # NestJS CLI configuration
├── .gitignore              # Git ignore rules
└── README.md                # Project documentation
```

---

### `nest-hex module [module-name]`

Generates a new feature module following Hexagonal Architecture.

#### Options

- `--project-path <path>`: Path to the NestJS project. Default: current directory
- `--features <features>`: Comma-separated list of features (e.g., `crud,validation,pagination`)

#### Examples

**Flag-based mode:**
```bash
# Create module in current directory
nest-hex module user-management --features crud,validation

# Create module in specific project
nest-hex module order-processing --project-path ./my-project --features crud,pagination
```

**Interactive mode:**
```bash
# Start interactive session
nest-hex module
```

#### Generated Module Structure

```
src/modules/user-management/
├── domain/
│   ├── entities/           # Domain entities
│   ├── repositories/       # Repository interfaces
│   └── value-objects/      # Value objects
├── application/
│   ├── commands/           # CQRS Commands
│   ├── queries/            # CQRS Queries
│   ├── use-cases/          # Use cases
│   └── dtos/               # DTOs
├── infrastructure/
│   ├── persistence/        # Repository implementations
│   └── presentation/       # Controllers
└── module.module.ts        # NestJS module definition
```

---

### `nest-hex resource [resource-name]`

Generates a complete CRUD resource with entity, repository, use cases, and controller.

#### Options

- `--project-path <path>`: Path to the NestJS project. Default: current directory
- `--module-name <name>`: Target module name (required in flag-based mode)

#### Examples

**Flag-based mode:**
```bash
# Create resource in a module
nest-hex resource product --module-name catalog --project-path ./my-project
```

**Interactive mode:**
```bash
# Start interactive session (will prompt for module selection)
nest-hex resource
```

#### Interactive Resource Creation

When using interactive mode, you'll be prompted to:

1. **Enter resource name** (kebab-case, e.g., `user-profile`)
2. **Select module** from existing modules in the project
3. **Add fields** to the resource entity:
   - Field name (camelCase)
   - Field type (string, number, boolean, Date, uuid)
   - Required flag
   - Unique flag

#### Generated Resource Files

For a resource named `product` in the `catalog` module:

```
src/modules/catalog/
├── domain/
│   ├── entities/
│   │   └── product.entity.ts          # Entity definition
│   └── repositories/
│       └── product.repository.ts      # Repository interface
├── application/
│   ├── commands/
│   │   ├── create-product.command.ts
│   │   ├── update-product.command.ts
│   │   └── delete-product.command.ts
│   ├── queries/
│   │   ├── get-product.query.ts
│   │   └── list-products.query.ts
│   ├── use-cases/
│   │   ├── create-product.use-case.ts
│   │   ├── update-product.use-case.ts
│   │   ├── delete-product.use-case.ts
│   │   ├── get-product.use-case.ts
│   │   └── list-products.use-case.ts
│   └── dtos/
│       └── product.dto.ts
└── infrastructure/
    ├── persistence/
    │   └── product.repository.ts      # Repository implementation
    └── presentation/
        └── product.controller.ts      # REST API controller
```

---

## Interactive Mode

Interactive mode is activated when you don't provide required arguments. The CLI will guide you through the process with prompts.

### Example: Creating a Project Interactively

```bash
$ nest-hex new

? Project name (kebab-case): my-awesome-api
? Select ORM: (Use arrow keys)
  ❯ TypeORM
    Prisma
    Mongoose
? Database type (e.g., postgres, mysql, mongodb): postgres
? Project path (leave empty for current directory): ./projects
```

### Example: Creating a Resource Interactively

```bash
$ nest-hex resource

? Resource name (kebab-case): user-profile
? Select module: (Use arrow keys)
  ❯ user-management
    order-processing
    catalog
? Add fields to the resource? (Y/n): Y
? Field name (camelCase): firstName
? Field type: (Use arrow keys)
  ❯ string
    number
    boolean
    Date
    uuid
? Is this field required? (Y/n): Y
? Is this field unique? (y/N): N
? Add another field? (Y/n): Y
...
```

---

## Flag-Based Mode

Flag-based mode allows you to provide all information via command-line arguments, making it ideal for automation and CI/CD pipelines.

### Complete Example

```bash
# Create project
nest-hex new e-commerce-api \
  --orm typeorm \
  --database postgres \
  --path ./projects

# Navigate to project
cd ./projects/e-commerce-api

# Install dependencies
npm install

# Create modules
nest-hex module user-management --features crud,validation
nest-hex module product-catalog --features crud,pagination
nest-hex module order-management --features crud

# Create resources
nest-hex resource user --module-name user-management
nest-hex resource product --module-name product-catalog
nest-hex resource order --module-name order-management
```

---

## Generated Project Structure

### Complete Directory Tree

```
my-project/
├── src/
│   ├── domain/                    # Domain Layer
│   │   ├── entities/             # Domain entities (business objects)
│   │   ├── repositories/         # Repository interfaces (ports)
│   │   ├── value-objects/        # Value objects
│   │   └── services/             # Domain services
│   │
│   ├── application/              # Application Layer
│   │   ├── commands/            # CQRS Commands (write operations)
│   │   ├── queries/             # CQRS Queries (read operations)
│   │   ├── use-cases/           # Application use cases
│   │   └── dtos/                # Data Transfer Objects
│   │
│   ├── infrastructure/           # Infrastructure Layer
│   │   ├── persistence/         # Database implementations
│   │   │   └── [orm-specific]/  # ORM-specific code
│   │   └── presentation/        # External interfaces
│   │       └── controllers/     # REST API controllers
│   │
│   ├── modules/                  # Feature Modules
│   │   └── [module-name]/       # Each module follows hexagonal structure
│   │       ├── domain/
│   │       ├── application/
│   │       └── infrastructure/
│   │
│   ├── main.ts                   # Application entry point
│   └── app.module.ts             # Root NestJS module
│
├── test/                         # Test files
│   ├── unit/                    # Unit tests
│   └── e2e/                     # End-to-end tests
│
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── nest-cli.json                 # NestJS CLI configuration
├── .gitignore                   # Git ignore rules
└── README.md                     # Project documentation
```

---

## Architecture Overview

### Hexagonal Architecture (Ports and Adapters)

nest-hex generates projects following Hexagonal Architecture principles, also known as Ports and Adapters pattern.

#### Layer Responsibilities

1. **Domain Layer** (Core)
   - Contains business logic and rules
   - Independent of frameworks and external dependencies
   - Defines entities, value objects, and repository interfaces (ports)
   - No dependencies on other layers

2. **Application Layer**
   - Contains use cases and application logic
   - Implements CQRS pattern (Commands and Queries separation)
   - Depends only on Domain layer
   - Coordinates domain objects to perform tasks

3. **Infrastructure Layer**
   - Implements adapters for external concerns
   - Database implementations (TypeORM, Prisma, Mongoose)
   - External API integrations
   - File system operations
   - Depends on Domain and Application layers

4. **Presentation Layer**
   - User interfaces (CLI, REST API, GraphQL)
   - Controllers and request handlers
   - Depends on Application layer

### CQRS Pattern

The generated code follows Command Query Responsibility Segregation (CQRS):

- **Commands**: Represent write operations (Create, Update, Delete)
- **Queries**: Represent read operations (Get, List)
- **Use Cases**: Separate handlers for commands and queries
- **Benefits**: Clear separation, scalability, and maintainability

### Example Flow

```
HTTP Request
    ↓
Controller (Presentation)
    ↓
Use Case (Application)
    ↓
Repository Interface (Domain)
    ↓
Repository Implementation (Infrastructure)
    ↓
Database
```

---

## Examples

### Example 1: E-Commerce API

```bash
# 1. Create project
nest-hex new e-commerce-api --orm typeorm --database postgres

cd e-commerce-api
npm install

# 2. Create modules
nest-hex module user-management
nest-hex module product-catalog
nest-hex module shopping-cart
nest-hex module order-processing

# 3. Create resources interactively
nest-hex resource
# Follow prompts to create: User, Product, CartItem, Order

# 4. Start development
npm run start:dev
```

### Example 2: Blog Platform

```bash
# Create project with Prisma
nest-hex new blog-platform --orm prisma --database postgres

cd blog-platform
npm install

# Create modules
nest-hex module content-management --features crud,validation
nest-hex module user-authentication --features crud
nest-hex module comments --features crud,pagination

# Create resources
nest-hex resource post --module-name content-management
nest-hex resource author --module-name content-management
nest-hex resource comment --module-name comments
```

### Example 3: Task Management System

```bash
# Create project
nest-hex new task-manager --orm mongoose --database mongodb

cd task-manager
npm install

# Create modules and resources
nest-hex module task-management
nest-hex resource task --module-name task-management
nest-hex resource project --module-name task-management
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Project already exists"

**Error:**
```
Error: Project already exists at /path/to/project
```

**Solution:**
- Choose a different project name
- Delete the existing directory
- Use a different path with `--path` option

#### Issue: "Module not found"

**Error:**
```
Error: No modules found in project. Create a module first.
```

**Solution:**
- Make sure you're in the correct project directory
- Create a module first: `nest-hex module my-module`
- Check that `src/modules/` directory exists

#### Issue: "Invalid project name"

**Error:**
```
Error: Project name must be in kebab-case
```

**Solution:**
- Use lowercase letters, numbers, and hyphens only
- Examples: `my-project`, `api-v2`, `user-service`
- Avoid: `MyProject`, `my_project`, `my project`

#### Issue: "Template not found"

**Error:**
```
Error: Template not found: template-name for ORM: typeorm
```

**Solution:**
- Reinstall nest-hex: `npm install -g nest-hex`
- Check that templates directory exists in installation
- Report issue if problem persists

#### Issue: "Permission denied"

**Error:**
```
Error: EACCES: permission denied
```

**Solution:**
- Use `sudo` on Linux/macOS (not recommended)
- Fix npm permissions: `npm config set prefix ~/.npm-global`
- Or use `npx` instead of global installation

---

## Best Practices

### 1. Naming Conventions

- **Projects**: Use kebab-case (e.g., `user-service`, `api-gateway`)
- **Modules**: Use kebab-case (e.g., `user-management`, `order-processing`)
- **Resources**: Use kebab-case (e.g., `user-profile`, `order-item`)
- **Files**: Use kebab-case for file names
- **Classes**: Use PascalCase (e.g., `UserEntity`, `CreateUserCommand`)

### 2. Project Organization

- Keep modules focused on a single business domain
- Use resources for entities that need CRUD operations
- Group related functionality in the same module
- Follow the hexagonal structure strictly

### 3. Development Workflow

1. **Create project** with appropriate ORM
2. **Create modules** for each business domain
3. **Create resources** for entities requiring CRUD
4. **Implement custom use cases** as needed
5. **Add infrastructure adapters** for external services

### 4. Testing

Generated projects include test setup. Always write tests for:
- Use cases (application logic)
- Repository implementations
- Controllers (integration tests)

### 5. ORM Selection

- **TypeORM**: Best for SQL databases, mature ecosystem
- **Prisma**: Modern, type-safe, great developer experience
- **Mongoose**: Required for MongoDB, schema validation

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

MIT License - see LICENSE file for details

---

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review examples in this guide

---

**Happy coding with nest-hex! 🚀**
