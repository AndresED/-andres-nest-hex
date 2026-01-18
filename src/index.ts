#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import { ProjectController } from './presentation/cli/project.controller';
import { ModuleController } from './presentation/cli/module.controller';
import { ResourceController } from './presentation/cli/resource.controller';
import { CreateProjectUseCase } from './application/use-cases/create-project.use-case';
import { CreateModuleUseCase } from './application/use-cases/create-module.use-case';
import { CreateResourceUseCase } from './application/use-cases/create-resource.use-case';
import { GetProjectStructureUseCase } from './application/use-cases/get-project-structure.use-case';
import { FileSystemProjectRepository } from './infrastructure/repositories/file-system-project.repository';
import { FileSystemModuleRepository } from './infrastructure/repositories/file-system-module.repository';
import { FileSystemResourceRepository } from './infrastructure/repositories/file-system-resource.repository';
import { HandlebarsTemplateService } from './infrastructure/services/handlebars-template.service';
import { InteractivePromptService } from './presentation/cli/interactive-prompt.service';

// Initialize dependencies
const templateService = new HandlebarsTemplateService();
const projectRepository = new FileSystemProjectRepository(templateService);
const moduleRepository = new FileSystemModuleRepository(templateService);
const resourceRepository = new FileSystemResourceRepository(templateService);

const createProjectUseCase = new CreateProjectUseCase(projectRepository);
const createModuleUseCase = new CreateModuleUseCase(moduleRepository);
const createResourceUseCase = new CreateResourceUseCase(resourceRepository);
const getProjectStructureUseCase = new GetProjectStructureUseCase(projectRepository);

const promptService = new InteractivePromptService();

const projectController = new ProjectController(createProjectUseCase, promptService);
const moduleController = new ModuleController(createModuleUseCase, promptService);
const resourceController = new ResourceController(
  createResourceUseCase,
  getProjectStructureUseCase,
  promptService,
);

// Setup CLI
const program = new Command();

program
  .name('nest-hex')
  .description('CLI tool that generates NestJS scaffolding using Hexagonal Architecture and CQRS')
  .version('1.0.0');

program
  .command('new')
  .description('Create a new NestJS project with Hexagonal Architecture')
  .argument('[project-name]', 'Project name (kebab-case)')
  .option('--orm <orm>', 'ORM type (typeorm, prisma, mongoose)', 'typeorm')
  .option('--database <database>', 'Database type (e.g., postgres, mysql, mongodb)', 'postgres')
  .option('--path <path>', 'Project path', process.cwd())
  .action(async (projectName?: string, options?: { orm?: string; database?: string; path?: string }) => {
    try {
      await projectController.createProject(projectName, options);
    } catch (error: any) {
      console.error(error.message);
      process.exit(1);
    }
  });

program
  .command('module')
  .description('Generate a new module')
  .argument('[module-name]', 'Module name (kebab-case)')
  .option('--project-path <path>', 'Project path', process.cwd())
  .option('--features <features>', 'Comma-separated list of features', '')
  .action(async (moduleName?: string, options?: { projectPath?: string; features?: string }) => {
    try {
      const projectPath = options?.projectPath || process.cwd();
      const features = options?.features ? options.features.split(',').map(f => f.trim()) : [];
      await moduleController.createModule(projectPath, moduleName, { features });
    } catch (error: any) {
      console.error(error.message);
      process.exit(1);
    }
  });

program
  .command('resource')
  .description('Generate a new resource (entity with CRUD)')
  .argument('[resource-name]', 'Resource name (kebab-case)')
  .option('--project-path <path>', 'Project path', process.cwd())
  .option('--module-name <name>', 'Module name')
  .action(async (resourceName?: string, options?: { projectPath?: string; moduleName?: string }) => {
    try {
      const projectPath = options?.projectPath || process.cwd();
      await resourceController.createResource(projectPath, resourceName, {
        moduleName: options?.moduleName,
      });
    } catch (error: any) {
      console.error(error.message);
      process.exit(1);
    }
  });

program.parse();
