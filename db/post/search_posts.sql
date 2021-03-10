SELECT p.content, u.username, p.post_id, u.user_id
FROM posts p
JOIN users u 
ON p.user_id = u.user_id
WHERE LOWER(u.username) LIKE ('%' || LOWER($1) || '%') OR
    LOWER(p.content) LIKE ('%' || LOWER($1) || '%')
ORDER BY p.post_id DESC;