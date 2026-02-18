package com.example.libraryprojectdemo.domain.book.dto;

import com.example.libraryprojectdemo.domain.book.entity.BookEntity;
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

    public static BookDTO toBookDTO(BookEntity bookEntity) {
        BookDTO bookDTO = new BookDTO();
        bookDTO.setId(bookEntity.getId());
        bookDTO.setTitle(bookEntity.getTitle());
        bookDTO.setAuthor(bookEntity.getAuthor());
        bookDTO.setPublisher(bookEntity.getPublisher());
        bookDTO.setCategory(bookEntity.getCategory());
        bookDTO.setIsbn(bookEntity.getIsbn());
        bookDTO.setImageurl(bookEntity.getImageurl());
        return bookDTO;
    }
}
