export class ProjectNameValue {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Project name cannot be empty');
    }

    if (!/^[a-z0-9-]+$/.test(value)) {
      throw new Error('Project name must be in kebab-case (lowercase letters, numbers, and hyphens only)');
    }
  }

  static fromString(value: string): ProjectNameValue {
    return new ProjectNameValue(value);
  }

  toPascalCase(): string {
    return this.value
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
}
