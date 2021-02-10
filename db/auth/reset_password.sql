UPDATE users
SET password = $2
WHERE resetpasswordtoken  = $1
RETURNING *;