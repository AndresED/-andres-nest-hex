import inquirer from 'inquirer';

export interface ProjectPromptAnswers {
  name: string;
  orm: 'typeorm' | 'prisma' | 'mongoose';
  database: string;
  path?: string;
}

export interface ModulePromptAnswers {
  name: string;
  features: string[];
}

export interface ResourcePromptAnswers {
  name: string;
  moduleName: string;
  addFields?: boolean;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
    unique?: boolean;
  }>;
}

export class InteractivePromptService {
  async promptProject(): Promise<ProjectPromptAnswers> {
    const answers = await inquirer.prompt<ProjectPromptAnswers>([
      {
        type: 'input',
        name: 'name',
        message: 'Project name (kebab-case):',
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return 'Project name cannot be empty';
          }
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'Project name must be in kebab-case (lowercase letters, numbers, and hyphens only)';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'orm',
        message: 'Select ORM:',
        choices: [
          { name: 'TypeORM', value: 'typeorm' },
          { name: 'Prisma', value: 'prisma' },
          { name: 'Mongoose', value: 'mongoose' },
        ],
      },
      {
        type: 'input',
        name: 'database',
        message: 'Database type (e.g., postgres, mysql, mongodb):',
        default: 'postgres',
      },
      {
        type: 'input',
        name: 'path',
        message: 'Project path (leave empty for current directory):',
        default: process.cwd(),
      },
    ]);

    return answers;
  }

  async promptModule(): Promise<ModulePromptAnswers> {
    const answers = await inquirer.prompt<ModulePromptAnswers>([
      {
        type: 'input',
        name: 'name',
        message: 'Module name (kebab-case):',
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return 'Module name cannot be empty';
          }
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'Module name must be in kebab-case';
          }
          return true;
        },
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select features:',
        choices: [
          { name: 'CRUD Operations', value: 'crud' },
          { name: 'Validation', value: 'validation' },
          { name: 'Pagination', value: 'pagination' },
        ],
        default: ['crud'],
      },
    ]);

    return answers;
  }

  async promptResource(moduleNames: string[]): Promise<ResourcePromptAnswers> {
    const answers = await inquirer.prompt<ResourcePromptAnswers>([
      {
        type: 'input',
        name: 'name',
        message: 'Resource name (kebab-case):',
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return 'Resource name cannot be empty';
          }
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'Resource name must be in kebab-case';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'moduleName',
        message: 'Select module:',
        choices: moduleNames,
      },
      {
        type: 'confirm',
        name: 'addFields',
        message: 'Add fields to the resource?',
        default: true,
      },
    ]);

    const fields: Array<{ name: string; type: string; required: boolean; unique?: boolean }> = [];

    if (answers.addFields) {
      let addMore = true;
      while (addMore) {
        const fieldAnswers = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Field name (camelCase):',
            validate: (input: string) => {
              if (!input || input.trim().length === 0) {
                return 'Field name cannot be empty';
              }
              return true;
            },
          },
          {
            type: 'list',
            name: 'type',
            message: 'Field type:',
            choices: ['string', 'number', 'boolean', 'Date', 'uuid'],
          },
          {
            type: 'confirm',
            name: 'required',
            message: 'Is this field required?',
            default: true,
          },
          {
            type: 'confirm',
            name: 'unique',
            message: 'Is this field unique?',
            default: false,
          },
        ]);

        fields.push({
          name: fieldAnswers.name,
          type: fieldAnswers.type,
          required: fieldAnswers.required,
          unique: fieldAnswers.unique,
        });

        const { continueAdding } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continueAdding',
            message: 'Add another field?',
            default: true,
          },
        ]);

        addMore = continueAdding;
      }
    }

    return { ...answers, fields };
  }
}
