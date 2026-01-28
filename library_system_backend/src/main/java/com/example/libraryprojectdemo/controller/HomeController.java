package com.example.libraryprojectdemo.controller;

import com.example.libraryprojectdemo.dto.BookDTO;
import com.example.libraryprojectdemo.service.BookService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequiredArgsConstructor    // 생성자 주입
public class HomeController {

    private final BookService bookService;

    @GetMapping("/")
    public String landingPage() {
        return "landingPage";
    }

    @GetMapping("/search")
    public String searchPage(@RequestParam(required = false) String q, Model model) {
        // 검색어 예외처리
        if (q==null||q.trim().isEmpty()) {
            return "searchPage";
        }

        String keyword = q.trim().toLowerCase();
        if (keyword.length()>20){
            throw new IllegalArgumentException("검색어가 너무 깁니다(최대 10자)");
        }

        List<BookDTO> searchResult = bookService.searchByTitle(q);
        model.addAttribute("searchResult", searchResult);

        return "searchPage";
    }
}
