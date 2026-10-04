package com.finora.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarEventResponse {
    private String id;
    private String type; // INCOME, EXPENSE, LOAN, BILL, SALARY
    private String title;
    private BigDecimal amount;
    private LocalDate date;
    private String category;
    private String status;
    private String description;
    private Long referenceId;
}
