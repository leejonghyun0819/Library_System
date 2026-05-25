package com.example.libraryprojectdemo.domain.book.dto;

import java.time.Instant;

public record ReservationResponse(
        Long reservationId,
        Long bookId,
        Long userId,
        Instant createdAt,
        boolean active
) {
}