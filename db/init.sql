CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(250) NOT NULL,
    password VARCHAR(200) NOT NULL,
    profile_pic VARCHAR(2000) NOT NULL,
    register_date DATE DEFAULT CURRENT_DATE
);

ALTER TABLE users
ADD reset_password_token VARCHAR(2000) DEFAULT null;

CREATE TABLE posts(
    post_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    content VARCHAR(5000) NOT NULL
);

CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(post_id),
    comment VARCHAR(1000) NOT NULL
);