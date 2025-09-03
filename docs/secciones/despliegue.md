# Despliegue - Infraestructura y DevOps de Caminando Online

[El sistema de despliegue es responsable de la infraestructura, automatización, monitoreo y escalabilidad de Caminando Online. Implementa CI/CD, contenedorización, orquestación y estrategias de alta disponibilidad para garantizar un servicio confiable y escalable.]

## 📁 Estructura

```
deployment/
├── docker/                 # Configuraciones Docker
│   ├── Dockerfile          # Dockerfile principal
│   ├── docker-compose.yml  # Desarrollo local
│   ├── docker-compose.prod.yml # Producción
│   ├── nginx/              # Configuración Nginx
│   │   ├── nginx.conf
│   │   ├── ssl.conf
│   │   └── sites-enabled/
│   └── scripts/            # Scripts de Docker
│       ├── build.sh
│       ├── deploy.sh
│       └── healthcheck.sh
├── kubernetes/             # Manifests Kubernetes
│   ├── base/               # Configuraciones base
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── configmap.yaml
│   │   └── secret.yaml
│   ├── overlays/           # Overlays por entorno
│   │   ├── development/
│   │   ├── staging/
│   │   └── production/
│   ├── ingress/            # Configuración Ingress
│   │   ├── ingress.yaml
│   │   └── cert-manager.yaml
│   └── monitoring/         # Monitoring con Prometheus
│       ├── prometheus.yaml
│       ├── grafana.yaml
│       └── alertmanager.yaml
├── ci-cd/                  # Pipelines CI/CD
│   ├── github-actions/     # GitHub Actions
│   │   ├── ci.yml          # Pipeline CI
│   │   ├── cd.yml          # Pipeline CD
│   │   ├── security.yml    # Security scanning
│   │   └── performance.yml # Performance testing
│   ├── jenkins/            # Alternativa Jenkins
│   │   ├── Jenkinsfile
│   │   └── pipelines/
│   └── scripts/            # Scripts de CI/CD
│       ├── build.sh
│       ├── test.sh
│       ├── deploy.sh
│       └── rollback.sh
├── infrastructure/         # Infraestructura como código
│   ├── terraform/          # Terraform configs
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── modules/
│   ├── ansible/            # Ansible playbooks
│   │   ├── playbooks/
│   │   ├── roles/
│   │   └── inventory/
│   └── cloudformation/     # AWS CloudFormation
│       ├── templates/
│       └── stacks/
├── monitoring/             # Sistema de monitoreo
│   ├── prometheus/         # Métricas
│   │   ├── prometheus.yml
│   │   ├── rules.yml
│   │   └── targets/
│   ├── grafana/            # Dashboards
│   │   ├── dashboards/
│   │   ├── datasources/
│   │   └── provisioning/
│   ├── elk/                # Logs (Elasticsearch, Logstash, Kibana)
│   │   ├── logstash.conf
│   │   ├── elasticsearch.yml
│   │   └── kibana.yml
│   ├── alerting/           # Alertas
│   │   ├── alertmanager.yml
│   │   └── rules/
│   └── scripts/            # Scripts de monitoreo
│       ├── healthcheck.sh
│       └── metrics.sh
├── security/               # Seguridad de infraestructura
│   ├── vault/              # Gestión de secretos
│   │   ├── policies/
│   │   └── secrets/
│   ├── firewall/           # Reglas de firewall
│   │   ├── iptables.rules
│   │   └── ufw.rules
│   ├── ssl/                # Certificados SSL
│   │   ├── certbot/
│   │   └── letsencrypt/
│   ├── waf/                # Web Application Firewall
│   │   ├── modsecurity/
│   │   └── cloudflare/
│   └── compliance/         # Cumplimiento normativo
│       ├── gdpr/
│       └── pci-dss/
├── backup/                 # Estrategias de respaldo
│   ├── database/           # Backup de base de datos
│   │   ├── scripts/
│   │   └── configs/
│   ├── files/              # Backup de archivos
│   │   ├── scripts/
│   │   └── configs/
│   ├── disaster-recovery/  # Recuperación de desastres
│   │   ├── runbooks/
│   │   └── tests/
│   └── automation/         # Automatización de backups
│       ├── cron/
│       └── scheduler/
├── performance/            # Optimización de rendimiento
│   ├── caching/            # Estrategias de cache
│   │   ├── redis/
│   │   ├── cdn/
│   │   └── browser/
│   ├── load-balancing/     # Balanceo de carga
│   │   ├── nginx/
│   │   ├── haproxy/
│   │   └── aws-elb/
│   ├── database/           # Optimización DB
│   │   ├── indexes/
│   │   ├── queries/
│   │   └── replication/
│   └── scaling/            # Escalado automático
│       ├── horizontal/
│       └── vertical/
├── environments/           # Configuraciones por entorno
│   ├── development/
│   ├── staging/
│   ├── production/
│   └── disaster-recovery/
├── scripts/                # Scripts de utilidad
│   ├── setup.sh            # Setup inicial
│   ├── deploy.sh           # Script de despliegue
│   ├── backup.sh           # Script de respaldo
│   ├── restore.sh          # Script de restauración
│   ├── monitoring.sh       # Script de monitoreo
│   └── maintenance.sh      # Script de mantenimiento
├── docs/                   # Documentación
│   ├── deployment.md       # Guía de despliegue
│   ├── infrastructure.md   # Arquitectura de infraestructura
│   ├── monitoring.md       # Guía de monitoreo
│   ├── security.md         # Guía de seguridad
│   └── troubleshooting.md  # Guía de resolución de problemas
├── tests/                  # Tests de infraestructura
│   ├── integration/        # Tests de integración
│   ├── performance/        # Tests de rendimiento
│   ├── security/           # Tests de seguridad
│   └── chaos/              # Tests de caos
├── package.json            # Dependencias
└── README.md               # Documentación principal
```

