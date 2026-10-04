package com.finora.controller;

import com.finora.dto.request.SalaryPaymentRequest;
import com.finora.dto.response.SalaryPaymentResponse;
import com.finora.service.SalaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salary")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BUSINESS_OWNER')")
public class SalaryController {

    private final SalaryService salaryService;

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<SalaryPaymentResponse>> getStaffSalaryHistory(@PathVariable Long staffId, Authentication authentication) {
        return ResponseEntity.ok(salaryService.getStaffSalaryHistory(staffId, authentication.getName()));
    }

    @PostMapping("/staff/{staffId}/init")
    public ResponseEntity<SalaryPaymentResponse> initSalaryRecord(@PathVariable Long staffId, Authentication authentication) {
        return ResponseEntity.ok(salaryService.generateInitialSalaryRecord(staffId, authentication.getName()));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<SalaryPaymentResponse>> getPendingSalaries(Authentication authentication) {
        return ResponseEntity.ok(salaryService.getPendingSalaries(authentication.getName()));
    }

    @GetMapping("/paid")
    public ResponseEntity<List<SalaryPaymentResponse>> getPaidSalaries(Authentication authentication) {
        return ResponseEntity.ok(salaryService.getPaidSalaries(authentication.getName()));
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<SalaryPaymentResponse> paySalary(@PathVariable Long id, @Valid @RequestBody SalaryPaymentRequest request, Authentication authentication) {
        return ResponseEntity.ok(salaryService.paySalary(id, request, authentication.getName()));
    }
}
