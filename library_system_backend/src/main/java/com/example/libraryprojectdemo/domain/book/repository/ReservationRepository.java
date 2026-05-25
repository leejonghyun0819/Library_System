package com.example.libraryprojectdemo.domain.book.repository;

import com.example.libraryprojectdemo.domain.book.entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {
    Optional<ReservationEntity> findFirstByBookIdAndActiveTrue(Long bookId);
    Optional<ReservationEntity> findFirstByBookdIdAndUserIdAndActiveTrue(Long bookId, Long userId);
}
