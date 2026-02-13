package com.example.libraryprojectdemo.domain.book.controller;

import com.example.libraryprojectdemo.domain.book.service.BookService;
import org.springframework.stereotype.Controller;

@Controller
public class BookController {
    private final BookService bookService;
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }




}