## 🎯 Funcionalidades Principales

- *Contenedorización*: Docker para empaquetado y despliegue consistente
- *Orquestación*: Kubernetes para gestión de contenedores en producción
- *CI/CD*: Pipelines automatizados para desarrollo y despliegue
- *Monitoreo*: Sistema completo de observabilidad con métricas y logs
- *Escalabilidad*: Auto-scaling horizontal y vertical
- *Alta Disponibilidad*: Arquitectura fault-tolerant con failover
- *Seguridad*: Configuraciones de seguridad a nivel de infraestructura
- *Backup y Recovery*: Estrategias de respaldo y recuperación de desastres
- *Performance*: Optimización de rendimiento y caching

## 🛠 Tecnologías Utilizadas

- *Docker*: Contenedorización de aplicaciones
- *Kubernetes*: Orquestación de contenedores
- *Terraform*: Infraestructura como código
- *GitHub Actions*: CI/CD pipelines
- *Prometheus*: Recolección de métricas
- *Grafana*: Visualización de métricas
- *ELK Stack*: Gestión de logs
- *Nginx*: Load balancer y reverse proxy
- *Redis*: Caching y sesiones
- *PostgreSQL*: Base de datos principal
- *MongoDB*: Base de datos NoSQL para scraping
- *AWS/GCP/Azure*: Proveedores de nube
- *Certbot*: Gestión automática de SSL
- *Vault*: Gestión de secretos

## Uso y Ejemplos

### Dockerfile Optimizado

```dockerfile
# deployment/docker/Dockerfile
# Multi-stage build para optimización
FROM node:18-alpine AS base

# Instalar dependencias del sistema
RUN apk add --no-cache \
    dumb-init \
    curl \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Etapa de desarrollo
FROM base AS development
ENV NODE_ENV=development
RUN npm ci && npm cache clean --force
COPY . .
EXPOSE 3000 9229
CMD ["dumb-init", "npm", "run", "dev"]

# Etapa de construcción
FROM base AS build
ENV NODE_ENV=production
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

# Instalar dependencias de producción
RUN apk add --no-cache \
    dumb-init \
    curl \
    && rm -rf /var/cache/apk/*

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copiar archivos necesarios desde etapas anteriores
COPY --from=build --chown=nextjs:nodejs /app/package*.json ./
COPY --from=build --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/next.config.js ./

# Cambiar a usuario no-root
USER nextjs

# Configurar puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Usar dumb-init para manejar señales correctamente
ENTRYPOINT ["dumb-init"]
CMD ["npm", "start"]
```

### Docker Compose para Desarrollo

