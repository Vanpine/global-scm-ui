# 数据库设计文档 · Global SCM

## 技术选型

| 项 | 值 |
|----|-----|
| 数据库 | MySQL 8.0+ |
| 字符集 | utf8mb4 |
| 引擎 | InnoDB |
| ORM | MyBatis-Plus |

---

## 表概览

| 表名 | 用途 | 说明 |
|------|------|------|
| `admin_users` | 管理员账号 | 后台登录，BCrypt 加密 |
| `contacts` | 客户表单线索 | 前台联系表单提交记录 |
| `follow_ups` | 回访记录 | 关联联系人，记录每次跟进 |
| `articles` | 新闻文章 | 中英文双字段，富文本 |
| `article_tags` | 文章标签 | 多对多关联 |
| `site_configs` | 站点配置 | 首页数字、邮箱等动态配置 |
| `upload_files` | 上传文件 | OSS 文件记录 |

---

## 表结构

### 1. admin_users — 管理员账号

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 自增主键 |
| username | VARCHAR(50) UNIQUE | 登录用户名 |
| password | VARCHAR(255) | BCrypt 加密密码 |
| real_name | VARCHAR(50) | 真实姓名 |
| role | VARCHAR(20) | admin / editor |
| status | TINYINT | 1=启用，0=禁用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 2. contacts — 客户表单线索

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 自增主键 |
| name | VARCHAR(100) | 姓名 |
| company | VARCHAR(200) | 公司名称 |
| email | VARCHAR(200) | 邮箱 |
| phone | VARCHAR(50) | 电话 |
| message | TEXT | 需求描述 |
| source | VARCHAR(50) | 来源，默认 website |
| status | VARCHAR(20) | new / contacted / qualified / invalid |
| created_at | DATETIME | 提交时间 |
| updated_at | DATETIME | 更新时间 |

### 3. follow_ups — 回访记录

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 自增主键 |
| contact_id | BIGINT FK | 关联 contacts.id |
| admin_id | BIGINT | 跟进人，关联 admin_users.id |
| content | TEXT | 跟进内容 |
| created_at | DATETIME | 跟进时间 |

### 4. articles — 新闻文章

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 自增主键 |
| title | VARCHAR(300) | 中文标题 |
| title_en | VARCHAR(300) | 英文标题 |
| summary | VARCHAR(500) | 中文摘要 |
| summary_en | VARCHAR(500) | 英文摘要 |
| content | MEDIUMTEXT | 中文正文（富文本 HTML） |
| content_en | MEDIUMTEXT | 英文正文 |
| category | VARCHAR(50) | 贸易政策 / 物流 / 地缘 / 产业 / 技术 |
| cover_img | VARCHAR(500) | 封面图 OSS URL |
| source | VARCHAR(200) | 原始来源 |
| source_url | VARCHAR(500) | 原始链接 |
| status | VARCHAR(20) | draft / published / archived |
| view_count | INT | 阅读数 |
| published_at | DATETIME | 发布时间 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 5. article_tags — 文章标签

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 自增主键 |
| article_id | BIGINT FK | 关联 articles.id |
| tag_name | VARCHAR(50) | 标签名称 |

### 6. site_configs — 站点配置

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 自增主键 |
| config_key | VARCHAR(100) UNIQUE | 配置键 |
| config_value | TEXT | 配置值 |
| description | VARCHAR(200) | 配置说明 |
| updated_at | DATETIME | 更新时间 |

### 7. upload_files — 上传文件记录

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 自增主键 |
| filename | VARCHAR(300) | 原始文件名 |
| oss_url | VARCHAR(500) | OSS 访问地址 |
| file_size | BIGINT | 文件大小（字节） |
| mime_type | VARCHAR(100) | 文件类型 |
| uploaded_at | DATETIME | 上传时间 |

---

## 表关系

```
admin_users ──┐
              ├── follow_ups (contact_id, admin_id)
              │
contacts ─────┘

articles ───── article_tags (article_id)

site_configs  (独立)

upload_files  (独立)
```

---

## 初始数据

| 表 | 数据 |
|----|------|
| admin_users | admin / admin123（上线后改密码）|
| site_configs | 首页 4 个数字、通知邮箱、公司电话 |
