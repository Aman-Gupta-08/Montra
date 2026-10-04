package com.finora.dto.response;

import com.finora.entity.IncomeSource;
import com.finora.entity.PaymentMethod;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class IncomeResponse {
    private Long id;
    private IncomeSource source;
    private BigDecimal amount;
    private LocalDate incomeDate;
    private String description;
    private PaymentMethod paymentMethod;
    private String attachmentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
