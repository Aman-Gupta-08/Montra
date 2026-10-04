package com.finora.service;

import com.finora.dto.response.ReportResponse;
import com.finora.entity.LoanType;
import com.finora.entity.User;
import com.finora.exception.ResourceNotFoundException;
import com.finora.repository.ExpenseRepository;
import com.finora.repository.IncomeRepository;
import com.finora.repository.LoanRepository;
import com.finora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final LoanRepository loanRepository;
    private final UserRepository userRepository;

    public ReportResponse getGeneralReport(String email) {
        return getReportForDateRange(email, null, null);
    }

    public ReportResponse getWeeklyReport(String email) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(7);
        return getReportForDateRange(email, start, end);
    }

    public ReportResponse getMonthlyReport(String email) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.withDayOfMonth(1);
        return getReportForDateRange(email, start, end);
    }

    public ReportResponse getYearlyReport(String email) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.withDayOfYear(1);
        return getReportForDateRange(email, start, end);
    }

    public ReportResponse getCustomReport(String email, LocalDate startDate, LocalDate endDate) {
        return getReportForDateRange(email, startDate, endDate);
    }

    public ReportResponse getReportForDateRange(String email, LocalDate startDate, LocalDate endDate) {
        User user = getUser(email);
        Long userId = user.getId();

        Map<String, BigDecimal> expensesByCategory = new HashMap<>();
        BigDecimal totalExpenses = BigDecimal.ZERO;

        for (var exp : expenseRepository.findByUserIdOrderByExpenseDateDesc(userId)) {
            LocalDate d = exp.getExpenseDate();
            if (isInRange(d, startDate, endDate)) {
                String cat = exp.getCategory().name();
                BigDecimal amt = exp.getAmount() != null ? exp.getAmount() : BigDecimal.ZERO;
                expensesByCategory.put(cat, expensesByCategory.getOrDefault(cat, BigDecimal.ZERO).add(amt));
                totalExpenses = totalExpenses.add(amt);
            }
        }

        Map<String, BigDecimal> incomeBySource = new HashMap<>();
        BigDecimal totalIncome = BigDecimal.ZERO;

        for (var inc : incomeRepository.findByUserIdOrderByIncomeDateDesc(userId)) {
            LocalDate d = inc.getIncomeDate();
            if (isInRange(d, startDate, endDate)) {
                String src = inc.getSource().name();
                BigDecimal amt = inc.getAmount() != null ? inc.getAmount() : BigDecimal.ZERO;
                incomeBySource.put(src, incomeBySource.getOrDefault(src, BigDecimal.ZERO).add(amt));
                totalIncome = totalIncome.add(amt);
            }
        }

        BigDecimal netBalance = totalIncome.subtract(totalExpenses);
        BigDecimal moneyLent = loanRepository.getTotalRemainingByTypeAndUserId(userId, LoanType.LENT);
        BigDecimal moneyBorrowed = loanRepository.getTotalRemainingByTypeAndUserId(userId, LoanType.BORROWED);

        if (moneyLent == null) moneyLent = BigDecimal.ZERO;
        if (moneyBorrowed == null) moneyBorrowed = BigDecimal.ZERO;

        return ReportResponse.builder()
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .netBalance(netBalance)
                .totalMoneyLent(moneyLent)
                .totalMoneyBorrowed(moneyBorrowed)
                .expensesByCategory(expensesByCategory)
                .incomeBySource(incomeBySource)
                .build();
    }

    private boolean isInRange(LocalDate d, LocalDate start, LocalDate end) {
        if (d == null) return false;
        if (start != null && d.isBefore(start)) return false;
        if (end != null && d.isAfter(end)) return false;
        return true;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