```yaml
# deployment/docker/docker-compose.yml
version: '3.8'

services:
  # Base de datos PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: caminando-postgres
    environment:
      POSTGRES_DB: caminando_dev
      POSTGRES_USER: caminando_user
      POSTGRES_PASSWORD: caminando_pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - caminando-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U caminando_user -d caminando_dev"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Base de datos MongoDB
  mongodb:
    image: mongo:7-jammy
    container_name: caminando-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: caminando_dev
    volumes:
      - mongodb_data:/data/db
      - ./scripts/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
    ports:
      - "27017:27017"
    networks:
      - caminando-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis para caching
  redis:
    image: redis:7-alpine
    container_name: caminando-redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - caminando-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Aplicación principal
  app:
    build:
      context: ../..
      dockerfile: deployment/docker/Dockerfile
      target: development
    container_name: caminando-app
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://caminando_user:caminando_pass@postgres:5432/caminando_dev
      MONGODB_URL: mongodb://admin:password@mongodb:27017/caminando_dev
      REDIS_URL: redis://redis:6379
      JWT_SECRET: dev-jwt-secret-key
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: dev-nextauth-secret
    volumes:
      - ../..:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "3000:3000"
      - "9229:9229" # Debug port
    networks:
      - caminando-network
    depends_on:
      postgres:
        condition: service_healthy
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: npm run dev

  # Nginx como reverse proxy
  nginx:
    image: nginx:alpine
    container_name: caminando-nginx
    volumes:
      - ./nginx/nginx.dev.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/sites-enabled:/etc/nginx/sites-enabled:ro
    ports:
      - "80:80"
      - "443:443"
    networks:
      - caminando-network
    depends_on:
      - app
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Scraping service
  scraper:
    build:
      context: ../..
      dockerfile: deployment/docker/Dockerfile.scraper
    container_name: caminando-scraper
    environment:
      NODE_ENV: development
      MONGODB_URL: mongodb://admin:password@mongodb:27017/caminando_dev
      REDIS_URL: redis://redis:6379
      SCRAPING_INTERVAL: 3600000 # 1 hora
    volumes:
      - ../..:/app
      - /app/node_modules
    networks:
      - caminando-network
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: npm run scrape:dev

volumes:
  postgres_data:
  mongodb_data:
  redis_data:

networks:
  caminando-network:
    driver: bridge
```

### Configuración de Kubernetes

```yaml
# deployment/kubernetes/base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: caminando-app
  labels:
    app: caminando
    component: app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: caminando
      component: app
  template:
    metadata:
      labels:
        app: caminando
        component: app
    spec:
      containers:
      - name: app
        image: caminando/caminando-app:latest
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: caminando-secrets
              key: database-url
        - name: MONGODB_URL
          valueFrom:
            secretKeyRef:
              name: caminando-secrets
              key: mongodb-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: caminando-secrets
              key: redis-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: caminando-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /api/health
            port: http
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: tmp-volume
          mountPath: /tmp
      volumes:
      - name: tmp-volume
        emptyDir: {}
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchLabels:
                  app: caminando
                  component: app
              topologyKey: kubernetes.io/hostname
```

### Pipeline CI/CD con GitHub Actions

```yaml
# deployment/ci-cd/github-actions/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v4

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linting
      run: npm run lint

    - name: Run type checking
      run: npm run type-check

    - name: Run unit tests
      run: npm run test:unit
      env:
        CI: true

    - name: Run integration tests
      run: npm run test:integration
      env:
        CI: true
        DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
        MONGODB_URL: ${{ secrets.TEST_MONGODB_URL }}
        REDIS_URL: ${{ secrets.TEST_REDIS_URL }}

    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Run security audit
      run: npm audit --audit-level high

    - name: Run SAST with SonarCloud
      uses: SonarSource/sonarcloud-github-action@v2
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

    - name: Run container security scan
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'

    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v2
      if: always()
      with:
        sarif_file: 'trivy-results.sarif'

  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v4

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1

    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v2

    - name: Build and push Docker image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: caminando-app
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -f deployment/docker/Dockerfile -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker build -f deployment/docker/Dockerfile -t $ECR_REGISTRY/$ECR_REPOSITORY:latest .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

    - name: Generate deployment manifest
      run: |
        sed -i 's|IMAGE_TAG|${{ github.sha }}|g' deployment/kubernetes/overlays/production/deployment.yaml

    - name: Upload deployment artifacts
      uses: actions/upload-artifact@v4
      with:
        name: deployment-manifests
        path: deployment/kubernetes/
```

### Configuración de Monitoreo con Prometheus

```yaml
# deployment/monitoring/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'caminando-app'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 30s
    scrape_timeout: 10s

  - job_name: 'caminando-scraper'
    static_configs:
      - targets: ['scraper:3001']
    metrics_path: '/metrics'
    scrape_interval: 60s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']
    scrape_interval: 30s

  - job_name: 'mongodb'
    static_configs:
      - targets: ['mongodb:27017']
    scrape_interval: 30s

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
    scrape_interval: 30s

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:80']
    scrape_interval: 30s
```

### Terraform para Infraestructura

