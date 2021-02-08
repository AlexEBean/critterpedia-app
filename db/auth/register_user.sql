INSERT INTO users (username, email, profile_pic, password)
VALUES ($1, $2, $3, $4)
RETURNING *;