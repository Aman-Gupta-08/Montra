package com.finora.service;

import com.finora.dto.request.LoanExtensionRequest;
import com.finora.dto.request.LoanPaymentRequest;
import com.finora.dto.request.LoanRequest;
import com.finora.dto.response.LoanPaymentResponse;
import com.finora.dto.response.LoanResponse;
import com.finora.entity.*;
import com.finora.exception.ResourceNotFoundException;
import com.finora.repository.LoanDueDateHistoryRepository;
import com.finora.repository.LoanPaymentRepository;
import com.finora.repository.LoanRepository;
import com.finora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final LoanPaymentRepository loanPaymentRepository;
    private final LoanDueDateHistoryRepository loanDueDateHistoryRepository;
    private final UserRepository userRepository;

    public List<LoanResponse> getAllLoans(String email) {
        User user = getUser(email);
        return loanRepository.findByUserIdOrderByDueDateAsc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public LoanResponse getLoanById(Long id, String email) {
        User user = getUser(email);
        Loan loan = loanRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));
        return mapToResponse(loan);
    }

    public List<LoanResponse> getLoansByType(LoanType type, String email) {
        User user = getUser(email);
        return loanRepository.findByUserIdAndTypeOrderByDueDateAsc(user.getId(), type)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<LoanResponse> getOverdueLoans(String email) {
        User user = getUser(email);
        return loanRepository.findOverdueLoansByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @SuppressWarnings("null")
    public LoanResponse createLoan(LoanRequest request, String email) {
        User user = getUser(email);
        Loan loan = Loan.builder()
                .user(user)
                .personName(request.getPersonName())
                .personPhone(request.getPersonPhone())
                .type(request.getType())
                .originalAmount(request.getOriginalAmount())
                .remainingAmount(request.getOriginalAmount())
                .startDate(request.getStartDate())
                .dueDate(request.getDueDate())
                .status(LoanStatus.ACTIVE)
                .description(request.getDescription())
                .build();
        
        loan = loanRepository.save(loan);
        return mapToResponse(loan);
    }

    @Transactional
    @SuppressWarnings("null")
    public LoanResponse updateLoan(Long id, LoanRequest request, String email) {
        User user = getUser(email);
        Loan loan = loanRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));

        loan.setPersonName(request.getPersonName());
        loan.setPersonPhone(request.getPersonPhone());
        loan.setDescription(request.getDescription());
        
        loan = loanRepository.save(loan);
        return mapToResponse(loan);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteLoan(Long id, String email) {
        User user = getUser(email);
        Loan loan = loanRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));
        loanRepository.delete(loan);
    }

    @Transactional
    @SuppressWarnings("null")
    public LoanPaymentResponse addPayment(Long loanId, LoanPaymentRequest request, String email) {
        User user = getUser(email);
        Loan loan = loanRepository.findByIdAndUserId(loanId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));

        if (request.getAmount().compareTo(loan.getRemainingAmount()) > 0) {
            throw new IllegalArgumentException("Payment amount exceeds remaining loan amount");
        }

        LoanPayment payment = LoanPayment.builder()
                .loan(loan)
                .amount(request.getAmount())
                .paymentDate(request.getPaymentDate())
                .paymentMethod(request.getPaymentMethod())
                .description(request.getDescription())
                .attachmentId(request.getAttachmentId())
                .build();
        
        payment = loanPaymentRepository.save(payment);

        loan.setRemainingAmount(loan.getRemainingAmount().subtract(request.getAmount()));
        
        if (loan.getRemainingAmount().compareTo(BigDecimal.ZERO) == 0) {
            loan.setStatus(LoanStatus.PAID);
        } else {
            loan.setStatus(LoanStatus.PARTIALLY_PAID);
        }

        loanRepository.save(loan);

        return mapToPaymentResponse(payment);
    }

    public List<LoanPaymentResponse> getLoanPayments(Long loanId, String email) {
        User user = getUser(email);
        Loan loan = loanRepository.findByIdAndUserId(loanId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));

        return loanPaymentRepository.findByLoanIdOrderByPaymentDateDesc(loan.getId())
                .stream()
                .map(this::mapToPaymentResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @SuppressWarnings("null")
    public LoanResponse extendDueDate(Long loanId, LoanExtensionRequest request, String email) {
        User user = getUser(email);
        Loan loan = loanRepository.findByIdAndUserId(loanId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));

        LocalDate oldDate = loan.getDueDate();
        LocalDate newDate = request.getNewDueDate();
        
        long days = ChronoUnit.DAYS.between(oldDate, newDate);

        LoanDueDateHistory history = LoanDueDateHistory.builder()
                .loan(loan)
                .oldDueDate(oldDate)
                .newDueDate(newDate)
                .extensionDays((int) days)
                .build();
        
        loanDueDateHistoryRepository.save(history);

        loan.setDueDate(newDate);
        if (loan.getStatus() == LoanStatus.OVERDUE && newDate.isAfter(LocalDate.now())) {
            loan.setStatus(loan.getRemainingAmount().compareTo(loan.getOriginalAmount()) < 0 
                ? LoanStatus.PARTIALLY_PAID : LoanStatus.ACTIVE);
        }
        
        loan = loanRepository.save(loan);
        return mapToResponse(loan);
    }
    
    @Transactional
    @SuppressWarnings("null")
    public LoanResponse updateStatus(Long loanId, LoanStatus status, String email) {
        User user = getUser(email);
        Loan loan = loanRepository.findByIdAndUserId(loanId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));

        loan.setStatus(status);
        loan = loanRepository.save(loan);
        return mapToResponse(loan);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private LoanResponse mapToResponse(Loan loan) {
        return LoanResponse.builder()
                .id(loan.getId())
                .personName(loan.getPersonName())
                .personPhone(loan.getPersonPhone())
                .type(loan.getType())
                .originalAmount(loan.getOriginalAmount())
                .remainingAmount(loan.getRemainingAmount())
                .startDate(loan.getStartDate())
                .dueDate(loan.getDueDate())
                .status(loan.getStatus())
                .description(loan.getDescription())
                .createdAt(loan.getCreatedAt())
                .updatedAt(loan.getUpdatedAt())
                .build();
    }
    
    private LoanPaymentResponse mapToPaymentResponse(LoanPayment payment) {
        return LoanPaymentResponse.builder()
                .id(payment.getId())
                .loanId(payment.getLoan().getId())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .description(payment.getDescription())
                .attachmentId(payment.getAttachmentId())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
