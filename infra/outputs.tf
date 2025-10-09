output "eks_cluster_endpoint" {
  description = "Endpoint do servidor da API do Kubernetes para conexão via kubectl"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_name" {
  description = "Nome do cluster EKS criado"
  value       = module.eks.cluster_name
}

output "rds_db_endpoint" {
  description = "Endpoint de conexão do banco de dados RDS."
  value       = module.rds.db_endpoint
  sensitive   = true
}

output "ecr_repository_url" {
  description = "URL do repositorio ECR para as imagens Docker."
  value       = module.ecr.repository_url
}