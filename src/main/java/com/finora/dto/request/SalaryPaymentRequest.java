package com.finora.dto.request;

import com.finora.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SalaryPaymentRequest {
    @NotNull(message = "Amount is required")
    @PositiveOrZero(message = "Amount cannot be negative")
    private BigDecimal amount;

    private LocalDate paymentDate;
    private PaymentMethod paymentMethod;
    private String comment;
    private String attachmentId;
}
