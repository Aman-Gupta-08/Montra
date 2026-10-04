package com.finora.dto.response;

import com.finora.entity.PaymentMethod;
import com.finora.entity.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class BusinessTransactionResponse {
    private Long id;
    private Long businessId;
    private TransactionType type;
    private BigDecimal amount;
    private LocalDate transactionDate;
    private PaymentMethod paymentMethod;
    private String description;
    private String attachmentId;
    private LocalDateTime createdAt;
}
