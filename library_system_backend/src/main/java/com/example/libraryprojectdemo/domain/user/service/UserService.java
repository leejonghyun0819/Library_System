package com.example.libraryprojectdemo.domain.user.service;

import com.example.libraryprojectdemo.domain.book.repository.LoanRepository;
import com.example.libraryprojectdemo.domain.book.repository.ReservationRepository;
import com.example.libraryprojectdemo.domain.user.dto.UserCreateRequest;
import com.example.libraryprojectdemo.domain.user.dto.UserResponse;
import com.example.libraryprojectdemo.domain.user.dto.UserUpdateRequest;
import com.example.libraryprojectdemo.domain.user.entity.UserEntity;
import com.example.libraryprojectdemo.domain.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoanRepository loanRepository;
    private final ReservationRepository reservationRepository;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       LoanRepository loanRepository,
                       ReservationRepository reservationRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.loanRepository = loanRepository;
        this.reservationRepository = reservationRepository;
    }

    private UserResponse toResponse(UserEntity e) {
        return new UserResponse(e.getId(), e.getUsername(), e.getNickname(), e.getEmail());
    }

    public UserResponse create(UserCreateRequest req) {
        if (userRepository.existsByUsername(req.username())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        String hash = passwordEncoder.encode(req.password());
        UserEntity saved = userRepository.save(
                new UserEntity(req.username(), req.nickname(), req.email(), hash)
        );
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        return toResponse(user);
    }

    public UserResponse update(Long id, UserUpdateRequest req) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (req.nickname() != null && !req.nickname().isBlank()) {
            user.changeNickname(req.nickname());
        }
        if (req.email() != null && !req.email().isBlank()) {
            userRepository.findByEmail(req.email())
                    .filter(found -> !found.getId().equals(id))
                    .ifPresent(found -> {
                        throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
                    });
            user.changeEmail(req.email());
        }

        return toResponse(user);
    }

    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }
        if (loanRepository.existsByUserIdAndActiveTrue(id)) {
            throw new IllegalArgumentException("대출 중인 도서가 있어 회원 탈퇴를 할 수 없습니다. 먼저 반납해주세요.");
        }
        if (reservationRepository.existsByUserIdAndActiveTrue(id)) {
            throw new IllegalArgumentException("예약 중인 도서가 있어 회원 탈퇴를 할 수 없습니다. 먼저 예약을 취소해주세요.");
        }
        userRepository.deleteById(id);
    }
}
