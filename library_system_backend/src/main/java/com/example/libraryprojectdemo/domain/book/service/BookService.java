package com.example.libraryprojectdemo.domain.book.service;

import com.example.libraryprojectdemo.domain.book.dto.BookDTO;
import com.example.libraryprojectdemo.domain.book.entity.BookEntity;
import com.example.libraryprojectdemo.domain.book.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {
    private final BookRepository bookRepository;

    public List<BookDTO> searchByTitleOrAuthor(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "검색어를 입력해주세요.");
        }

        String keyword = query.trim();
        if (keyword.length() > 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "검색어가 너무 깁니다. 최대 50자까지 입력할 수 있습니다.");
        }

        List<BookEntity> books = bookRepository.searchIntegrated(keyword, PageRequest.of(0, 100));

        return books.stream().map(BookDTO::toBookDTO).toList();
    }
}
