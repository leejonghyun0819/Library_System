package com.example.libraryprojectdemo.domain.book.dto;

import com.example.libraryprojectdemo.domain.book.entity.BookStatus;

public record BookResponse(
        Long id,
        String title,
        String author,
        BookStatus status,
        String publisher,
        String isbn,
        String imageUrl,
        Long reservedByUserId
) {
}
