package com.example.libraryprojectdemo.domain.book.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name="loans",
        indexes = {
                @Index(name="idx_loan_user", columnList = "user_id"),
                @Index(name="idx_loan_book", columnList = "book_id")
        })
public class LoanEntity {   // reservationEntity와 거의 유사한 형태
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="user_id", nullable=false)
    private Long userId;

    @Column(name="book_id", nullable=false)
    private Long bookId;

    @Column(nullable=false)
    private Instant borrowedAt = Instant.now();

    private Instant returnedAt;

    @Column(nullable=false)
    private boolean active = true;

    protected LoanEntity() {}

    public LoanEntity(Long userId, Long bookId) {
        this.userId = userId;
        this.bookId = bookId;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getBookId() { return bookId; }
    public Instant getBorrowedAt() { return borrowedAt; }
    public Instant getReturnedAt() { return returnedAt; }
    public boolean isActive() { return active; }

    public void markReturned() {
        this.active = false;
        this.returnedAt = Instant.now();
    }
}
