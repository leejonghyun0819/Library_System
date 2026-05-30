package com.example.libraryprojectdemo.domain.book.entity;

import com.example.libraryprojectdemo.domain.book.dto.BookDTO;
import jakarta.persistence.*;

@Entity
@Table(name = "gs_books")
public class BookEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false, length = 500)
    private String author;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookStatus status = BookStatus.AVAILABLE;

    @Column(length = 255)
    private String publisher;

    @Column(length = 100)
    private String category;

    @Column(length = 50)
    private String isbn;

    @Column(name = "imageurl", length = 500)
    private String imageurl;

    // RESERVED 상태일 때 예약자 유저 id를 보관합니다.
    // 복잡한 예약 대기열을 만들기 전, MVP 단계에서 상태를 단순하게 확인하기 위한 필드입니다.
    @Column(name = "reserved_by_user_id")
    private Long reservedByUserId;

    protected BookEntity() {
    }

    public BookEntity(String title, String author) {
        this.title = title;
        this.author = author;
    }

    public BookEntity(String title, String author, String publisher, String category, String isbn, String imageurl) {
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.category = category;
        this.isbn = isbn;
        this.imageurl = imageurl;
    }

    public static BookEntity toBookEntity(BookDTO bookDTO) {
        BookEntity bookEntity = new BookEntity(
                bookDTO.getTitle(),
                bookDTO.getAuthor(),
                bookDTO.getPublisher(),
                bookDTO.getCategory(),
                bookDTO.getIsbn(),
                bookDTO.getImageurl()
        );
        if (bookDTO.getStatus() != null) {
            bookEntity.status = bookDTO.getStatus();
        }
        return bookEntity;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public BookStatus getStatus() {
        return status;
    }

    public String getPublisher() {
        return publisher;
    }

    public String getCategory() {
        return category;
    }

    public String getIsbn() {
        return isbn;
    }

    public String getImageurl() {
        return imageurl;
    }

    public Long getReservedByUserId() {
        return reservedByUserId;
    }

    // 여러 가지 도서 상태 변경 함수
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
        this.reservedByUserId = null;
    }

    public void makeAvailable() {
        this.status = BookStatus.AVAILABLE;
        this.reservedByUserId = null;
    }
}
