- Seed Data Development
TRUNCATE TABLE user_service.users CASCADE;
TRUNCATE TABLE tracker_service.trackers CASCADE;

INSERT INTO user_service.users (id, username, email, password_hash)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'otaku_user', 'otaku@example.com', '$2a$10$7R.E.e11A2Z2z0R5vM9lUOaE9F2C7/E/0nJ3M9h3Y0Wk2h2M9O2G2'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'manga_reader', 'reader@example.com', '$2a$10$7R.E.e11A2Z2z0R5vM9lUOaE9F2C7/E/0nJ3M9h3Y0Wk2h2M9O2G2');

INSERT INTO tracker_service.trackers (user_id, media_type, mal_id, title, image_url, total, status, progress)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'anime', 20, 'Naruto', 'https://cdn.myanimelist.net/images/anime/13/11403.jpg', 220, 'Watching', 45),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'anime', 5114, 'Fullmetal Alchemist: Brotherhood', 'https://cdn.myanimelist.net/images/anime/1221/91661.jpg', 64, 'Completed', 64),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'manga', 13, 'One Piece', 'https://cdn.myanimelist.net/images/manga/2/253146.jpg', 0, 'Reading', 1080);