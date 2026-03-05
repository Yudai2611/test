CREATE TABLE user_profile_master (
  user_id varchar2(36) NOT NULL,
  username varchar2(100) DEFAULT NULL,
  first_name varchar2(36) DEFAULT NULL,
  last_name varchar2(36) DEFAULT NULL,
  company_code int NOT NULL,
  CONSTRAINT pk_users PRIMARY KEY (user_id)
);
CREATE TABLE post_master (
  post_id varchar2(36) NOT NULL,
  post_detail varchar2(100) DEFAULT NULL,
  post_file blob,
  created_by varchar2(36) DEFAULT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_posts PRIMARY KEY (post_id),
  CONSTRAINT fk_posts_created_by FOREIGN KEY (created_by) REFERENCES user_profile_master (user_id) ON DELETE CASCADE
);

CREATE TABLE comment_master (
  comment_id varchar2(36) NOT NULL,
  post_id varchar2(36),
  comment_text CLOB,
  created_by varchar2(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_comments PRIMARY KEY (comment_id),
  CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES post_master (post_id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (created_by) REFERENCES user_profile_master (user_id) ON DELETE CASCADE
);

INSERT INTO user_profile_master VALUES('ZZZ0648d-f0ce-44f0-aa76-0903ce47bc11', 'user', 'user', 'last', '15');
INSERT INTO user_profile_master VALUES('ZZZ0648d-f0ce-44f0-aa76-0903ce47bc12', 'dummy', 'dummy', 'dummy', '15');

COMMIT;