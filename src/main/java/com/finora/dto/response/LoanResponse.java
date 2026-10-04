package com.finora.dto.response;

import com.finora.entity.LoanStatus;
import com.finora.entity.LoanType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class LoanResponse {
    private Long id;
    private String personName;
    private String personPhone;
    private LoanType type;
    private BigDecimal originalAmount;
    private BigDecimal remainingAmount;
    private LocalDate startDate;
    private LocalDate dueDate;
    private LoanStatus status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
