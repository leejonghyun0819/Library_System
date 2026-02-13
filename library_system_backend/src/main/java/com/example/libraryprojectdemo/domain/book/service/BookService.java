package com.example.libraryprojectdemo.domain.book.service;

import com.example.libraryprojectdemo.domain.book.dto.BookDTO;
import com.example.libraryprojectdemo.domain.book.entity.BookEntity;
import com.example.libraryprojectdemo.domain.book.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public List<BookDTO> searchByTitle(String query) {
        // 검색어 전처리, 예외처리
        if (query==null||query.trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "검색어를 입력해주세요"); }
        String keyword = query.trim().toLowerCase();
        if (keyword.length()>20) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "검색어가 너무 깁니다 (최대 20자)"
            ); }

        // db에서 책 조회
        List<BookEntity> bookEntityList = bookRepository.findByTitleContainingOrAuthorContaining(keyword, keyword);
        List<BookDTO> bookDTOList = new ArrayList<>();
        for (BookEntity bookEntity : bookEntityList) {
            bookDTOList.add(BookDTO.toBookDTO(bookEntity)); // static 함수 toBookDTO 각각 호출
        }
        return bookDTOList;
    }
}
