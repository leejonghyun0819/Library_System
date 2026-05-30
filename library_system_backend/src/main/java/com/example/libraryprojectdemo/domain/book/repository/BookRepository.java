package com.example.libraryprojectdemo.domain.book.repository;

import com.example.libraryprojectdemo.domain.book.entity.BookEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<BookEntity, Long> {
    // 실제 적재 데이터(libraryproj.csv)의 title, author, publisher, category, isbn 컬럼을 모두 활용하는 통합검색입니다.
    // 프론트는 배열 응답을 그대로 사용하므로, Pageable로 최대 반환 개수만 제한합니다.
    @Query("""
            select b
            from BookEntity b
            where lower(b.title) like lower(concat('%', :keyword, '%'))
               or lower(b.author) like lower(concat('%', :keyword, '%'))
               or lower(coalesce(b.publisher, '')) like lower(concat('%', :keyword, '%'))
               or lower(coalesce(b.category, '')) like lower(concat('%', :keyword, '%'))
               or lower(coalesce(b.isbn, '')) like lower(concat('%', :keyword, '%'))
            order by b.id asc
            """)
    List<BookEntity> searchIntegrated(@Param("keyword") String keyword, Pageable pageable);
}
