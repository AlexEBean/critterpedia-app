UPDATE users
SET resetpasswordtoken = $1
WHERE email = $2
RETURNING *;