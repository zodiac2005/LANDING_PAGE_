-- =========================================================
-- NOVA IT Company — Database Schema
-- Target: MySQL 8.0+
-- =========================================================

CREATE DATABASE IF NOT EXISTS it_company_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE it_company_db;

-- ─────────────────────────────────────────────
-- Table: contact_messages
-- Stores submissions from the site's contact form
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name   VARCHAR(150)  NOT NULL,
  email       VARCHAR(255)  NOT NULL,
  message     TEXT          NOT NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_messages_created_at (created_at),
  INDEX idx_contact_messages_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Table: services
-- Stores the IT services shown on the landing page
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(150)  NOT NULL,
  description  TEXT          NOT NULL,
  icon_key     VARCHAR(50)   NULL,        -- optional key to map to a frontend icon
  sort_order   INT UNSIGNED  NOT NULL DEFAULT 0,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed the 6 IT services
INSERT INTO services (title, description, icon_key, sort_order) VALUES
('هندسة البرمجيات',
 'تصميم وتطوير أنظمة برمجية مخصصة وقابلة للتوسع، تلبي احتياجات عملك بدقة وكفاءة عالية.',
 'software-engineering', 1),
('إدارة قواعد البيانات',
 'تصميم وتحسين وإدارة قواعد بيانات آمنة وعالية الأداء تدعم نمو أعمالك على المدى الطويل.',
 'database', 2),
('البنية التحتية السحابية',
 'نشر وإدارة بنية تحتية سحابية مرنة وقابلة للتوسع على AWS وAzure وGoogle Cloud.',
 'cloud', 3),
('الأمن السيبراني',
 'حماية أنظمتك وبياناتك من التهديدات السيبرانية عبر تدقيق أمني شامل وحلول استباقية.',
 'security', 4),
('تطبيقات الجوال',
 'تطوير تطبيقات جوال أصلية وهجينة بتجربة استخدام سلسة على أنظمة iOS وAndroid.',
 'mobile', 5),
('الاستشارات التقنية',
 'استشارات استراتيجية تساعد فريقك على اتخاذ القرارات التقنية الصحيحة ومواكبة التطور المستمر.',
 'consulting', 6);
