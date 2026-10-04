package com.finora.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
public class DashboardResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal availableBalance;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private Map<String, BigDecimal> topExpenseCategories;
}
