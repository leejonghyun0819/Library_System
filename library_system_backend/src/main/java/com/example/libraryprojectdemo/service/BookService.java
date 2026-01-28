package com.example.libraryprojectdemo.service;

import com.example.libraryprojectdemo.dto.BookDTO;
import com.example.libraryprojectdemo.entity.BookEntity;
import com.example.libraryprojectdemo.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public List<BookDTO> searchByTitle(String search) {
        List<BookEntity> bookEntityList = bookRepository.findByTitleContainingOrAuthorContaining(search, search);
        List<BookDTO> bookDTOList = new ArrayList<>();
        for (BookEntity bookEntity : bookEntityList) {
            bookDTOList.add(BookDTO.toBookDTO(bookEntity)); // static 함수 toBookDTO 각각 호출
        }
        return bookDTOList;
    }
}
