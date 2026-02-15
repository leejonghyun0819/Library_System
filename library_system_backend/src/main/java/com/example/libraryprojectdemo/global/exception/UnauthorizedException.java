package com.example.libraryprojectdemo.global.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) { super(message); }    // String 그대로 넘김
}
