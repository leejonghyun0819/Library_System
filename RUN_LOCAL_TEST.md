# 로컬 테스트 가이드

이 프로젝트는 백엔드 Spring Boot, 프론트 Expo React Native, DB MySQL 기준입니다.

## 0. 압축 해제

```bash
unzip Library_System_final_realdata_ready.zip
cd Library_System_final_realdata_ready
```

폴더 구조:

```txt
library_system_backend/
library_system_frontend/
database/libraryproj.csv
database/import_libraryproj_example.sql
```

## 1. MySQL 준비

MySQL이 이미 설치되어 있으면 아래 SQL을 실행합니다.

```sql
CREATE DATABASE IF NOT EXISTS db_library
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'user_library'@'%' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON db_library.* TO 'user_library'@'%';
FLUSH PRIVILEGES;
```

MySQL 접속 예시:

```bash
mysql -u root -p
```

Docker로 MySQL을 띄우고 싶다면:

```bash
docker run --name library-mysql \
  -e MYSQL_ROOT_PASSWORD=root1234 \
  -e MYSQL_DATABASE=db_library \
  -e MYSQL_USER=user_library \
  -e MYSQL_PASSWORD=1234 \
  -p 3306:3306 \
  -d mysql:8.0
```

## 2. 백엔드 실행

```bash
cd library_system_backend
./gradlew bootRun
```

Windows PowerShell에서는:

```powershell
cd library_system_backend
.\gradlew.bat bootRun
```

정상 실행 확인:

```txt
Tomcat started on port 8080
Started LibraryProjectDemoApplication
```

브라우저에서 확인:

```txt
http://localhost:8080/api/health
```

정상 응답 예시:

```json
{"status":"OK","serverTime":"..."}
```

## 3. 실제 도서 데이터 적재

중요: 이번 최종 버전은 더 이상 샘플 도서를 자동 삽입하지 않습니다. 따라서 실제 CSV를 넣어야 검색 결과가 나옵니다.

먼저 백엔드를 한 번 실행해서 JPA가 `gs_books` 테이블을 만들게 합니다. 그 다음 MySQL에서 아래처럼 적재합니다.

### macOS/Linux 예시

```bash
mysql --local-infile=1 -u user_library -p db_library
```

```sql
SET GLOBAL local_infile = 1;
TRUNCATE TABLE gs_books;

LOAD DATA LOCAL INFILE '/절대경로/Library_System_final_realdata_ready/database/libraryproj.csv'
INTO TABLE gs_books
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, title, author, publisher, category, isbn, imageurl, @status, @reserved_by_user_id)
SET
  status = NULLIF(@status, ''),
  reserved_by_user_id = NULLIF(NULLIF(@reserved_by_user_id, ''), 'NULL');
```

### Windows 예시

```powershell
mysql --local-infile=1 -u user_library -p db_library
```

```sql
SET GLOBAL local_infile = 1;
TRUNCATE TABLE gs_books;

LOAD DATA LOCAL INFILE 'C:/Users/본인경로/Library_System_final_realdata_ready/database/libraryproj.csv'
INTO TABLE gs_books
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, title, author, publisher, category, isbn, imageurl, @status, @reserved_by_user_id)
SET
  status = NULLIF(@status, ''),
  reserved_by_user_id = NULLIF(NULLIF(@reserved_by_user_id, ''), 'NULL');
```

적재 확인:

```sql
SELECT COUNT(*) FROM gs_books;
SELECT id, title, author, status FROM gs_books LIMIT 5;
```

기대 결과: 약 15,816건

## 4. 프론트 실행

새 터미널에서 실행합니다.

```bash
cd library_system_frontend
npm install
npx expo start -c
```

브라우저 테스트:

```bash
npx expo start -c --web
```

휴대폰 Expo Go 테스트:

- PC와 휴대폰이 같은 Wi-Fi에 있어야 합니다.
- 백엔드는 `server.address=0.0.0.0`으로 열려 있습니다.
- 앱이 자동으로 Expo host IP를 추정해서 `http://PC_IP:8080`으로 붙습니다.
- 자동 연결이 안 되면 `library_system_frontend/.env` 파일을 만들고 아래처럼 지정하세요.

```env
EXPO_PUBLIC_API_BASE_URL=http://본인PC_IP:8080
```

예시:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.10:8080
```

그 뒤 다시 실행:

```bash
npx expo start -c
```

## 5. 실제 테스트 순서

### A. 서버 연결 확인

1. 설정 탭 이동
2. API 서버 주소 확인
3. 서버 상태가 정상인지 확인

### B. 회원가입/로그인

1. 프로필 탭 이동
2. 회원가입
3. 로그인
4. 닉네임이 표시되는지 확인

### C. 도서 검색

1. 홈 또는 통합자료검색 메뉴 이동
2. 검색어 입력

추천 검색어:

```txt
문학
우리글
과학
경제
어린이
```

검색 결과에 제목, 저자, 출판사, 분류, ISBN, 표지 이미지가 표시되는지 확인합니다.

### D. 예약/예약취소

1. 검색 결과에서 대출 가능 도서 선택
2. 예약 클릭
3. 도서 상태가 예약 중으로 바뀌는지 확인
4. 예약취소 클릭
5. 다시 대출 가능 상태가 되는지 확인

### E. 대출/반납

1. 검색 결과에서 대출 클릭
2. 프로필 탭 또는 도서이용정보 메뉴 이동
3. 대출 중인 도서가 표시되는지 확인
4. 반납하기 클릭
5. 대출 목록에서 사라지는지 확인
6. 다시 검색했을 때 도서 상태가 대출 가능으로 돌아왔는지 확인

### F. 인기순위

1. 한 권 이상 예약 또는 대출
2. 인기순위 메뉴 이동
3. 해당 도서가 순위에 표시되는지 확인

인기점수 기준:

```txt
대출 1회 = 2점
예약 1회 = 1점
```

## 6. 자주 나는 오류

### 백엔드가 DB 연결에 실패하는 경우

`application.yml` 기본값은 아래와 같습니다.

```yaml
DB_URL=jdbc:mysql://localhost:3306/db_library?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
DB_USERNAME=user_library
DB_PASSWORD=1234
```

DB 계정이 다르면 환경변수로 바꿔 실행하세요.

macOS/Linux:

```bash
export DB_USERNAME=root
export DB_PASSWORD=본인비밀번호
./gradlew bootRun
```

Windows PowerShell:

```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="본인비밀번호"
.\gradlew.bat bootRun
```

### 휴대폰에서 API 연결 실패

- PC와 휴대폰이 같은 Wi-Fi인지 확인
- Windows 방화벽에서 8080 포트 허용
- `.env`에 PC IP 직접 지정

### 검색 결과가 0건인 경우

- `gs_books` 적재 여부 확인

```sql
SELECT COUNT(*) FROM gs_books;
```

0이면 CSV 적재를 다시 실행해야 합니다.
