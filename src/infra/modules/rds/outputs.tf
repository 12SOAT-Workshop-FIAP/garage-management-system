output "db_endpoint" {
  description = "Endpoint de conexão do banco de dados."
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "db_name" {
  description = "Nome do banco de dados."
  value       = aws_db_instance.main.db_name
}
