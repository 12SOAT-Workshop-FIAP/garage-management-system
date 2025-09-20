export type TemplateInput = {
  templateName: string;
  templateData: Record<string, unknown>;
};

export interface TemplatePort {
  buildTemplate(input: TemplateInput): string;
}
