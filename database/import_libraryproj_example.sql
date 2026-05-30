-- libraryproj.csv를 MySQL의 gs_books 테이블에 넣는 예시입니다.
-- 백엔드를 한 번 실행해서 JPA가 gs_books 테이블을 생성한 뒤 실행하세요.
-- 실제 CSV 절대경로는 본인 환경에 맞게 수정해야 합니다.

SET GLOBAL local_infile = 1;

TRUNCATE TABLE gs_books;

LOAD DATA LOCAL INFILE '/absolute/path/to/Library_System_final_realdata_ready/database/libraryproj.csv'
INTO TABLE gs_books
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, title, author, publisher, category, isbn, imageurl, @status, @reserved_by_user_id)
SET
  status = NULLIF(@status, ''),
  reserved_by_user_id = NULLIF(NULLIF(@reserved_by_user_id, ''), 'NULL');

SELECT COUNT(*) AS book_count FROM gs_books;
