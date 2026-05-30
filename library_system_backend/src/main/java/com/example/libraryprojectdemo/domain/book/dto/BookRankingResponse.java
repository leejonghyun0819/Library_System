package com.example.libraryprojectdemo.domain.book.dto;

import com.example.libraryprojectdemo.domain.book.entity.BookStatus;

public record BookRankingResponse(
        Long bookId,
        String title,
        String author,
        String publisher,
        String category,
        String isbn,
        String imageurl,
        BookStatus status,
        Long reservedByUserId,
        long loanCount,
        long reservationCount,
        long popularityScore
) {
}
