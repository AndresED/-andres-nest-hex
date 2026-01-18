import * as fs from 'fs-extra';
import * as path from 'path';
import { ModuleEntity } from '../../domain/entities/module.entity';
import { ModuleRepository } from '../../domain/repositories/module.repository';
import { TemplateService } from '../../domain/services/template.service';
import { TemplateContext } from '../../domain/services/template.service';
import { OrmType } from '../../domain/value-objects/orm.type';

export class FileSystemModuleRepository extends ModuleRepository {
  constructor(private readonly templateService: TemplateService) {
    super();
  }

  async create(module: ModuleEntity): Promise<void> {
    if (await this.exists(module.projectPath, module.name)) {
      throw new Error(`Module ${module.name} already exists in project`);
    }

    // Detect ORM from project
    const orm = await this.detectOrm(module.projectPath);
    const projectName = path.basename(module.projectPath);

    const context: TemplateContext = {
      projectName,
      projectNamePascal: this.toPascalCase(projectName),
      moduleName: module.name,
      moduleNamePascal: this.toPascalCase(module.name),
      orm: orm || 'typeorm',
      database: 'postgres', // Default, could be read from config
    };

    await this.createModuleStructure(module.projectPath, module.name, context);
  }

  async exists(projectPath: string, moduleName: string): Promise<boolean> {
    const modulePath = path.join(projectPath, 'src', 'modules', moduleName);
    return await fs.pathExists(modulePath);
  }

  private async createModuleStructure(
    projectPath: string,
    moduleName: string,
    context: TemplateContext,
  ): Promise<void> {
    const modulePath = path.join(projectPath, 'src', 'modules', moduleName);

    const structure = [
      'domain',
      'domain/entities',
      'domain/repositories',
      'domain/value-objects',
      'application',
      'application/commands',
      'application/queries',
      'application/use-cases',
      'application/dtos',
      'infrastructure',
      'infrastructure/persistence',
      'infrastructure/presentation',
    ];

    for (const dir of structure) {
      await fs.ensureDir(path.join(modulePath, dir));
    }

    // Generate module files
    await this.generateFile(modulePath, 'module.module.ts', 'generic/module/module.module.ts', context);
    await this.generateFile(modulePath, 'domain/entities/index.ts', 'generic/module/entity.index.ts', context);
  }

  private async generateFile(
    modulePath: string,
    targetPath: string,
    templatePath: string,
    context: TemplateContext,
  ): Promise<void> {
    const fullTemplatePath = this.templateService.getTemplatePath(templatePath, context.orm);
    const content = this.templateService.renderTemplate(fullTemplatePath, context);
    const fullTargetPath = path.join(modulePath, targetPath);
    await fs.ensureDir(path.dirname(fullTargetPath));
    await fs.writeFile(fullTargetPath, content, 'utf-8');
  }

  private async detectOrm(projectPath: string): Promise<OrmType | null> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      if (packageJson.dependencies?.['@nestjs/typeorm'] || packageJson.dependencies?.typeorm) {
        return 'typeorm';
      }
      if (packageJson.dependencies?.['@prisma/client'] || packageJson.dependencies?.prisma) {
        return 'prisma';
      }
      if (packageJson.dependencies?.['@nestjs/mongoose'] || packageJson.dependencies?.mongoose) {
        return 'mongoose';
      }
    }
    return null;
  }

  private toPascalCase(str: string): string {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
}
