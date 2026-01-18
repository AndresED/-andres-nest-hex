import { OrmType } from '../value-objects/orm.type';

export interface TemplateContext {
  projectName: string;
  projectNamePascal: string;
  moduleName?: string;
  moduleNamePascal?: string;
  resourceName?: string;
  resourceNamePascal?: string;
  orm: OrmType;
  database: string;
  fields?: Array<{ name: string; type: string; required: boolean; unique?: boolean }>;
}

export abstract class TemplateService {
  abstract getTemplatePath(templateName: string, orm: OrmType): string;
  abstract renderTemplate(templatePath: string, context: TemplateContext): string;
  abstract getAvailableTemplates(orm: OrmType): string[];
}
