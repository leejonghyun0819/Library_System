package com.example.libraryprojectdemo.domain.book.repository;

import com.example.libraryprojectdemo.domain.book.entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {
    Optional<ReservationEntity> findFirstByBookIdAndActiveTrue(Long bookId);
    Optional<ReservationEntity> findFirstByBookIdAndUserIdAndActiveTrue(Long bookId, Long userId);
    List<ReservationEntity> findByUserIdAndActiveTrueOrderByCreatedAtDesc(Long userId);
    boolean existsByUserIdAndActiveTrue(Long userId);

    // 취소된 예약까지 포함하여 도서별 누적 예약 횟수를 집계합니다.
    @Query("""
            select r.bookId, count(r)
            from ReservationEntity r
            group by r.bookId
            """)
    List<Object[]> countReservationsByBookId();
}

