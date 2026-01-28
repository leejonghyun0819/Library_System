package com.example.libraryprojectdemo.entity;

import com.example.libraryprojectdemo.dto.BookDTO;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.awt.print.Book;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "gs_books")
public class BookEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String title;

    @Column
    private String author;

    @Column
    private String publisher;

    @Column
    private String category;

    @Column
    private String isbn;

    @Column
    private String imageurl;


    public static BookEntity toBookEntity(BookDTO bookDTO) {
        BookEntity bookEntity = new BookEntity();
        bookEntity.id = bookDTO.getId();
        bookEntity.title = bookDTO.getTitle();
        bookEntity.author = bookDTO.getAuthor();
        bookEntity.publisher = bookDTO.getPublisher();
        bookEntity.category = bookDTO.getCategory();
        bookEntity.isbn = bookDTO.getIsbn();
        bookEntity.imageurl = bookDTO.getImageurl();
        return bookEntity;
    }
}
