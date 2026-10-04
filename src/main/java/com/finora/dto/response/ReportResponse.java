package com.finora.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
public class ReportResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netBalance;
    private BigDecimal totalMoneyLent;
    private BigDecimal totalMoneyBorrowed;
    private Map<String, BigDecimal> expensesByCategory;
    private Map<String, BigDecimal> incomeBySource;
}
