package com.example.libraryprojectdemo.domain.book.repository;

import com.example.libraryprojectdemo.domain.book.entity.BookEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<BookEntity, Long> {
    // 대소문자 무시
    List<BookEntity> findByTitleContainingOrAuthorContaining(String title, String author);
}
