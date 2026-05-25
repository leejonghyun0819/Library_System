package com.example.libraryprojectdemo.domain.book.dto;

import com.example.libraryprojectdemo.domain.book.entity.BookEntity;
import com.example.libraryprojectdemo.domain.book.entity.BookStatus;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BookDTO {

    private Long id;
    private String title;
    private String author;
    private String publisher;
    private String category;
    private String isbn;
    private String imageurl;
    private BookStatus status;
}
