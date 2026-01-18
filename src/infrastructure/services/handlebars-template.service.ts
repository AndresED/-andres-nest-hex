import * as fs from 'fs-extra';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { TemplateService, TemplateContext } from '../../domain/services/template.service';
import { OrmType } from '../../domain/value-objects/orm.type';

export class HandlebarsTemplateService extends TemplateService {
  private readonly templatesBasePath: string;

  constructor() {
    super();
    // Handle both development and production paths
    const isProduction = __filename.endsWith('.js');
    if (isProduction) {
      // In production, templates are in dist/templates
      this.templatesBasePath = path.join(__dirname, '../templates');
    } else {
      // In development, templates are in src/templates
      this.templatesBasePath = path.join(__dirname, '../../templates');
    }
  }

  getTemplatePath(templateName: string, orm: OrmType): string {
    // Try with .hbs extension first
    const templateNameWithExt = templateName.endsWith('.hbs') ? templateName : `${templateName}.hbs`;
    
    const ormPath = path.join(this.templatesBasePath, orm, templateNameWithExt);
    if (fs.pathExistsSync(ormPath)) {
      return ormPath;
    }

    // Fallback to generic template
    const genericPath = path.join(this.templatesBasePath, 'generic', templateNameWithExt);
    if (fs.pathExistsSync(genericPath)) {
      return genericPath;
    }

    throw new Error(`Template not found: ${templateName} for ORM: ${orm}`);
  }

  renderTemplate(templatePath: string, context: TemplateContext): string {
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    return template(context);
  }

  getAvailableTemplates(orm: OrmType): string[] {
    const ormPath = path.join(this.templatesBasePath, orm);
    if (!fs.pathExistsSync(ormPath)) {
      return [];
    }

    const files: string[] = [];
    const scanDir = (dir: string, baseDir: string = ''): void => {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          scanDir(fullPath, path.join(baseDir, entry));
        } else if (entry.endsWith('.hbs') || !entry.includes('.')) {
          const relativePath = path.join(baseDir, entry).replace(/\\/g, '/');
          files.push(relativePath);
        }
      }
    };

    scanDir(ormPath);
    return files;
  }
}
