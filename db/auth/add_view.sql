UPDATE views
SET view_count = view_count + 1
WHERE page = $1
RETURNING *;