```hcl
# deployment/infrastructure/terraform/main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "caminando-terraform-state"
    key    = "infrastructure/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
module "vpc" {
  source = "./modules/vpc"

  name = "caminando-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = false

  tags = {
    Environment = var.environment
    Project     = "Caminando Online"
  }
}

# EKS Cluster
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "caminando-${var.environment}"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      desired_size = 3
      min_size     = 1
      max_size     = 10

      instance_types = ["t3.medium"]
      capacity_type  = "ON_DEMAND"
    }

    scraper = {
      desired_size = 2
      min_size     = 1
      max_size     = 5

      instance_types = ["t3.large"]
      capacity_type  = "ON_DEMAND"

      taints = [
        {
          key    = "dedicated"
          value  = "scraper"
          effect = "NO_SCHEDULE"
        }
      ]
    }
  }

  tags = {
    Environment = var.environment
    Project     = "Caminando Online"
  }
}

# RDS PostgreSQL
module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"

  identifier = "caminando-postgres-${var.environment}"

  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.t3.micro"
  allocated_storage = 20

  db_name  = "caminando"
  username = var.db_username
  password = var.db_password
  port     = "5432"

  vpc_security_group_ids = [aws_security_group.rds.id]
  subnet_ids             = module.vpc.private_subnets

  maintenance_window = "Mon:00:00-Mon:03:00"
  backup_window      = "03:00-06:00"

  backup_retention_period = 7
  skip_final_snapshot     = true

  tags = {
    Environment = var.environment
    Project     = "Caminando Online"
  }
}

# DocumentDB (MongoDB compatible)
module "documentdb" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "~> 8.0"

  name           = "caminando-docdb-${var.environment}"
  engine         = "docdb"
  engine_version = "5.0.0"
  instance_class = "db.t3.medium"

  instances = {
    one = {}
  }

  vpc_id               = module.vpc.vpc_id
  db_subnet_group_name = aws_db_subnet_group.documentdb.name
  security_group_rules = {
    vpc_ingress = {
      cidr_blocks = module.vpc.private_subnets_cidr_blocks
    }
  }

  master_username = var.docdb_username
  master_password = var.docdb_password

  skip_final_snapshot = true

  tags = {
    Environment = var.environment
    Project     = "Caminando Online"
  }
}

# ElastiCache Redis
module "redis" {
  source = "terraform-aws-modules/elasticache/aws"
  version = "~> 1.0"

  cluster_id      = "caminando-redis-${var.environment}"
  engine          = "redis"
  engine_version  = "7.0"
  node_type       = "cache.t3.micro"
  num_cache_nodes = 1

  subnet_ids         = module.vpc.private_subnets
  security_group_ids = [aws_security_group.redis.id]

  tags = {
    Environment = var.environment
    Project     = "Caminando Online"
  }
}

# S3 Bucket para archivos estáticos
module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 3.0"

  bucket = "caminando-static-${var.environment}"

  versioning = {
    enabled = true
  }

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = {
    Environment = var.environment
    Project     = "Caminando Online"
  }
}

# CloudFront Distribution
module "cloudfront" {
  source = "terraform-aws-modules/cloudfront/aws"
  version = "~> 3.0"

  aliases = ["caminando.online"]

  comment             = "Caminando Online CDN"
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100"
  retain_on_delete    = false
  wait_for_deployment = false

  create_origin_access_identity = true
  origin_access_identities = {
    s3_bucket_one = "Caminando Online S3"
  }

  origin = {
    s3 = {
      domain_name = module.s3_bucket.s3_bucket_bucket_regional_domain_name
      s3_origin_config = {
        origin_access_identity = "s3_bucket_one"
      }
    }
  }

  default_cache_behavior = {
    target_origin_id       = "s3"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods  = ["GET", "HEAD"]

    compress = true
    query_string = true
    cookies = {
      forward = "all"
    }
  }

  tags = {
    Environment = var.environment
    Project     = "Caminando Online"
  }
}
```

## 📋 Convenciones y Patrones

### Versionado de Imágenes Docker

```bash
# Patrón de versionado semántico
# major.minor.patch-build

# Ejemplos:
caminando/caminando-app:1.0.0
caminando/caminando-app:1.0.0-20231201
caminando/caminando-app:latest
caminando/caminando-app:main
```

### Estrategias de Despliegue

```yaml
# Blue-Green Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: caminando-app-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: caminando
      version: blue
  template:
    metadata:
      labels:
        app: caminando
        version: blue
    spec:
      containers:
      - name: app
        image: caminando/caminando-app:v2.0.0

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: caminando-app-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: caminando
      version: green
  template:
    metadata:
      labels:
        app: caminando
        version: green
    spec:
      containers:
      - name: app
        image: caminando/caminando-app:v2.1.0
```

