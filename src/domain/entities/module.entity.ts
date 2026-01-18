export class ModuleEntity {
  constructor(
    public readonly name: string,
    public readonly projectPath: string,
    public readonly features: string[] = [],
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Module name cannot be empty');
    }

    if (!/^[a-z0-9-]+$/.test(this.name)) {
      throw new Error('Module name must be in kebab-case');
    }

    if (!this.projectPath || this.projectPath.trim().length === 0) {
      throw new Error('Project path cannot be empty');
    }
  }
}
