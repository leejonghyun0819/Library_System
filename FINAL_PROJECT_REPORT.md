# Library System 최종 정리 보고서

## 이번 최종 수정 내용

1. 백엔드 샘플 데이터 자동 삽입 제거
   - `DevDataLoader.java` 삭제
   - DB가 비어 있을 때 샘플 도서 4권이 자동 삽입되지 않도록 수정
   - 이제 도서 데이터는 실제 `database/libraryproj.csv`를 MySQL에 적재해서 사용

2. 백엔드 Thymeleaf 잔여 화면 제거
   - `HomeController.java` 삭제
   - `src/main/resources/templates/landingPage.html` 삭제
   - `src/main/resources/templates/searchPage.html` 삭제
   - `spring-boot-starter-thymeleaf` 의존성 제거
   - `application.yml`의 thymeleaf 설정 제거

3. 프론트 더미 화면 상태
   - 홈의 6개 메뉴는 유지
   - `신착자료`는 실제 데이터에 등록일/입고일/출간일 컬럼이 없어 제외 안내만 표시
   - 나머지 5개 메뉴는 실제 화면/API로 연결

4. 실제 데이터 포함
   - `database/libraryproj.csv` 포함
   - `database/import_libraryproj_example.sql`에 MySQL 적재 예시 포함

## 메뉴 구현 상태

| 메뉴 | 구현 상태 |
|---|---|
| 통합자료검색 | 실제 DB 검색 API 연결 |
| 신착자료 | 실제 데이터 컬럼 부족으로 제외 안내 |
| 기본정보 | 로그인 사용자 정보 조회/수정 API 연결 |
| 인기순위 | 대출/예약 이력 집계 API 연결 |
| 도서이용정보 | 내 대출/예약 목록 API 연결 |
| 이용안내 | 정적 안내 화면 |

## 핵심 API 연결 상태

| 기능 | API |
|---|---|
| 서버 상태 | `GET /api/health` |
| 도서 검색 | `GET /api/books/search?query=` |
| 인기순위 | `GET /api/books/popular?limit=` |
| 회원가입 | `POST /api/users` |
| 로그인 | `POST /api/auth/login` |
| 로그아웃 | `POST /api/auth/logout` |
| 내 정보 조회 | `GET /api/users/me` |
| 내 정보 수정 | `PATCH /api/users/me` |
| 예약 | `POST /api/books/{bookId}/reserve` |
| 예약취소 | `DELETE /api/books/{bookId}/reserve` |
| 대출 | `POST /api/books/{bookId}/borrow` |
| 반납 | `POST /api/books/{bookId}/return` |
| 내 대출 목록 | `GET /api/books/me/loans` |
| 내 예약 목록 | `GET /api/books/me/reservations` |

## 테스트 시 반드시 확인할 흐름

1. MySQL 실행
2. 백엔드 실행
3. `libraryproj.csv`를 `gs_books`에 적재
4. 프론트 실행
5. 회원가입
6. 로그인
7. 도서 검색
8. 예약
9. 예약취소
10. 대출
11. 프로필/도서이용정보에서 반납
12. 인기순위 반영 확인

## 현재 한계

- `신착자료`는 현재 CSV에 날짜 컬럼이 없어 실제 구현 제외
- 대출기한, 연체, 관리자 도서 등록/삭제, 예약 대기열은 아직 미구현
- 인기순위는 대출/예약 이력이 쌓인 뒤부터 표시됨
