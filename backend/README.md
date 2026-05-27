# SmartStock Backend (Spring Boot)

## O que é configurável

Tudo relevante para **subir o app em outro ambiente** passa por **YAML** (`application-*.yml`) ou por **variáveis de ambiente / `-D`** — sem alterar Java.

| Área | Onde | Variáveis comuns (Spring Boot) |
|------|------|--------------------------------|
| Porta HTTP | `server.port` | `SERVER_PORT` |
| JDBC URL | `spring.datasource.url` | `SPRING_DATASOURCE_URL` |
| Usuário / senha DB | `spring.datasource.*` | `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` |
| Pool Hikari | `spring.datasource.hikari.*` | `HIKARI_MAX_POOL_SIZE`, `HIKARI_MIN_IDLE`, `HIKARI_CONNECTION_TIMEOUT_MS` |
| DDL Hibernate | `spring.jpa.hibernate.ddl-auto` | `SPRING_JPA_HIBERNATE_DDL_AUTO` ou `JPA_DDL_AUTO` |
| Log SQL JPA | `spring.jpa.show-sql` | `JPA_SHOW_SQL` |
| **CORS** | `app.cors.*` | `APP_CORS_ORIGIN_1` … `APP_CORS_ORIGIN_4`, `APP_CORS_PATH_PATTERN`, `APP_CORS_ALLOW_CREDENTIALS` |
| Perfil ativo | `spring.profiles.active` | `SPRING_PROFILES_ACTIVE` |

Aliases usados no **perfil `dev`**: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (úteis quando você ainda não montou a URL JDBC completa).

Documentação oficial de *relaxed binding*:  
https://docs.spring.io/spring-boot/reference/features/external-config.html

## Perfis

| Perfil | Arquivo | Uso |
|--------|---------|-----|
| `dev` (padrão) | `application-dev.yml` | PostgreSQL local, `ddl-auto: update`, CORS com localhost. |
| `local` | `application-local.yml` (você cria; gitignored) | Senha / CORS da sua máquina — use junto: `dev,local`. |
| `prod` | `application-prod.yml` | Exige `SPRING_DATASOURCE_*` e **`APP_PUBLIC_FRONTEND_URL`** (CORS). |

## Migrações de banco (Flyway)

O projeto agora usa Flyway para versionar schema em `src/main/resources/db/migration`.

- Migração atual: `V1__create_app_users.sql`
- Ela cria a tabela `app_users` e garante o usuário:
  - e-mail: `admin@smartstock.com`
  - senha: `123456`

Com isso, o login não depende de criação manual de tabela.

### Exemplos

**Só dev (padrão):**

```powershell
mvn spring-boot:run
```

**Dev + local:**

```powershell
$env:SPRING_PROFILES_ACTIVE = "dev,local"
mvn spring-boot:run
```

**Produção (esqueleto):**

```powershell
$env:SPRING_PROFILES_ACTIVE = "prod"
$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://host:5432/smartjava"
$env:SPRING_DATASOURCE_USERNAME = "postgres"
$env:SPRING_DATASOURCE_PASSWORD = "..."
$env:APP_PUBLIC_FRONTEND_URL = "https://seu-front.com"
mvn spring-boot:run
```

## Banco `dev` padrão

- URL: `jdbc:postgresql://localhost:5433/smartjava`
- Usuário: `postgres`
- Senha default no YAML: `987123` (troque com `DB_PASSWORD` ou `application-local.yml`)

Crie o database `smartjava` antes do primeiro run.

## Front-end

O Next.js usa `NEXT_PUBLIC_API_URL` (ex.: `http://localhost:8081/api`). Se mudar `SERVER_PORT`, alinhe o front.

## Código

`app.cors` é mapeado por `CorsProperties` (`@ConfigurationProperties`). Qualquer propriedade adicional pode seguir o mesmo padrão.
