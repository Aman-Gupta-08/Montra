package com.finora.controller;

import com.finora.dto.response.ReportResponse;
import com.finora.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/general")
    public ResponseEntity<ReportResponse> getGeneralReport(Authentication authentication) {
        return ResponseEntity.ok(reportService.getGeneralReport(authentication.getName()));
    }

    @GetMapping("/weekly")
    public ResponseEntity<ReportResponse> getWeeklyReport(Authentication authentication) {
        return ResponseEntity.ok(reportService.getWeeklyReport(authentication.getName()));
    }

    @GetMapping("/monthly")
    public ResponseEntity<ReportResponse> getMonthlyReport(Authentication authentication) {
        return ResponseEntity.ok(reportService.getMonthlyReport(authentication.getName()));
    }

    @GetMapping("/yearly")
    public ResponseEntity<ReportResponse> getYearlyReport(Authentication authentication) {
        return ResponseEntity.ok(reportService.getYearlyReport(authentication.getName()));
    }

    @GetMapping("/custom")
    public ResponseEntity<ReportResponse> getCustomReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        return ResponseEntity.ok(reportService.getCustomReport(authentication.getName(), startDate, endDate));
    }
}
