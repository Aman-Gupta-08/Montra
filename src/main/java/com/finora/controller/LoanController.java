package com.finora.controller;

import com.finora.dto.request.LoanExtensionRequest;
import com.finora.dto.request.LoanPaymentRequest;
import com.finora.dto.request.LoanRequest;
import com.finora.dto.response.LoanPaymentResponse;
import com.finora.dto.response.LoanResponse;
import com.finora.entity.LoanStatus;
import com.finora.entity.LoanType;
import com.finora.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @GetMapping
    public ResponseEntity<List<LoanResponse>> getAllLoans(Authentication authentication) {
        return ResponseEntity.ok(loanService.getAllLoans(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanResponse> getLoanById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(loanService.getLoanById(id, authentication.getName()));
    }

    @GetMapping("/lent")
    public ResponseEntity<List<LoanResponse>> getLentLoans(Authentication authentication) {
        return ResponseEntity.ok(loanService.getLoansByType(LoanType.LENT, authentication.getName()));
    }

    @GetMapping("/borrowed")
    public ResponseEntity<List<LoanResponse>> getBorrowedLoans(Authentication authentication) {
        return ResponseEntity.ok(loanService.getLoansByType(LoanType.BORROWED, authentication.getName()));
    }
    
    @GetMapping("/overdue")
    public ResponseEntity<List<LoanResponse>> getOverdueLoans(Authentication authentication) {
        return ResponseEntity.ok(loanService.getOverdueLoans(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<LoanResponse> createLoan(@Valid @RequestBody LoanRequest request, Authentication authentication) {
        return ResponseEntity.ok(loanService.createLoan(request, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LoanResponse> updateLoan(@PathVariable Long id, @Valid @RequestBody LoanRequest request, Authentication authentication) {
        return ResponseEntity.ok(loanService.updateLoan(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long id, Authentication authentication) {
        loanService.deleteLoan(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/payments")
    public ResponseEntity<LoanPaymentResponse> addPayment(@PathVariable Long id, @Valid @RequestBody LoanPaymentRequest request, Authentication authentication) {
        return ResponseEntity.ok(loanService.addPayment(id, request, authentication.getName()));
    }

    @GetMapping("/{id}/payments")
    public ResponseEntity<List<LoanPaymentResponse>> getLoanPayments(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(loanService.getLoanPayments(id, authentication.getName()));
    }

    @PatchMapping("/{id}/extend")
    public ResponseEntity<LoanResponse> extendDueDate(@PathVariable Long id, @Valid @RequestBody LoanExtensionRequest request, Authentication authentication) {
        return ResponseEntity.ok(loanService.extendDueDate(id, request, authentication.getName()));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<LoanResponse> updateStatus(@PathVariable Long id, @RequestParam LoanStatus status, Authentication authentication) {
        return ResponseEntity.ok(loanService.updateStatus(id, status, authentication.getName()));
    }
}
