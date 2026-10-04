package com.finora.service;

import com.finora.dto.response.DashboardResponse;
import com.finora.entity.ExpenseCategory;
import com.finora.entity.User;
import com.finora.exception.ResourceNotFoundException;
import com.finora.repository.ExpenseRepository;
import com.finora.repository.IncomeRepository;
import com.finora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public DashboardResponse getDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Long userId = user.getId();

        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();

        BigDecimal totalIncome = incomeRepository.getTotalIncomeByUserId(userId);
        BigDecimal totalExpenses = expenseRepository.getTotalExpenseByUserId(userId);
        BigDecimal availableBalance = totalIncome.subtract(totalExpenses);

        BigDecimal monthlyIncome = incomeRepository.getMonthlyIncomeByUserId(userId, currentMonth, currentYear);
        BigDecimal monthlyExpenses = expenseRepository.getMonthlyExpenseByUserId(userId, currentMonth, currentYear);

        // Fetch top 5 expense categories
        List<Object[]> topCategoriesData = expenseRepository.getTopExpenseCategoriesByUserId(userId, PageRequest.of(0, 5));
        Map<String, BigDecimal> topExpenseCategories = new LinkedHashMap<>();
        
        for (Object[] row : topCategoriesData) {
            ExpenseCategory category = (ExpenseCategory) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            topExpenseCategories.put(category.name(), amount);
        }

        return DashboardResponse.builder()
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .availableBalance(availableBalance)
                .monthlyIncome(monthlyIncome)
                .monthlyExpenses(monthlyExpenses)
                .topExpenseCategories(topExpenseCategories)
                .build();
    }
}
