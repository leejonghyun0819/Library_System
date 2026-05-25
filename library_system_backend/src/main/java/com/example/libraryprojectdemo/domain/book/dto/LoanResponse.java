package com.example.libraryprojectdemo.domain.book.dto;

import java.time.Instant;

public record LoanResponse(
        Long loanId,
        Long bookId,
        Long userId,
        Instant borrowedAt,
        Instant returnedAt,
        boolean active
) {
}
