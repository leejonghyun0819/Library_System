package com.example.libraryprojectdemo.domain.book.controller;

import com.example.libraryprojectdemo.domain.book.dto.BookDTO;
import com.example.libraryprojectdemo.domain.book.service.BookService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookService bookService;
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // 책 검색
    @GetMapping("/search")
    public List<BookDTO> searchBook(@RequestParam String query) {   // parameter 이름 반드시 일치해야
        return bookService.searchByTitle(query);  // bookDto list 반환하도록
    }
}
