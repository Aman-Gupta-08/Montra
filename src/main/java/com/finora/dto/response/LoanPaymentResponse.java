package com.finora.dto.response;

import com.finora.entity.PaymentMethod;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class LoanPaymentResponse {
    private Long id;
    private Long loanId;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private PaymentMethod paymentMethod;
    private String description;
    private String attachmentId;
    private LocalDateTime createdAt;
}
