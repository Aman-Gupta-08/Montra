package com.finora.dto.response;

import com.finora.entity.ExpenseCategory;
import com.finora.entity.Frequency;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class RecurringExpenseResponse {
    private Long id;
    private String name;
    private ExpenseCategory category;
    private BigDecimal amount;
    private Frequency frequency;
    private LocalDate startDate;
    private LocalDate nextDueDate;
    private LocalDate endDate;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
