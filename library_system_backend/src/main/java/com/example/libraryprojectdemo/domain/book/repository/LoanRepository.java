package com.example.libraryprojectdemo.domain.book.repository;

import com.example.libraryprojectdemo.domain.book.entity.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LoanRepository extends JpaRepository<LoanEntity, Long> {
    Optional<LoanEntity> findFirstByBookIdAndActiveTrue(Long bookId);
    Optional<LoanEntity> findFirstByBookIdAndUserIdAndActiveTrue(Long bookId, Long userId);
    List<LoanEntity> findByUserIdAndActiveTrueOrderByBorrowedAtDesc(Long userId);
    boolean existsByUserIdAndActiveTrue(Long userId);

    // 반납 완료된 기록까지 포함하여 도서별 누적 대출 횟수를 집계합니다.
    @Query("""
            select l.bookId, count(l)
            from LoanEntity l
            group by l.bookId
            """)
    List<Object[]> countLoansByBookId();
}

