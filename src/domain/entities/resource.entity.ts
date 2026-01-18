export class ResourceEntity {
  constructor(
    public readonly name: string,
    public readonly moduleName: string,
    public readonly projectPath: string,
    public readonly fields: ResourceField[] = [],
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Resource name cannot be empty');
    }

    if (!/^[a-z0-9-]+$/.test(this.name)) {
      throw new Error('Resource name must be in kebab-case');
    }

    if (!this.moduleName || this.moduleName.trim().length === 0) {
      throw new Error('Module name cannot be empty');
    }

    if (!this.projectPath || this.projectPath.trim().length === 0) {
      throw new Error('Project path cannot be empty');
    }
  }
}

export interface ResourceField {
  name: string;
  type: string;
  required: boolean;
  unique?: boolean;
}
