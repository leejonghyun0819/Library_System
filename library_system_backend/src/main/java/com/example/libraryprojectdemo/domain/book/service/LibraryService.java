package com.example.libraryprojectdemo.domain.book.service;

import com.example.libraryprojectdemo.domain.book.dto.BookRankingResponse;
import com.example.libraryprojectdemo.domain.book.dto.LoanResponse;
import com.example.libraryprojectdemo.domain.book.dto.ReservationResponse;
import com.example.libraryprojectdemo.domain.book.entity.BookEntity;
import com.example.libraryprojectdemo.domain.book.entity.BookStatus;
import com.example.libraryprojectdemo.domain.book.entity.LoanEntity;
import com.example.libraryprojectdemo.domain.book.entity.ReservationEntity;
import com.example.libraryprojectdemo.domain.book.repository.BookRepository;
import com.example.libraryprojectdemo.domain.book.repository.LoanRepository;
import com.example.libraryprojectdemo.domain.book.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class LibraryService {
    private static final int MAX_POPULAR_LIMIT = 100;

    private final BookRepository bookRepository;
    private final LoanRepository loanRepository;
    private final ReservationRepository reservationRepository;

    public LibraryService(BookRepository bookRepository,
                          LoanRepository loanRepository,
                          ReservationRepository reservationRepository) {
        this.bookRepository = bookRepository;
        this.loanRepository = loanRepository;
        this.reservationRepository = reservationRepository;
    }

    public ReservationResponse reserve(Long bookId, Long userId) {
        BookEntity book = findBook(bookId);

        if (book.getStatus() != BookStatus.AVAILABLE) {
            throw new IllegalArgumentException("현재 예약할 수 없는 도서입니다.");
        }
        if (reservationRepository.findFirstByBookIdAndActiveTrue(bookId).isPresent()) {
            throw new IllegalArgumentException("이미 예약된 도서입니다.");
        }
        if (loanRepository.findFirstByBookIdAndActiveTrue(bookId).isPresent()) {
            throw new IllegalArgumentException("현재 대출 중인 도서입니다.");
        }

        book.reserve(userId);
        ReservationEntity reservation = reservationRepository.save(new ReservationEntity(userId, bookId));
        return toReservationResponse(reservation, book);
    }

    public ReservationResponse cancelReservation(Long bookId, Long userId) {
        BookEntity book = findBook(bookId);
        ReservationEntity reservation = reservationRepository.findFirstByBookIdAndUserIdAndActiveTrue(bookId, userId)
                .orElseThrow(() -> new IllegalArgumentException("취소할 예약이 없습니다."));

        reservation.cancel();
        if (book.getStatus() == BookStatus.RESERVED && userId.equals(book.getReservedByUserId())) {
            book.makeAvailable();
        }
        return toReservationResponse(reservation, book);
    }

    public LoanResponse borrow(Long bookId, Long userId) {
        BookEntity book = findBook(bookId);

        if (loanRepository.findFirstByBookIdAndActiveTrue(bookId).isPresent()) {
            throw new IllegalArgumentException("이미 대출 중인 도서입니다.");
        }

        if (book.getStatus() == BookStatus.RESERVED) {
            if (!userId.equals(book.getReservedByUserId())) {
                throw new IllegalArgumentException("다른 사용자가 예약한 도서입니다.");
            }
            reservationRepository.findFirstByBookIdAndUserIdAndActiveTrue(bookId, userId)
                    .ifPresent(ReservationEntity::cancel);
        } else if (book.getStatus() != BookStatus.AVAILABLE) {
            throw new IllegalArgumentException("현재 대출할 수 없는 도서입니다.");
        }

        book.borrow();
        LoanEntity loan = loanRepository.save(new LoanEntity(userId, bookId));
        return toLoanResponse(loan, book);
    }

    public LoanResponse returnBook(Long bookId, Long userId) {
        BookEntity book = findBook(bookId);
        LoanEntity loan = loanRepository.findFirstByBookIdAndUserIdAndActiveTrue(bookId, userId)
                .orElseThrow(() -> new IllegalArgumentException("반납할 대출 기록이 없습니다."));

        loan.markReturned();
        book.makeAvailable();
        return toLoanResponse(loan, book);
    }

    @Transactional(readOnly = true)
    public List<LoanResponse> myLoans(Long userId) {
        return loanRepository.findByUserIdAndActiveTrueOrderByBorrowedAtDesc(userId)
                .stream()
                .map(loan -> toLoanResponse(loan, findBook(loan.getBookId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> myReservations(Long userId) {
        return reservationRepository.findByUserIdAndActiveTrueOrderByCreatedAtDesc(userId)
                .stream()
                .map(reservation -> toReservationResponse(reservation, findBook(reservation.getBookId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookRankingResponse> popularBooks(int requestedLimit) {
        int limit = Math.max(1, Math.min(requestedLimit, MAX_POPULAR_LIMIT));
        Map<Long, Long> loanCounts = toCountMap(loanRepository.countLoansByBookId());
        Map<Long, Long> reservationCounts = toCountMap(reservationRepository.countReservationsByBookId());

        Set<Long> bookIds = new HashSet<>();
        bookIds.addAll(loanCounts.keySet());
        bookIds.addAll(reservationCounts.keySet());

        if (bookIds.isEmpty()) {
            return List.of();
        }

        Map<Long, BookEntity> booksById = bookRepository.findAllById(bookIds)
                .stream()
                .collect(Collectors.toMap(BookEntity::getId, Function.identity()));

        List<BookRankingResponse> ranking = new ArrayList<>();
        for (Long bookId : bookIds) {
            BookEntity book = booksById.get(bookId);
            if (book == null) {
                continue;
            }
            long loanCount = loanCounts.getOrDefault(bookId, 0L);
            long reservationCount = reservationCounts.getOrDefault(bookId, 0L);
            // 대출은 실제 이용 완료/진행 이력이므로 예약보다 조금 더 높은 가중치를 줍니다.
            long popularityScore = loanCount * 2 + reservationCount;
            ranking.add(toBookRankingResponse(book, loanCount, reservationCount, popularityScore));
        }

        return ranking.stream()
                .sorted(Comparator
                        .comparingLong(BookRankingResponse::popularityScore).reversed()
                        .thenComparing(Comparator.comparingLong(BookRankingResponse::loanCount).reversed())
                        .thenComparing(BookRankingResponse::title))
                .limit(limit)
                .toList();
    }

    private Map<Long, Long> toCountMap(List<Object[]> rows) {
        Map<Long, Long> result = new HashMap<>();
        for (Object[] row : rows) {
            Long bookId = ((Number) row[0]).longValue();
            Long count = ((Number) row[1]).longValue();
            result.put(bookId, count);
        }
        return result;
    }

    private BookEntity findBook(Long bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("도서를 찾을 수 없습니다."));
    }

    private LoanResponse toLoanResponse(LoanEntity loan, BookEntity book) {
        return new LoanResponse(
                loan.getId(),
                loan.getBookId(),
                loan.getUserId(),
                book.getTitle(),
                book.getAuthor(),
                book.getStatus(),
                loan.getBorrowedAt(),
                loan.getReturnedAt(),
                loan.isActive()
        );
    }

    private ReservationResponse toReservationResponse(ReservationEntity reservation, BookEntity book) {
        return new ReservationResponse(
                reservation.getId(),
                reservation.getBookId(),
                reservation.getUserId(),
                book.getTitle(),
                book.getAuthor(),
                book.getStatus(),
                reservation.getCreatedAt(),
                reservation.isActive()
        );
    }

    private BookRankingResponse toBookRankingResponse(BookEntity book, long loanCount, long reservationCount, long popularityScore) {
        return new BookRankingResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublisher(),
                book.getCategory(),
                book.getIsbn(),
                book.getImageurl(),
                book.getStatus(),
                book.getReservedByUserId(),
                loanCount,
                reservationCount,
                popularityScore
        );
    }
}
