package com.example.libraryprojectdemo.domain.book.repository;

import com.example.libraryprojectdemo.domain.book.repository.*;
import com.example.libraryprojectdemo.domain.book.entity.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoanRepository extends JpaRepository<LoanEntity, Long> {
    Optional<LoanEntity> findFirstByBookIdAndActiveTrue(Long bookId);
    Optional<LoanEntity> findFirstByBookIdAndUserIdAndActiveTrue(Long bookId, Long userId);
}