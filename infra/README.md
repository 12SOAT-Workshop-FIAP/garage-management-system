# Infraestrutura como Código (IaC) - Projeto Garage Management System

Este diretório contém todo o código de Infraestrutura como Código (IaC) para o projeto, utilizando [Terraform](https://www.terraform.io/) para provisionar e gerenciar os recursos na nuvem da AWS.

O objetivo é criar um ambiente robusto, seguro e escalável para hospedar a aplicação, que consiste em um cluster Kubernetes e um banco de dados relacional.

## Arquitetura e Recursos Criados

A infraestrutura é modularizada para garantir reusabilidade e clareza. Os seguintes recursos são provisionados:

### 1. Rede (Módulo `vpc`)

A base da nossa infraestrutura, focada em segurança e alta disponibilidade.

- **VPC:** Uma rede virtual privada (`10.0.0.0/16`) para isolar nossos recursos.
- **Subnets:** Quatro subnets distribuídas em duas Zonas de Disponibilidade (`us-east-1a` e `us-east-1b`) para garantir resiliência a falhas:
  - **2 Subnets Públicas:** Para recursos que precisam de acesso à internet, como o NAT Gateway e futuros Load Balancers.
  - **2 Subnets Privadas:** Para recursos que devem permanecer isolados e seguros, como os nós do Kubernetes e o banco de dados.
- **Internet Gateway:** Permite que os recursos nas subnets públicas se comuniquem com a internet.
- **NAT Gateway:** Permite que os recursos nas subnets privadas (como os nós do EKS) iniciem conexões com a internet (ex: para baixar imagens Docker) sem serem expostos a conexões de entrada.
- **Route Tables:** Gerenciam o fluxo de tráfego, direcionando o tráfego das subnets privadas para o NAT Gateway e das públicas para o Internet Gateway.

### 2. Segurança (Módulo `security`)

Controla o tráfego entre os nossos recursos, atuando como um firewall virtual.

- **Security Group para EKS:** Um grupo para os nós de trabalho do Kubernetes, permitindo que eles se comuniquem livremente entre si e acessem a internet.
- **Security Group para RDS:** Um grupo para o banco de dados que é altamente restritivo. A regra principal permite acesso **apenas** na porta `5432` (PostgreSQL) e **somente** se a origem for o Security Group dos nós do EKS.

### 3. Cluster Kubernetes (Módulo `eks`)

O ambiente de orquestração de contêineres onde nossa aplicação será executada.

- **EKS Control Plane:** A camada de gerenciamento do Kubernetes, provisionada e mantida pela AWS.
- **EKS Node Group:** Um grupo de instâncias EC2 (`t3.medium`) que atuam como os nós de trabalho ("worker nodes") do cluster. Eles são provisionados nas subnets privadas para segurança.

### 4. Banco de Dados (Módulo `rds`)

Um serviço de banco de dados gerenciado para persistir os dados da aplicação.

- **Instância RDS:** Uma instância de banco de dados PostgreSQL (`db.t3.micro`).
- **Posicionamento Seguro:** A instância é criada dentro das subnets privadas, garantindo que ela não seja acessível diretamente pela internet.
- **DB Subnet Group:** Informa ao RDS em quais subnets privadas ele deve operar.

## Instruções para Provisionamento

Siga os passos abaixo para criar toda a infraestrutura na AWS.

### Pré-requisitos

1.  **Terraform CLI:** [Instalado](https://learn.hashicorp.com/tutorials/terraform/install-cli) na sua máquina.
2.  **AWS CLI:** [Instalado](https://aws.amazon.com/cli/) e [configurado](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) com as credenciais do ambiente AWS Academy. Execute `aws configure` e insira suas chaves de acesso.

### Passos para Execução

1.  **Navegue até o diretório:**

    ```bash
    cd infra
    ```

2.  **Crie o arquivo de variáveis:**
    Crie um arquivo chamado `terraform.tfvars` e adicione as credenciais do banco de dados.

    ```hcl
    # infra/terraform.tfvars

    db_username = "seu_usuario_aqui"
    db_password = "sua_senha_segura_aqui"
    ```

    _Este arquivo já está no `.gitignore` para evitar o envio de segredos para o repositório._

3.  **Inicialize o Terraform:**
    Este comando prepara o diretório e baixa os provedores necessários.

    ```bash
    terraform init
    ```

4.  **Planeje a Execução:**
    Este comando mostra todos os recursos que serão criados, sem aplicar nenhuma mudança. É um passo importante para revisão.

    ```bash
    terraform plan
    ```

5.  **Aplique a Configuração:**
    Este comando irá de fato criar todos os recursos na AWS. O processo pode levar de 15 a 20 minutos, principalmente por causa do EKS.
    ```bash
    terraform apply
    ```
    Digite `yes` quando solicitado para confirmar.

### Acesso Pós-Provisionamento

Após a conclusão do `apply`, siga estes passos para acessar o cluster:

1.  **Configure o `kubectl`:**

    ```bash
    aws eks update-kubeconfig --region us-east-1 --name garagemanagement
    ```

2.  **Verifique a Conexão:**
    ```bash
    kubectl get nodes
    ```
    Você deverá ver os nós do seu cluster com o status `Ready`.
