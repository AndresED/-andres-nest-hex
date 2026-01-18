import * as fs from 'fs-extra';
import * as path from 'path';
import { ProjectEntity } from '../../domain/entities/project.entity';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { ProjectStructure } from '../../application/use-cases/get-project-structure.use-case';
import { TemplateService } from '../../domain/services/template.service';
import { TemplateContext } from '../../domain/services/template.service';

export class FileSystemProjectRepository extends ProjectRepository {
  constructor(private readonly templateService: TemplateService) {
    super();
  }

  async create(project: ProjectEntity): Promise<void> {
    if (await this.exists(project.path)) {
      throw new Error(`Project already exists at ${project.path}`);
    }

    await fs.ensureDir(project.path);

    const context: TemplateContext = {
      projectName: project.name,
      projectNamePascal: this.toPascalCase(project.name),
      orm: project.orm as any,
      database: project.database,
    };

    // Create project structure
    await this.createProjectStructure(project.path, context);
  }

  async exists(path: string): Promise<boolean> {
    return await fs.pathExists(path);
  }

  async getStructure(projectPath: string): Promise<ProjectStructure> {
    const exists = await this.exists(projectPath);
    if (!exists) {
      return { exists: false, modules: [], resources: [] };
    }

    const modulesPath = path.join(projectPath, 'src', 'modules');
    const modules: string[] = [];
    const resources: Array<{ module: string; resources: string[] }> = [];

    if (await fs.pathExists(modulesPath)) {
      const moduleDirs = await fs.readdir(modulesPath);
      for (const moduleDir of moduleDirs) {
        const modulePath = path.join(modulesPath, moduleDir);
        const stat = await fs.stat(modulePath);
        if (stat.isDirectory()) {
          modules.push(moduleDir);
          const resourcesPath = path.join(modulePath, 'domain', 'entities');
          if (await fs.pathExists(resourcesPath)) {
            const resourceFiles = await fs.readdir(resourcesPath);
            const resourceNames = resourceFiles
              .filter(f => f.endsWith('.entity.ts'))
              .map(f => f.replace('.entity.ts', ''));
            resources.push({ module: moduleDir, resources: resourceNames });
          }
        }
      }
    }

    return { exists: true, modules, resources };
  }

  private async createProjectStructure(projectPath: string, context: TemplateContext): Promise<void> {
    const structure = [
      'src',
      'src/domain',
      'src/application',
      'src/application/commands',
      'src/application/queries',
      'src/application/use-cases',
      'src/infrastructure',
      'src/infrastructure/persistence',
      'src/infrastructure/presentation',
      'src/modules',
      'test',
    ];

    for (const dir of structure) {
      await fs.ensureDir(path.join(projectPath, dir));
    }

    // Generate files from templates
    await this.generateFile(projectPath, 'package.json', `${context.orm}/project/package.json`, context);
    await this.generateFile(projectPath, 'tsconfig.json', `${context.orm}/project/tsconfig.json`, context);
    await this.generateFile(projectPath, 'nest-cli.json', `${context.orm}/project/nest-cli.json`, context);
    await this.generateFile(projectPath, '.gitignore', 'generic/project/.gitignore', context);
    await this.generateFile(projectPath, 'README.md', 'generic/project/README.md', context);
    await this.generateFile(projectPath, 'src/main.ts', 'generic/project/main.ts', context);
    await this.generateFile(projectPath, 'src/app.module.ts', 'generic/project/app.module.ts', context);
  }

  private async generateFile(
    projectPath: string,
    targetPath: string,
    templatePath: string,
    context: TemplateContext,
  ): Promise<void> {
    const fullTemplatePath = this.templateService.getTemplatePath(templatePath, context.orm);
    const content = this.templateService.renderTemplate(fullTemplatePath, context);
    const fullTargetPath = path.join(projectPath, targetPath);
    await fs.ensureDir(path.dirname(fullTargetPath));
    await fs.writeFile(fullTargetPath, content, 'utf-8');
  }

  private toPascalCase(str: string): string {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
}
