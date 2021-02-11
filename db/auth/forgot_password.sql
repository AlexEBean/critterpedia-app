UPDATE users
SET reset_password_token = $1
WHERE email = $2
RETURNING *;