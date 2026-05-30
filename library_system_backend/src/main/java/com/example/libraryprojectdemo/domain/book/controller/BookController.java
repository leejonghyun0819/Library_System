package com.example.libraryprojectdemo.domain.book.controller;

import com.example.libraryprojectdemo.domain.auth.SessionConst;
import com.example.libraryprojectdemo.domain.book.dto.BookDTO;
import com.example.libraryprojectdemo.domain.book.dto.BookRankingResponse;
import com.example.libraryprojectdemo.domain.book.dto.LoanResponse;
import com.example.libraryprojectdemo.domain.book.dto.ReservationResponse;
import com.example.libraryprojectdemo.domain.book.service.BookService;
import com.example.libraryprojectdemo.domain.book.service.LibraryService;
import com.example.libraryprojectdemo.global.exception.UnauthorizedException;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookService bookService;
    private final LibraryService libraryService;

    public BookController(BookService bookService, LibraryService libraryService) {
        this.bookService = bookService;
        this.libraryService = libraryService;
    }

    @GetMapping("/search")
    public List<BookDTO> searchBook(@RequestParam String query) {
        return bookService.searchByTitleOrAuthor(query);
    }

    @GetMapping("/popular")
    public List<BookRankingResponse> popularBooks(@RequestParam(defaultValue = "20") int limit) {
        return libraryService.popularBooks(limit);
    }

    @PostMapping("/{bookId}/reserve")
    public ReservationResponse reserve(@PathVariable Long bookId, HttpSession session) {
        return libraryService.reserve(bookId, getLoginUserId(session));
    }

    @DeleteMapping("/{bookId}/reserve")
    public ReservationResponse cancelReservation(@PathVariable Long bookId, HttpSession session) {
        return libraryService.cancelReservation(bookId, getLoginUserId(session));
    }

    @PostMapping("/{bookId}/borrow")
    public LoanResponse borrow(@PathVariable Long bookId, HttpSession session) {
        return libraryService.borrow(bookId, getLoginUserId(session));
    }

    @PostMapping("/{bookId}/return")
    public LoanResponse returnBook(@PathVariable Long bookId, HttpSession session) {
        return libraryService.returnBook(bookId, getLoginUserId(session));
    }

    @GetMapping("/me/loans")
    public List<LoanResponse> myLoans(HttpSession session) {
        return libraryService.myLoans(getLoginUserId(session));
    }

    @GetMapping("/me/reservations")
    public List<ReservationResponse> myReservations(HttpSession session) {
        return libraryService.myReservations(getLoginUserId(session));
    }

    private Long getLoginUserId(HttpSession session) {
        Object value = session.getAttribute(SessionConst.LOGIN_USER_ID);
        if (!(value instanceof Long userId)) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        }
        return userId;
    }
}
