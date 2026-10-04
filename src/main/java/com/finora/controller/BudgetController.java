package com.finora.controller;

import com.finora.dto.request.BudgetRequest;
import com.finora.dto.response.BudgetResponse;
import com.finora.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getAllBudgets(Authentication authentication) {
        return ResponseEntity.ok(budgetService.getAllBudgets(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetResponse> getBudgetById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(budgetService.getBudgetById(id, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(@Valid @RequestBody BudgetRequest request, Authentication authentication) {
        return ResponseEntity.ok(budgetService.createBudget(request, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponse> updateBudget(@PathVariable Long id, @Valid @RequestBody BudgetRequest request, Authentication authentication) {
        return ResponseEntity.ok(budgetService.updateBudget(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id, Authentication authentication) {
        budgetService.deleteBudget(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
