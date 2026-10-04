package com.finora.controller;

import com.finora.dto.request.RecurringExpenseRequest;
import com.finora.dto.response.RecurringExpenseResponse;
import com.finora.service.RecurringExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recurring-expenses")
@RequiredArgsConstructor
public class RecurringExpenseController {

    private final RecurringExpenseService recurringExpenseService;

    @GetMapping
    public ResponseEntity<List<RecurringExpenseResponse>> getAllRecurringExpenses(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recurringExpenseService.getAllRecurringExpenses(email));
    }

    @PostMapping
    public ResponseEntity<RecurringExpenseResponse> createRecurringExpense(@Valid @RequestBody RecurringExpenseRequest request, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recurringExpenseService.createRecurringExpense(request, email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecurringExpenseResponse> updateRecurringExpense(@PathVariable Long id, @Valid @RequestBody RecurringExpenseRequest request, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recurringExpenseService.updateRecurringExpense(id, request, email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecurringExpense(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        recurringExpenseService.deleteRecurringExpense(id, email);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<RecurringExpenseResponse> toggleIsActive(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(recurringExpenseService.toggleIsActive(id, email));
    }
}
