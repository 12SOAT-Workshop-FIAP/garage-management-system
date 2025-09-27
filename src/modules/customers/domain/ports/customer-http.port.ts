export interface CustomerHttpPort {
  findAll(): Promise<any[]>;
  findById(id: number): Promise<any>;
  findByDocument(document: string): Promise<any>;
  create(dto: any): Promise<any>;
  update(id: number, dto: any): Promise<any>;
  delete(id: number): Promise<void>;
}
