package com.example.libraryprojectdemo.domain.user.controller;

import com.example.libraryprojectdemo.domain.user.dto.UserCreateRequest;
import com.example.libraryprojectdemo.domain.user.dto.UserResponse;
import com.example.libraryprojectdemo.domain.user.dto.UserUpdateRequest;
import com.example.libraryprojectdemo.domain.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // @Controller + @ResponseBody -> HttpMessageConverter 작동! -> dto를 json으로 변환
// 그냥 @Controller는 view(화면) 찾으러 감
@RequestMapping("/api/users")   // 모두 주소 앞에 반드시 이거 붙는다
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 회원가입
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) //201
    public UserResponse createUser(/*@Valid*/ @RequestBody UserCreateRequest req) {
        // requestbody : json 형태의 데이터를 java 객체에 매핑할 때 사용. 통신메세지의 body 부분 받아옴
        return userService.create(req);
    }


    // 회원 목록 조회 - 일단 구현
    @GetMapping
    public List<UserResponse> findAll() {
        return userService.findAll();
    }
    // 회원 단건 조회 - 일단 구현
    @GetMapping("/{id}")
    public UserResponse findById(@PathVariable Long id) {
        return userService.findById(id);    // UserResponse 객체 리턴 -> json 형태로 전송?
    }


    // 회원 수정
    @PatchMapping("/{id}")
    public UserResponse updateUser(@PathVariable Long id,
                                   @Valid @RequestBody UserUpdateRequest req) {
        return userService.update(id, req);
    }

    // 회원 삭제
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) { userService.delete(id); }
}
