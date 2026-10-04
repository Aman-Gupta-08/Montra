package com.finora.dto.request;

import com.finora.entity.LoanType;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class LoanRequest {
    @NotBlank(message = "Person name is required")
    private String personName;

    private String personPhone;

    @NotNull(message = "Loan type is required")
    private LoanType type;

    @NotNull(message = "Original amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal originalAmount;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @FutureOrPresent(message = "Due date must be in the present or future")
    private LocalDate dueDate;

    private String description;
}
