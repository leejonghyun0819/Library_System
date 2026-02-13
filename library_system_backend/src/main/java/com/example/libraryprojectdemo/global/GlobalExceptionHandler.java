package com.example.libraryprojectdemo.global;

import com.example.libraryprojectdemo.global.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // 에러를 json 으로 전달

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> badRequest(IllegalArgumentException e) {
        return ApiResponse.fail(e.getMessage());
    }
}
