-- ============================================
-- Global SCM 数据库建表脚本
-- MySQL 8.0+ / utf8mb4 / InnoDB
-- ============================================

CREATE DATABASE IF NOT EXISTS global_scm
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE global_scm;

-- ============================================
-- 1. 管理员账号
-- ============================================
DROP TABLE IF EXISTS admin_users;
CREATE TABLE admin_users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE COMMENT '登录用户名',
    password    VARCHAR(255) NOT NULL COMMENT 'BCrypt加密密码',
    real_name   VARCHAR(50)  COMMENT '真实姓名',
    role        VARCHAR(20)  NOT NULL DEFAULT 'admin' COMMENT '角色：admin / editor',
    status      TINYINT      NOT NULL DEFAULT 1 COMMENT '1启用 0禁用',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员账号';

-- ============================================
-- 2. 客户表单线索
-- ============================================
DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) COMMENT '姓名',
    company     VARCHAR(200) COMMENT '公司名称',
    email       VARCHAR(200) COMMENT '邮箱',
    phone       VARCHAR(50)  COMMENT '电话',
    message     TEXT         COMMENT '需求描述',
    source      VARCHAR(50)  DEFAULT 'website' COMMENT '来源：website / campaign / other',
    status      VARCHAR(20)  NOT NULL DEFAULT 'new' COMMENT 'new=新线索 / contacted=已联系 / qualified=有效 / invalid=无效',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户表单提交记录';

-- ============================================
-- 3. 回访记录
-- ============================================
DROP TABLE IF EXISTS follow_ups;
CREATE TABLE follow_ups (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    contact_id  BIGINT       NOT NULL COMMENT '关联 contacts.id',
    admin_id    BIGINT       COMMENT '跟进人 admin_users.id',
    content     TEXT         NOT NULL COMMENT '跟进内容',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户回访记录';

-- ============================================
-- 4. 新闻文章
-- ============================================
DROP TABLE IF EXISTS articles;
CREATE TABLE articles (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(300) NOT NULL COMMENT '中文标题',
    title_en      VARCHAR(300) COMMENT '英文标题',
    summary       VARCHAR(500) COMMENT '中文摘要',
    summary_en    VARCHAR(500) COMMENT '英文摘要',
    content       MEDIUMTEXT   COMMENT '中文正文（富文本HTML）',
    content_en    MEDIUMTEXT   COMMENT '英文正文',
    category      VARCHAR(50)  COMMENT '分类：贸易政策 / 物流 / 地缘 / 产业 / 技术',
    cover_img     VARCHAR(500) COMMENT '封面图 OSS URL',
    source        VARCHAR(200) COMMENT '原始来源',
    source_url    VARCHAR(500) COMMENT '原始链接',
    status        VARCHAR(20)  NOT NULL DEFAULT 'draft' COMMENT 'draft / published / archived',
    view_count    INT          DEFAULT 0 COMMENT '阅读数',
    published_at  DATETIME     COMMENT '发布时间',
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status_published (status, published_at),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='新闻文章';

-- ============================================
-- 5. 新闻标签
-- ============================================
DROP TABLE IF EXISTS article_tags;
CREATE TABLE article_tags (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id BIGINT       NOT NULL,
    tag_name   VARCHAR(50)  NOT NULL COMMENT '标签名',
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    INDEX idx_tag (tag_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章标签';

-- ============================================
-- 6. 全局配置
-- ============================================
DROP TABLE IF EXISTS site_configs;
CREATE TABLE site_configs (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key   VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT         COMMENT '配置值',
    description  VARCHAR(200) COMMENT '说明',
    updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='站点动态配置';

-- ============================================
-- 7. 上传文件记录
-- ============================================
DROP TABLE IF EXISTS upload_files;
CREATE TABLE upload_files (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    filename    VARCHAR(300) NOT NULL COMMENT '原始文件名',
    oss_url     VARCHAR(500) NOT NULL COMMENT 'OSS 访问地址',
    file_size   BIGINT       COMMENT '字节数',
    mime_type   VARCHAR(100) COMMENT '文件类型',
    uploaded_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='上传文件记录';

-- ============================================
-- 初始数据
-- ============================================

-- 默认管理员：admin / admin123（上线后立即修改密码）
INSERT INTO admin_users (username, password, real_name, role) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '超级管理员', 'admin');

-- 首页默认配置
INSERT INTO site_configs (config_key, config_value, description) VALUES
('home_enterprises',  '800+',       '服务企业数'),
('home_countries',    '50+',        '覆盖国家数'),
('home_orders_daily', '200,000+',   '日均订单处理量'),
('home_uptime',       '99.9%',      '系统可用率'),
('company_email',     'info@globalscm.com', '通知邮箱'),
('company_phone',     '',           '公司电话');
