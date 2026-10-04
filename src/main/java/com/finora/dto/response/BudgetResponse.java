package com.finora.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class BudgetResponse {
    private Long id;
    private Long userId;
    private String category;
    private BigDecimal amount;
    private BigDecimal currentSpent;
    private BigDecimal remainingAmount;
    private String status; // OK, WARNING (80%), EXCEEDED (100%+)
    private String period;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
