CREATE TABLE `user_profile_master` (
  `user_id` char(36) NOT NULL,
  `username` char(100) DEFAULT NULL,
  `first_name` char(36) DEFAULT NULL,
  `last_name` char(36) DEFAULT NULL,
  `company_code` int NOT NULL,
  PRIMARY KEY (`user_id`)
);

CREATE TABLE `post_master` (
  `post_id` char(36) NOT NULL,
  `post_detail` char(100) DEFAULT NULL,
  `post_file` blob,
  `created_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  KEY `post_ibfk_1` (`created_by`),
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user_profile_master` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE `comment_master` (
  `comment_id` char(36) NOT NULL,
  `post_id` char(36) DEFAULT NULL,
  `comment_text` text,
  `created_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `comment_ibfk_1` (`post_id`),
  KEY `comment_ibfk_2` (`created_by`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post_master` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `user_profile_master` (`user_id`) ON DELETE CASCADE
);

INSERT INTO user_profile_master VALUES('ZZZ0648d-f0ce-44f0-aa76-0903ce47bc11', 'user', 'user', 'last', '15');
INSERT INTO user_profile_master VALUES('ZZZ0648d-f0ce-44f0-aa76-0903ce47bc12', 'dummy', 'dummy', 'dummy', '15');


COMMIT;