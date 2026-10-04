package com.finora.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BusinessDashboardResponse {
    private BigDecimal todaysSales;
    private BigDecimal todaysExpenses;
    private BigDecimal todaysProfit;
    
    private BigDecimal monthlySales;
    private BigDecimal monthlyExpenses;
    private BigDecimal monthlyProfit;
    
    private BigDecimal pendingSalaries;
    
    private long activeStaffCount;
    private long overdueLoansCount; // Assuming total overdue loans for the user
}
