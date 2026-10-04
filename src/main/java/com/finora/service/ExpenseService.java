package com.finora.service;

import com.finora.dto.request.ExpenseRequest;
import com.finora.dto.response.ExpenseResponse;
import com.finora.entity.Expense;
import com.finora.entity.User;
import com.finora.exception.ResourceNotFoundException;
import com.finora.repository.ExpenseRepository;
import com.finora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public List<ExpenseResponse> getAllExpenses(String email) {
        User user = getUser(email);
        return expenseRepository.findByUserIdOrderByExpenseDateDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ExpenseResponse getExpenseById(Long id, String email) {
        User user = getUser(email);
        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        return mapToResponse(expense);
    }

    @Transactional
    @SuppressWarnings("null")
    public ExpenseResponse createExpense(ExpenseRequest request, String email) {
        User user = getUser(email);
        Expense expense = Expense.builder()
                .user(user)
                .category(request.getCategory())
                .amount(request.getAmount())
                .expenseDate(request.getExpenseDate())
                .description(request.getDescription())
                .paymentMethod(request.getPaymentMethod())
                .attachmentId(request.getAttachmentId())
                .build();
        
        expense = expenseRepository.save(expense);
        return mapToResponse(expense);
    }

    @Transactional
    @SuppressWarnings("null")
    public ExpenseResponse updateExpense(Long id, ExpenseRequest request, String email) {
        User user = getUser(email);
        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setAttachmentId(request.getAttachmentId());

        expense = expenseRepository.save(expense);
        return mapToResponse(expense);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteExpense(Long id, String email) {
        User user = getUser(email);
        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        expenseRepository.delete(expense);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .category(expense.getCategory())
                .amount(expense.getAmount())
                .expenseDate(expense.getExpenseDate())
                .description(expense.getDescription())
                .paymentMethod(expense.getPaymentMethod())
                .attachmentId(expense.getAttachmentId())
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt())
                .build();
    }
}
