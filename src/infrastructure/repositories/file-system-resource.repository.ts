import * as fs from 'fs-extra';
import * as path from 'path';
import { ResourceEntity } from '../../domain/entities/resource.entity';
import { ResourceRepository } from '../../domain/repositories/resource.repository';
import { TemplateService } from '../../domain/services/template.service';
import { TemplateContext } from '../../domain/services/template.service';
import { OrmType } from '../../domain/value-objects/orm.type';

export class FileSystemResourceRepository extends ResourceRepository {
  constructor(private readonly templateService: TemplateService) {
    super();
  }

  async create(resource: ResourceEntity): Promise<void> {
    if (await this.exists(resource.projectPath, resource.moduleName, resource.name)) {
      throw new Error(`Resource ${resource.name} already exists in module ${resource.moduleName}`);
    }

    const orm = await this.detectOrm(resource.projectPath);
    const projectName = path.basename(resource.projectPath);

    const context: TemplateContext = {
      projectName,
      projectNamePascal: this.toPascalCase(projectName),
      moduleName: resource.moduleName,
      moduleNamePascal: this.toPascalCase(resource.moduleName),
      resourceName: resource.name,
      resourceNamePascal: this.toPascalCase(resource.name),
      orm: orm || 'typeorm',
      database: 'postgres',
      fields: resource.fields,
    };

    await this.createResourceFiles(resource.projectPath, resource.moduleName, resource.name, context);
  }

  async exists(projectPath: string, moduleName: string, resourceName: string): Promise<boolean> {
    const entityPath = path.join(
      projectPath,
      'src',
      'modules',
      moduleName,
      'domain',
      'entities',
      `${resourceName}.entity.ts`,
    );
    return await fs.pathExists(entityPath);
  }

  private async createResourceFiles(
    projectPath: string,
    moduleName: string,
    resourceName: string,
    context: TemplateContext,
  ): Promise<void> {
    const modulePath = path.join(projectPath, 'src', 'modules', moduleName);

    // Generate entity
    await this.generateFile(
      modulePath,
      `domain/entities/${resourceName}.entity.ts`,
      `resource/entity.${context.orm}.ts`,
      context,
    );

    // Generate repository interface
    await this.generateFile(
      modulePath,
      `domain/repositories/${resourceName}.repository.ts`,
      'resource/repository.interface.ts',
      context,
    );

    // Generate repository implementation
    await this.generateFile(
      modulePath,
      `infrastructure/persistence/${resourceName}.repository.ts`,
      `resource/repository.${context.orm}.ts`,
      context,
    );

    // Generate commands
    await this.generateFile(
      modulePath,
      `application/commands/create-${resourceName}.command.ts`,
      'resource/create-command.ts',
      context,
    );
    await this.generateFile(
      modulePath,
      `application/commands/update-${resourceName}.command.ts`,
      'resource/update-command.ts',
      context,
    );
    await this.generateFile(
      modulePath,
      `application/commands/delete-${resourceName}.command.ts`,
      'resource/delete-command.ts',
      context,
    );

    // Generate queries
    await this.generateFile(
      modulePath,
      `application/queries/get-${resourceName}.query.ts`,
      'resource/get-query.ts',
      context,
    );
    await this.generateFile(
      modulePath,
      `application/queries/list-${resourceName}s.query.ts`,
      'resource/list-query.ts',
      context,
    );

    // Generate use cases
    await this.generateFile(
      modulePath,
      `application/use-cases/create-${resourceName}.use-case.ts`,
      'resource/create-use-case.ts',
      context,
    );
    await this.generateFile(
      modulePath,
      `application/use-cases/update-${resourceName}.use-case.ts`,
      'resource/update-use-case.ts',
      context,
    );
    await this.generateFile(
      modulePath,
      `application/use-cases/delete-${resourceName}.use-case.ts`,
      'resource/delete-use-case.ts',
      context,
    );
    await this.generateFile(
      modulePath,
      `application/use-cases/get-${resourceName}.use-case.ts`,
      'resource/get-use-case.ts',
      context,
    );
    await this.generateFile(
      modulePath,
      `application/use-cases/list-${resourceName}s.use-case.ts`,
      'resource/list-use-case.ts',
      context,
    );

    // Generate DTOs
    await this.generateFile(
      modulePath,
      `application/dtos/${resourceName}.dto.ts`,
      'resource/dto.ts',
      context,
    );

    // Generate controller
    await this.generateFile(
      modulePath,
      `infrastructure/presentation/${resourceName}.controller.ts`,
      'resource/controller.ts',
      context,
    );
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
