import { TemplatePort, TemplateInput } from '../ports/TemplatePort';
import { WorkOrderStatus } from '@modules/work-orders/domain/work-order-status.enum';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export class TemplateAdapter implements TemplatePort {
  private templates: Map<string, handlebars.TemplateDelegate> = new Map();

  constructor() {
    this.registerHelpers();
    this.loadTemplates();
  }

  private loadTemplates(): void {
    const templatesPath = path.join(__dirname, '../templates');

    try {
      const serviceOrderTemplate = fs.readFileSync(
        path.join(templatesPath, 'service-order-status-notification.html'),
        'utf-8',
      );

      this.templates.set(
        'service-order-status-notification',
        handlebars.compile(serviceOrderTemplate),
      );
    } catch (error) {
      console.error('Error loading email templates:', error);
      throw new Error('Failed to load email templates');
    }
  }

  private registerHelpers(): void {
    handlebars.registerHelper('formatDate', function (date: Date | string) {
      const d = new Date(date);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    });

    handlebars.registerHelper('formatCurrency', function (value: number) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    });

    handlebars.registerHelper('year', function () {
      return new Date().getFullYear();
    });
  }

  buildTemplate(input: TemplateInput): string {
    const template = this.templates.get(input.templateName);

    if (!template) {
      throw new Error(`Template not found: ${input.templateName}`);
    }

    try {
      return template(input.templateData);
    } catch (error) {
      throw new Error(`Failed to render template: ${input.templateName}`);
    }
  }
}
