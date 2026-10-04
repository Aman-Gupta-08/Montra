package com.finora.controller;

import com.finora.dto.request.StaffRequest;
import com.finora.dto.response.StaffResponse;
import com.finora.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BUSINESS_OWNER')")
public class StaffController {

    private final StaffService staffService;
    private final com.finora.service.SalaryService salaryService;

    @GetMapping
    public ResponseEntity<List<StaffResponse>> getAllStaff(Authentication authentication) {
        return ResponseEntity.ok(staffService.getAllStaff(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffResponse> getStaffById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(staffService.getStaffById(id, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<StaffResponse> addStaff(@Valid @RequestBody StaffRequest request, Authentication authentication) {
        return ResponseEntity.ok(staffService.addStaff(request, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffResponse> updateStaff(@PathVariable Long id, @Valid @RequestBody StaffRequest request, Authentication authentication) {
        return ResponseEntity.ok(staffService.updateStaff(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id, Authentication authentication) {
        staffService.deleteStaff(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/salary")
    public ResponseEntity<List<com.finora.dto.response.SalaryPaymentResponse>> getStaffSalaryHistory(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(salaryService.getStaffSalaryHistory(id, authentication.getName()));
    }

    @PostMapping("/{id}/salary")
    public ResponseEntity<com.finora.dto.response.SalaryPaymentResponse> initSalaryRecord(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(salaryService.generateInitialSalaryRecord(id, authentication.getName()));
    }
}
