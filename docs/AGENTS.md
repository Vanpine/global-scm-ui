<!-- Generated: 2026-06-18T08:00:00Z -->
<!-- Parent: ../AGENTS.md -->

# docs — 数据库设计文档

## Role
Global SCM 官网的后端数据库设计层——MySQL 8.0 数据库的建表 Schema 和设计文档。当前为纯设计阶段，未实现后端服务。

## Key Abstractions
| Symbol | File | Kind | Description |
|--------|------|------|-------------|
| `global_scm` | schema.sql | database | 官方主数据库，使用 utf8mb4 字符集 |
| `admin_users` | schema.sql | table | 管理员用户表：id/username/password(BCrypt)/email/role/last_login/status |
| `contacts` | schema.sql | table | 客户咨询表：name/company/email/phone/role/challenge/source/status/ip |
| `follow_ups` | schema.sql | table | 跟进记录表：contact_id(FK)→contacts, admin_id(FK)→admin_users, type/notes/next_time |
| `articles` | schema.sql | table | 新闻/文章表：title/title_en/content/content_en/summary/cover/category/tags/keywords/status(draft→published→archived) |
| `article_tags` | schema.sql | table | 文章-标签关联表：article_id/name |
| `site_configs` | schema.sql | table | 站点配置表（key-value）：config_key/config_value/description |
| `upload_files` | schema.sql | table | 上传文件表：name/oss_url/mime/size/md5/uploader_id |

## Key Files
| File | Role | Description |
|------|------|-------------|
| database-design.md | 设计文档 | 7张表的结构定义、字段说明、表关系、初始数据规划、技术选型（MyBatis-Plus） |
| schema.sql | 建表DDL | 可执行SQL：CREATE DATABASE → DROP TABLE IF EXISTS × 7 → CREATE TABLE（含字段/外键/索引/注释）→ 种子数据INSERT |

## Conventions
- **数据库**: MySQL 8.0+ / InnoDB / utf8mb4 / utf8mb4_unicode_ci
- **ORM**: MyBatis-Plus（设计文档提及，无实际代码）
- **双语言**: articles 表标题/内容使用并排双字段（`title`/`title_en`, `content`/`content_en`）
- **密码**: BCrypt 加密，默认密码 `admin123`（上线前必须更换）
- **内容状态**: draft → published → archived 三态流程
- **文件存储**: OSS（阿里云对象存储），存 `oss_url` 而非本地路径
- **站点配置**: key-value 模式实现动态配置（如首页数字、通知邮箱）
- **schema.sql 幂等**: 所有表 `DROP TABLE IF EXISTS` + `CREATE TABLE`，适合重建不适合增量迁移

## For AI Agents
- **修改必须双写**: 改数据库结构时同步更新 `database-design.md` 和 `schema.sql` 两份文件
- **增量迁移**: schema.sql 是幂等重建脚本，不适合生产环境增量变更——需额外编写 migration SQL
- **安全注意**: 种子数据含 BCrypt 哈希的 `admin123` 默认密码，上线前更换
- **外键关系**: contacts → follow_ups, articles → article_tags——修改表结构注意外键约束

## Dependencies
- **Internal:** 无
- **External:** MySQL 8.0+

<!-- MANUAL:START -->
<!-- MANUAL:END -->
