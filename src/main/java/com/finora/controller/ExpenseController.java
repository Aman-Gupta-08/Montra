package com.finora.controller;

import com.finora.dto.request.ExpenseRequest;
import com.finora.dto.response.ExpenseResponse;
import com.finora.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(expenseService.getAllExpenses(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(expenseService.getExpenseById(id, email));
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(@Valid @RequestBody ExpenseRequest request, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(expenseService.createExpense(request, email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(@PathVariable Long id, @Valid @RequestBody ExpenseRequest request, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(expenseService.updateExpense(id, request, email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        expenseService.deleteExpense(id, email);
        return ResponseEntity.noContent().build();
    }
}
