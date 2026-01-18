export class ProjectEntity {
  constructor(
    public readonly name: string,
    public readonly orm: string,
    public readonly database: string,
    public readonly path: string,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Project name cannot be empty');
    }

    if (!/^[a-z0-9-]+$/.test(this.name)) {
      throw new Error('Project name must be in kebab-case');
    }

    if (!this.orm || !['typeorm', 'prisma', 'mongoose'].includes(this.orm)) {
      throw new Error('ORM must be one of: typeorm, prisma, mongoose');
    }

    if (!this.database || this.database.trim().length === 0) {
      throw new Error('Database type cannot be empty');
    }
  }
}
