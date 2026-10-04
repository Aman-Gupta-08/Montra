package com.finora.controller;

import com.finora.dto.request.IncomeRequest;
import com.finora.dto.response.IncomeResponse;
import com.finora.service.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;

    @GetMapping
    public ResponseEntity<List<IncomeResponse>> getAllIncomes(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(incomeService.getAllIncomes(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomeResponse> getIncomeById(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(incomeService.getIncomeById(id, email));
    }

    @PostMapping
    public ResponseEntity<IncomeResponse> createIncome(@Valid @RequestBody IncomeRequest request, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(incomeService.createIncome(request, email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeResponse> updateIncome(@PathVariable Long id, @Valid @RequestBody IncomeRequest request, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(incomeService.updateIncome(id, request, email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        incomeService.deleteIncome(id, email);
        return ResponseEntity.noContent().build();
    }
}
