DELETE
    FROM comments
    WHERE post_id IN 
        (SELECT post_id 
        FROM posts 
        WHERE user_id = $1);

DELETE FROM posts
WHERE user_id = $1;

DELETE FROM users
WHERE user_id = $1;