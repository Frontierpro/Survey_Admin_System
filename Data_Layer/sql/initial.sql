CREATE DATABASE survey_admin_system;

USE survey_admin_system;

CREATE TABLE user_info (
    id VARCHAR(320),
    keyword VARCHAR(20)
);

CREATE TABLE survey_info (
    id VARCHAR(320),
    topic VARCHAR(40),
    id_require CHAR(1)
);

CREATE TABLE survey_question (
    id VARCHAR(320),
    topic VARCHAR(40),
    question_type CHAR(2),
    question_id INT,
    question_title VARCHAR(1000),
    pre_question_id INT,
    pre_answer_id INT
);

CREATE TABLE survey_option (
    id VARCHAR(320),
    topic VARCHAR(40),
    question_id INT,
    option_id INT,
    option_content VARCHAR(1000)
);

CREATE TABLE answer_info (
    id VARCHAR(320),
    topic VARCHAR(40),
    user_id VARCHAR(320),
    user_ip VARCHAR(15)
);

CREATE TABLE option_answer (
    id VARCHAR(320),
    topic VARCHAR(40),
    question_id INT,
    option_id INT,
    user_id VARCHAR(320),
    user_ip VARCHAR(15)
);

CREATE TABLE text_answer (
    id VARCHAR(320),
    topic VARCHAR(40),
    question_id INT,
    answer_text VARCHAR(2000),
    user_id VARCHAR(320),
    user_ip VARCHAR(15)
);
