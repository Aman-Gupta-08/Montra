package com.finora.service;

import com.finora.dto.request.RecurringExpenseRequest;
import com.finora.dto.response.RecurringExpenseResponse;
import com.finora.entity.RecurringExpense;
import com.finora.entity.User;
import com.finora.exception.ResourceNotFoundException;
import com.finora.repository.RecurringExpenseRepository;
import com.finora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecurringExpenseService {

    private final RecurringExpenseRepository recurringExpenseRepository;
    private final UserRepository userRepository;

    public List<RecurringExpenseResponse> getAllRecurringExpenses(String email) {
        User user = getUser(email);
        return recurringExpenseRepository.findByUserIdOrderByNextDueDateAsc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @SuppressWarnings("null")
    public RecurringExpenseResponse createRecurringExpense(RecurringExpenseRequest request, String email) {
        User user = getUser(email);
        RecurringExpense expense = RecurringExpense.builder()
                .user(user)
                .name(request.getName())
                .category(request.getCategory())
                .amount(request.getAmount())
                .frequency(request.getFrequency())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                // In a real application, nextDueDate would be calculated based on startDate and frequency.
                // For simplicity here, we'll set it to startDate initially.
                .nextDueDate(request.getStartDate())
                .isActive(true)
                .build();
        
        expense = recurringExpenseRepository.save(expense);
        return mapToResponse(expense);
    }

    @Transactional
    @SuppressWarnings("null")
    public RecurringExpenseResponse updateRecurringExpense(Long id, RecurringExpenseRequest request, String email) {
        User user = getUser(email);
        RecurringExpense expense = recurringExpenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Recurring Expense not found"));

        expense.setName(request.getName());
        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setFrequency(request.getFrequency());
        expense.setStartDate(request.getStartDate());
        expense.setEndDate(request.getEndDate());

        expense = recurringExpenseRepository.save(expense);
        return mapToResponse(expense);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteRecurringExpense(Long id, String email) {
        User user = getUser(email);
        RecurringExpense expense = recurringExpenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Recurring Expense not found"));
        recurringExpenseRepository.delete(expense);
    }

    @Transactional
    @SuppressWarnings("null")
    public RecurringExpenseResponse toggleIsActive(Long id, String email) {
        User user = getUser(email);
        RecurringExpense expense = recurringExpenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Recurring Expense not found"));
        
        expense.setIsActive(!expense.getIsActive());
        expense = recurringExpenseRepository.save(expense);
        return mapToResponse(expense);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private RecurringExpenseResponse mapToResponse(RecurringExpense expense) {
        return RecurringExpenseResponse.builder()
                .id(expense.getId())
                .name(expense.getName())
                .category(expense.getCategory())
                .amount(expense.getAmount())
                .frequency(expense.getFrequency())
                .startDate(expense.getStartDate())
                .nextDueDate(expense.getNextDueDate())
                .endDate(expense.getEndDate())
                .isActive(expense.getIsActive())
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt())
                .build();
    }
}
