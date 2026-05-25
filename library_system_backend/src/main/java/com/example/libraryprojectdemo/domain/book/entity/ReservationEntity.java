package com.example.libraryprojectdemo.domain.book.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name="reservations",
        indexes = {
                @Index(name="idx_reservation_user", columnList = "user_id"),
                @Index(name="idx_reservation_book", columnList = "book_id")
        })
public class ReservationEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name="user_id", nullable = false)
    private long userId;

    @Column(name="book_id", nullable = false)
    private long bookId;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private boolean active = true;

    protected ReservationEntity() {}
    public ReservationEntity(long userId, long bookId) {
        this.userId = userId;
        this.bookId = bookId;
    }

    public long getId() { return id; }
    public long getUserId() { return userId; }
    public long getBookId() { return bookId; }
    public Instant getCreatedAt() { return createdAt; }
    public boolean isActive() { return active; }

    public void cancel() { this.active = false; }
}
