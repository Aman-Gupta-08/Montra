package com.finora.service;

import com.finora.dto.request.BudgetRequest;
import com.finora.dto.response.BudgetResponse;
import com.finora.entity.Budget;
import com.finora.entity.ExpenseCategory;
import com.finora.entity.User;
import com.finora.exception.ResourceNotFoundException;
import com.finora.repository.BudgetRepository;
import com.finora.repository.ExpenseRepository;
import com.finora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public List<BudgetResponse> getAllBudgets(String email) {
        User user = getUser(email);
        return budgetRepository.findByUserIdOrderByStartDateDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BudgetResponse getBudgetById(Long id, String email) {
        User user = getUser(email);
        Budget budget = budgetRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        return mapToResponse(budget);
    }

    @Transactional
    @SuppressWarnings("null")
    public BudgetResponse createBudget(BudgetRequest request, String email) {
        User user = getUser(email);
        Budget budget = Budget.builder()
                .user(user)
                .category(request.getCategory().toUpperCase())
                .amount(request.getAmount())
                .period(request.getPeriod().toUpperCase())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        budget = budgetRepository.save(budget);
        return mapToResponse(budget);
    }

    @Transactional
    @SuppressWarnings("null")
    public BudgetResponse updateBudget(Long id, BudgetRequest request, String email) {
        User user = getUser(email);
        Budget budget = budgetRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        budget.setCategory(request.getCategory().toUpperCase());
        budget.setAmount(request.getAmount());
        budget.setPeriod(request.getPeriod().toUpperCase());
        budget.setStartDate(request.getStartDate());
        budget.setEndDate(request.getEndDate());

        budget = budgetRepository.save(budget);
        return mapToResponse(budget);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteBudget(Long id, String email) {
        User user = getUser(email);
        Budget budget = budgetRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        budgetRepository.delete(budget);
    }

    private BudgetResponse mapToResponse(Budget budget) {
        Long userId = budget.getUser().getId();
        BigDecimal currentSpent;

        try {
            ExpenseCategory expCat = ExpenseCategory.valueOf(budget.getCategory());
            currentSpent = expenseRepository.getTotalExpenseByCategoryAndBetween(
                    userId, expCat, budget.getStartDate(), budget.getEndDate()
            );
        } catch (IllegalArgumentException | NullPointerException e) {
            currentSpent = expenseRepository.getTotalExpenseBetween(
                    userId, budget.getStartDate(), budget.getEndDate()
            );
        }

        if (currentSpent == null) {
            currentSpent = BigDecimal.ZERO;
        }

        BigDecimal budgetAmount = budget.getAmount() != null ? budget.getAmount() : BigDecimal.ZERO;
        BigDecimal remaining = budgetAmount.subtract(currentSpent);

        String status = "OK";
        BigDecimal eightyPct = budgetAmount.multiply(new BigDecimal("0.80"));
        if (currentSpent.compareTo(budgetAmount) >= 0) {
            status = "EXCEEDED";
        } else if (currentSpent.compareTo(eightyPct) >= 0) {
            status = "WARNING";
        }

        return BudgetResponse.builder()
                .id(budget.getId())
                .userId(userId)
                .category(budget.getCategory())
                .amount(budgetAmount)
                .currentSpent(currentSpent)
                .remainingAmount(remaining)
                .status(status)
                .period(budget.getPeriod())
                .startDate(budget.getStartDate())
                .endDate(budget.getEndDate())
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .build();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
