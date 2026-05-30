package com.example.libraryprojectdemo.domain.book.dto;

import com.example.libraryprojectdemo.domain.book.entity.BookStatus;
import java.time.Instant;

public record LoanResponse(
        Long loanId,
        Long bookId,
        Long userId,
        String bookTitle,
        String bookAuthor,
        BookStatus bookStatus,
        Instant borrowedAt,
        Instant returnedAt,
        boolean active
) {
}
