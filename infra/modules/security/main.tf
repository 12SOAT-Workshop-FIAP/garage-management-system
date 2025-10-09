resource "aws_security_group" "eks_nodes" {
  name        = "${var.project_name}-eks-nodes-sg"
  description = "Permite comunicacao para os worker nodes do EKS."
  vpc_id      = var.vpc_id

  # Regra de saída: permite que os nodes acessem a internet
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-eks-nodes-sg"
  }
}

# Security Group para o Banco de Dados RDS
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Permite acesso ao banco de dados RDS."
  vpc_id      = var.vpc_id

  # Regra de entrada: A REGRA MAIS IMPORTANTE!
  # Permite que SOMENTE os nodes do EKS acessem o banco na porta do PostgreSQL (5432)
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
  }

  # Regra de saída: permite que o RDS acesse a internet.
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}
