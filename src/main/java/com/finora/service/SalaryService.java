package com.finora.service;

import com.finora.dto.request.SalaryPaymentRequest;
import com.finora.dto.response.SalaryPaymentResponse;
import com.finora.entity.Business;
import com.finora.entity.SalaryPayment;
import com.finora.entity.SalaryStatus;
import com.finora.entity.Staff;
import com.finora.exception.ResourceNotFoundException;
import com.finora.repository.SalaryPaymentRepository;
import com.finora.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryService {

    private final SalaryPaymentRepository salaryPaymentRepository;
    private final StaffRepository staffRepository;
    private final BusinessService businessService;

    public List<SalaryPaymentResponse> getStaffSalaryHistory(Long staffId, String email) {
        Business business = businessService.getBusinessEntity(email);
        Staff staff = staffRepository.findByIdAndBusinessId(staffId, business.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found"));
                
        return salaryPaymentRepository.findByStaffIdOrderBySalaryMonthDesc(staff.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SalaryPaymentResponse> getPendingSalaries(String email) {
        try {
            Business business = businessService.getBusinessEntity(email);
            return salaryPaymentRepository.findByBusinessIdAndStatus(business.getId(), SalaryStatus.UNPAID)
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } catch (ResourceNotFoundException e) {
            return java.util.Collections.emptyList();
        }
    }
    
    public List<SalaryPaymentResponse> getPaidSalaries(String email) {
        try {
            Business business = businessService.getBusinessEntity(email);
            return salaryPaymentRepository.findByBusinessIdAndStatus(business.getId(), SalaryStatus.PAID)
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } catch (ResourceNotFoundException e) {
            return java.util.Collections.emptyList();
        }
    }

    @Transactional
    @SuppressWarnings("null")
    public SalaryPaymentResponse generateInitialSalaryRecord(Long staffId, String email) {
        Business business = businessService.getBusinessEntity(email);
        Staff staff = staffRepository.findByIdAndBusinessId(staffId, business.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found"));

        String currentMonth = YearMonth.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        
        if (salaryPaymentRepository.findByStaffIdAndSalaryMonth(staff.getId(), currentMonth).isPresent()) {
            throw new IllegalStateException("Salary record for this month already exists");
        }

        SalaryPayment payment = SalaryPayment.builder()
                .staff(staff)
                .salaryMonth(currentMonth)
                .amount(staff.getSalary())
                .status(SalaryStatus.UNPAID)
                .build();
                
        payment = salaryPaymentRepository.save(payment);
        return mapToResponse(payment);
    }

    @Transactional
    @SuppressWarnings("null")
    public SalaryPaymentResponse paySalary(Long id, SalaryPaymentRequest request, String email) {
        Business business = businessService.getBusinessEntity(email);
        SalaryPayment payment = salaryPaymentRepository.findByIdAndStaffBusinessId(id, business.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Salary record not found"));

        payment.setAmount(request.getAmount());
        payment.setPaymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDate.now());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setComment(request.getComment());
        payment.setAttachmentId(request.getAttachmentId());
        payment.setStatus(SalaryStatus.PAID);
        
        payment = salaryPaymentRepository.save(payment);
        
        // Rolling mechanism: prepare next month's unpaid salary record
        prepareNextMonthSalary(payment.getStaff(), payment.getSalaryMonth());
        
        return mapToResponse(payment);
    }

    @SuppressWarnings("null")
    private void prepareNextMonthSalary(Staff staff, String currentMonthStr) {
        YearMonth currentMonth = YearMonth.parse(currentMonthStr, DateTimeFormatter.ofPattern("yyyy-MM"));
        String nextMonth = currentMonth.plusMonths(1).format(DateTimeFormatter.ofPattern("yyyy-MM"));
        
        if (salaryPaymentRepository.findByStaffIdAndSalaryMonth(staff.getId(), nextMonth).isEmpty()) {
            SalaryPayment nextPayment = SalaryPayment.builder()
                    .staff(staff)
                    .salaryMonth(nextMonth)
                    .amount(staff.getSalary())
                    .status(SalaryStatus.UNPAID)
                    .build();
            salaryPaymentRepository.save(nextPayment);
        }
    }

    private SalaryPaymentResponse mapToResponse(SalaryPayment payment) {
        return SalaryPaymentResponse.builder()
                .id(payment.getId())
                .staffId(payment.getStaff().getId())
                .staffName(payment.getStaff() != null ? payment.getStaff().getName() : null)
                .salaryMonth(payment.getSalaryMonth())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .status(payment.getStatus())
                .paymentMethod(payment.getPaymentMethod())
                .comment(payment.getComment())
                .attachmentId(payment.getAttachmentId())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
