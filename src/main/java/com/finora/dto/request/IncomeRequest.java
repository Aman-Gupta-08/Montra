package com.finora.dto.request;

import com.finora.entity.IncomeSource;
import com.finora.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class IncomeRequest {
    @NotNull(message = "Source is required")
    private IncomeSource source;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Income date is required")
    private LocalDate incomeDate;

    private String description;
    private PaymentMethod paymentMethod;
    private String attachmentId;
}
