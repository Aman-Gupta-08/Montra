package com.finora.controller;

import com.finora.dto.request.BusinessRequest;
import com.finora.dto.request.BusinessTransactionRequest;
import com.finora.dto.response.BusinessDashboardResponse;
import com.finora.dto.response.BusinessResponse;
import com.finora.dto.response.BusinessTransactionResponse;
import com.finora.entity.TransactionType;
import com.finora.service.BusinessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BUSINESS_OWNER')")
public class BusinessController {

    private final BusinessService businessService;

    @PostMapping
    public ResponseEntity<BusinessResponse> createBusiness(@Valid @RequestBody BusinessRequest request, Authentication authentication) {
        return ResponseEntity.ok(businessService.createBusiness(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<BusinessResponse> getBusiness(Authentication authentication) {
        return ResponseEntity.ok(businessService.getBusiness(authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<BusinessResponse> updateBusiness(@Valid @RequestBody BusinessRequest request, Authentication authentication) {
        return ResponseEntity.ok(businessService.updateBusiness(request, authentication.getName()));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteBusiness(Authentication authentication) {
        businessService.deleteBusiness(authentication.getName());
        return ResponseEntity.noContent().build();
    }

    // Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<BusinessDashboardResponse> getDashboard(Authentication authentication) {
        return ResponseEntity.ok(businessService.getDashboard(authentication.getName()));
    }

    // Transactions
    @GetMapping("/transactions")
    public ResponseEntity<List<BusinessTransactionResponse>> getAllTransactions(Authentication authentication) {
        return ResponseEntity.ok(businessService.getAllTransactions(authentication.getName()));
    }

    @GetMapping("/sales")
    public ResponseEntity<List<BusinessTransactionResponse>> getSales(Authentication authentication) {
        List<BusinessTransactionResponse> sales = businessService.getAllTransactions(authentication.getName())
                .stream().filter(t -> t.getType() == TransactionType.SALE).collect(Collectors.toList());
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/expenses")
    public ResponseEntity<List<BusinessTransactionResponse>> getExpenses(Authentication authentication) {
        List<BusinessTransactionResponse> expenses = businessService.getAllTransactions(authentication.getName())
                .stream().filter(t -> t.getType() == TransactionType.EXPENSE).collect(Collectors.toList());
        return ResponseEntity.ok(expenses);
    }

    @PostMapping("/sales")
    public ResponseEntity<BusinessTransactionResponse> addSale(@Valid @RequestBody BusinessTransactionRequest request, Authentication authentication) {
        return ResponseEntity.ok(businessService.addTransaction(request, TransactionType.SALE, authentication.getName()));
    }

    @PostMapping("/expenses")
    public ResponseEntity<BusinessTransactionResponse> addExpense(@Valid @RequestBody BusinessTransactionRequest request, Authentication authentication) {
        return ResponseEntity.ok(businessService.addTransaction(request, TransactionType.EXPENSE, authentication.getName()));
    }

    @PutMapping("/transactions/{id}")
    public ResponseEntity<BusinessTransactionResponse> updateTransaction(@PathVariable Long id, @Valid @RequestBody BusinessTransactionRequest request, Authentication authentication) {
        return ResponseEntity.ok(businessService.updateTransaction(id, request, authentication.getName()));
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id, Authentication authentication) {
        businessService.deleteTransaction(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
