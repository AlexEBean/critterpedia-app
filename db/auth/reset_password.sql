UPDATE users
SET password = $2
WHERE reset_password_token = $1
RETURNING *;