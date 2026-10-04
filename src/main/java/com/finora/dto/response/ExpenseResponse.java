package com.finora.dto.response;

import com.finora.entity.ExpenseCategory;
import com.finora.entity.PaymentMethod;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class ExpenseResponse {
    private Long id;
    private ExpenseCategory category;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private String description;
    private PaymentMethod paymentMethod;
    private String attachmentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
