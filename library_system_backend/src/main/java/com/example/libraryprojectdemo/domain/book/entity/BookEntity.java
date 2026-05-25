package com.example.libraryprojectdemo.domain.book.entity;

import com.example.libraryprojectdemo.domain.book.dto.BookDTO;
import jakarta.persistence.*;

@Entity
@Table(name = "gs_books")
public class BookEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String title;

    @Column(nullable=false)
    private String author;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private BookStatus status = BookStatus.AVAILABLE;

    @Column
    private String publisher;

    @Column
    private String category;

    @Column
    private String isbn;

    @Column
    private String imageurl;

    // RESERVED 상태일 때 예약자(유저 id) 보관 (복잡도 줄이기 위한 최소 설계)
    private Long reservedByUserId;

    protected BookEntity() {}
    public BookEntity(String title, String author) {
        this.title = title;
        this.author = author;
    }

    // 여러 가지 함수
    public void reserve(Long userId) {
        this.status = BookStatus.RESERVED;
        this.reservedByUserId = userId;
    }

    public void clearReservation() {
        this.status = BookStatus.AVAILABLE;
        this.reservedByUserId = null;
    }

    public void borrow() {
        this.status = BookStatus.BORROWED;
    }

    public void makeAvailable() {
        this.status = BookStatus.AVAILABLE;
        this.reservedByUserId = null;
    }
}
