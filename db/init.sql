CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(250) NOT NULL,
    password VARCHAR(200) NOT NULL,
    profile_pic VARCHAR(2000) NOT NULL,
    register_date DATE DEFAULT CURRENT_DATE
);