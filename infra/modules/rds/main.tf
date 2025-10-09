# Grupo de subnets para o RDS saber onde operar
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-subnet-group"
  subnet_ids = var.private_subnet_ids # Coloca o DB nas subnets privadas por segurança

  tags = {
    Name = "${var.project_name}-subnet-group"
  }
}

resource "aws_db_instance" "main" {
  engine              = "postgres"
  instance_class      = "db.t3.micro"
  storage_type        = "gp2"
  allocated_storage   = 10
  monitoring_interval = 0

  identifier             = "${lower(var.project_name)}-db"
  db_name                = lower(var.project_name)
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.rds_sg_id]

  # --- Configurações para ambiente de lab ---
  skip_final_snapshot = true  # Facilita a destruição do ambiente
  publicly_accessible = false # Garante que o DB não seja acessível pela internet
}
