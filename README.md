# nest-hex

CLI tool that generates NestJS scaffolding using Hexagonal Architecture and CQRS.

## 📚 Documentation

- **[English Documentation](README.en.md)** - Complete guide in English
- **[Documentación en Español](README.es.md)** - Guía completa en Español

## Quick Start

```bash
# Install globally
npm install -g nest-hex

# Create a new project
nest-hex new my-project --orm typeorm --database postgres
```

## Requirements

- Node.js >= 18.0.0
- TypeScript strict mode

## Architecture

This CLI follows Hexagonal Architecture principles:

- **Domain**: Core business logic and entities
- **Application**: Use cases, commands, and queries (CQRS)
- **Infrastructure**: External dependencies and implementations
- **Presentation**: CLI interface and user interaction

## License

MIT
