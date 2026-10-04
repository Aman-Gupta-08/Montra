package com.finora.service;

import com.finora.dto.request.LoanPaymentRequest;
import com.finora.dto.response.LoanPaymentResponse;
import com.finora.entity.*;
import com.finora.repository.LoanPaymentRepository;
import com.finora.repository.LoanRepository;
import com.finora.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class LoanServiceTest {

    @Mock
    private LoanRepository loanRepository;

    @Mock
    private LoanPaymentRepository loanPaymentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LoanService loanService;

    private User mockUser;
    private Loan mockLoan;
    private LoanPaymentRequest paymentRequest;

    @BeforeEach
    void setUp() {
        mockUser = User.builder().id(1L).email("test@example.com").build();
        
        mockLoan = Loan.builder()
                .id(1L)
                .user(mockUser)
                .originalAmount(new BigDecimal("1000.00"))
                .remainingAmount(new BigDecimal("1000.00"))
                .status(LoanStatus.ACTIVE)
                .build();
                
        paymentRequest = new LoanPaymentRequest();
        paymentRequest.setAmount(new BigDecimal("400.00"));
        paymentRequest.setPaymentDate(LocalDate.now());
        paymentRequest.setPaymentMethod(PaymentMethod.CASH);
    }

    @Test
    void addPayment_PartialPayment_UpdatesRemainingAmountAndStatus() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        when(loanRepository.findByIdAndUserId(anyLong(), anyLong())).thenReturn(Optional.of(mockLoan));
        
        LoanPayment mockedPayment = LoanPayment.builder()
                .id(1L)
                .loan(mockLoan)
                .amount(paymentRequest.getAmount())
                .paymentDate(paymentRequest.getPaymentDate())
                .build();
                
        when(loanPaymentRepository.save(any(LoanPayment.class))).thenReturn(mockedPayment);

        LoanPaymentResponse response = loanService.addPayment(1L, paymentRequest, "test@example.com");

        assertNotNull(response);
        assertEquals(new BigDecimal("400.00"), response.getAmount());
        
        // Assert remaining amount updated on entity
        assertEquals(new BigDecimal("600.00"), mockLoan.getRemainingAmount());
        assertEquals(LoanStatus.PARTIALLY_PAID, mockLoan.getStatus());
        
        verify(loanRepository, times(1)).save(mockLoan);
    }
    
    @Test
    void addPayment_FullPayment_UpdatesStatusToPaid() {
        paymentRequest.setAmount(new BigDecimal("1000.00"));
        
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        when(loanRepository.findByIdAndUserId(anyLong(), anyLong())).thenReturn(Optional.of(mockLoan));
        
        LoanPayment mockedPayment = LoanPayment.builder().loan(mockLoan).amount(paymentRequest.getAmount()).build();
        when(loanPaymentRepository.save(any(LoanPayment.class))).thenReturn(mockedPayment);

        loanService.addPayment(1L, paymentRequest, "test@example.com");
        
        assertEquals(new BigDecimal("0.00"), mockLoan.getRemainingAmount());
        assertEquals(LoanStatus.PAID, mockLoan.getStatus());
    }
}
