# libraryproj.csv 실제 데이터 기반 점검

첨부된 `libraryproj.csv` 기준으로 현재 프로젝트 구조와의 적합성을 점검했다.

## CSV 구조

| 컬럼 | 예시 역할 | 현재 프로젝트 반영 여부 |
|---|---|---|
| id | 도서 PK | `BookEntity.id`와 매칭 가능 |
| title | 도서명 | `BookEntity.title`과 매칭 |
| author | 저자 | `BookEntity.author`와 매칭 |
| publisher | 출판사 | `BookEntity.publisher`와 매칭 |
| category | 분류 | `BookEntity.category`와 매칭 |
| isbn | ISBN | `BookEntity.isbn`과 매칭 |
| imageurl | 표지 이미지 URL | `BookEntity.imageurl`과 매칭, 프론트 검색 카드에 표시하도록 보완 |
| status | 도서 상태 | `BookStatus` enum과 매칭 |
| reserved_by_user_id | 예약자 ID | `reservedByUserId`와 매칭 가능 |

## 데이터 요약

- 총 도서 수: 15,816건
- id: 1번부터 15,816번까지 연속, 중복 없음
- status: 전체 `AVAILABLE`
- reserved_by_user_id: 전체 `NULL`
- 주요 카테고리:
  - 유아/어린이/청소년: 5,153건
  - 문학: 2,803건
  - 국어와외국어: 1,844건
  - 인문/사회: 1,630건
  - 자기관리: 1,313건
  - 비즈니스와경제: 1,242건
  - 가정과생활: 1,118건

## 잘 맞는 부분

1. 테이블명
   - 백엔드의 `BookEntity`는 `@Table(name = "gs_books")`를 사용한다.
   - CSV를 MySQL의 `gs_books` 테이블에 넣는 구조와 맞다.

2. 컬럼명
   - `reservedByUserId`는 JPA 기본 네이밍 전략에서 `reserved_by_user_id`로 매핑된다.
   - `imageurl`도 CSV 컬럼명과 동일하게 사용할 수 있다.

3. 도서 상태
   - CSV의 `AVAILABLE`은 `BookStatus.AVAILABLE`과 정확히 일치한다.

4. 검색 기능
   - 기존에는 제목/저자 검색만 가능했으나, 실제 CSV에는 출판사/분류/ISBN도 있으므로 이번 수정에서 통합검색 범위를 확장했다.

## 부족한 부분

1. 신착자료 구현용 날짜 컬럼 없음
   - 신착자료를 정확히 구현하려면 `registered_at`, `created_at`, `published_at` 같은 날짜 컬럼이 필요하다.

2. 인기순위 산출용 이용 이력 없음
   - CSV는 도서 기본 정보만 담고 있다.
   - 인기순위는 `loans`, `reservations` 같은 이용 이력 테이블이 쌓여야 계산할 수 있다.

3. 검색 결과가 많을 수 있음
   - 15,816건 규모에서는 검색어에 따라 결과가 많이 나올 수 있다.
   - 현재 API는 최대 100건만 반환하도록 제한했다.
   - 추후에는 페이지네이션이 더 좋다.

4. ISBN 중복 존재
   - CSV 기준 중복 ISBN이 존재한다.
   - 따라서 `isbn`에는 unique 제약을 걸면 안 된다.

## 결론

현재 백엔드의 핵심 도서 엔티티 구조는 첨부 CSV와 잘 맞는다.
다만 CSV는 “도서 기본 마스터 데이터”에 가깝기 때문에, 신착자료와 인기순위는 지금 데이터만으로는 완성하기 어렵다.
검색, 예약, 대출, 반납 MVP는 충분히 가능하며, 인기순위/신착자료는 추가 컬럼 또는 서비스 이용 이력이 필요하다.