### Gestión de Secretos

```bash
# Usar Vault para gestión de secretos
# Crear política para la aplicación
vault policy write caminando-app - <<EOF
path "secret/data/caminando/*" {
  capabilities = ["read"]
}
EOF

# Almacenar secretos
vault kv put secret/caminando/database \
  username="caminando_user" \
  password="secure_password" \
  host="postgres.internal"

# Acceder desde la aplicación
curl -H "X-Vault-Token: $VAULT_TOKEN" \
  $VAULT_ADDR/v1/secret/data/caminando/database
```

## 🔧 Configuración

### Variables de Entorno por Entorno

```env
# .env.development
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/caminando_dev
MONGODB_URL=mongodb://localhost:27017/caminando_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-jwt-secret
LOG_LEVEL=debug
SCRAPING_ENABLED=true
SCRAPING_INTERVAL=300000

# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@postgres.internal:5432/caminando_prod
MONGODB_URL=mongodb://user:pass@documentdb.internal:27017/caminando_prod
REDIS_URL=redis://redis.internal:6379
JWT_SECRET=${JWT_SECRET}
LOG_LEVEL=info
SCRAPING_ENABLED=true
SCRAPING_INTERVAL=3600000
```

### Configuración de Nginx

```nginx
# deployment/docker/nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;

    # Upstream servers
    upstream caminando_app {
        least_conn;
        server app:3000;
        server app:3001;
        server app:3002;
    }

    upstream caminando_scraper {
        server scraper:3001;
    }

    server {
        listen 80;
        server_name caminando.online www.caminando.online;

        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name caminando.online www.caminando.online;

        # SSL configuration
        ssl_certificate /etc/ssl/certs/caminando.crt;
        ssl_certificate_key /etc/ssl/private/caminando.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # API endpoints
        location /api/ {
            limit_req zone=api burst=20 nodelay;

            proxy_pass http://caminando_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;

            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Static files
        location /_next/static/ {
            proxy_pass http://caminando_app;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Main application
        location / {
            proxy_pass http://caminando_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## 🧪 Testing

### Tests de Infraestructura

```bash
# Tests de integración con Docker Compose
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Tests de carga con Artillery
artillery run load-test.yml

# Tests de infraestructura con Terratest
go test -v ./test/infrastructure/...

# Tests de chaos engineering con Chaos Mesh
kubectl apply -f chaos-experiments.yaml
```

### Monitoreo y Alertas

```yaml
# deployment/monitoring/prometheus/rules.yml
groups:
  - name: caminando.rules
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }}% which is above 5%"

      - alert: DatabaseConnectionPoolExhausted
        expr: db_connections_active / db_connections_max > 0.9
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "Database connection pool nearly exhausted"
          description: "Active connections: {{ $value }}"

      - alert: ScrapingServiceDown
        expr: up{job="caminando-scraper"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Scraping service is down"
          description: "Scraping service has been down for more than 1 minute"
```

## 📝 Notas Importantes

- *Escalabilidad*: Implementar auto-scaling basado en métricas de CPU y memoria
- *Backup*: Realizar backups automáticos diarios con retención de 30 días
- *Monitoreo*: Configurar alertas para downtime, errores y rendimiento
- *Seguridad*: Usar secrets management y actualizar dependencias regularmente
- *Performance*: Implementar CDN, caching y optimización de imágenes
- *Recuperación*: Tener plan de disaster recovery con RTO/RPO definidos
- *Costos*: Monitorear y optimizar costos de infraestructura en la nube

## 🔗 Referencias y Documentación

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Terraform Registry](https://registry.terraform.io/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [12-Factor App](https://12factor.net/)

## 🚧 Roadmap y TODOs

### Próximas Mejoras

- [ ] Implementar service mesh con Istio
- [ ] Agregar canary deployments
- [ ] Implementar distributed tracing con Jaeger
- [ ] Mejorar estrategias de caching con CDN
- [ ] Agregar backup cross-region
- [ ] Implementar zero-downtime deployments
- [ ] Agregar monitoring de costos
- [ ] Implementar auto-scaling basado en métricas custom

### Problemas Conocidos

- [ ] Optimización de costos en entornos de desarrollo - Prioridad: Media
- [ ] Mejora en tiempos de despliegue - Prioridad: Baja
- [ ] Implementación de backup testing automático - Prioridad: Alta
- [ ] Mejora en monitoreo de servicios de scraping - Prioridad: Media
- [ ] Optimización de imágenes Docker - Prioridad: Media
