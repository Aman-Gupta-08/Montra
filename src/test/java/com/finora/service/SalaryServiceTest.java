package com.finora.service;

import com.finora.dto.response.SalaryPaymentResponse;
import com.finora.entity.Business;
import com.finora.entity.SalaryPayment;
import com.finora.entity.SalaryStatus;
import com.finora.entity.Staff;
import com.finora.entity.User;
import com.finora.repository.SalaryPaymentRepository;
import com.finora.repository.StaffRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class SalaryServiceTest {

    @Mock
    private SalaryPaymentRepository salaryPaymentRepository;

    @Mock
    private StaffRepository staffRepository;

    @Mock
    private BusinessService businessService;

    @InjectMocks
    private SalaryService salaryService;

    private Business testBusiness;
    private Staff testStaff;

    @BeforeEach
    void setUp() {
        testBusiness = new Business();
        testBusiness.setId(1L);
        testBusiness.setUser(new User());

        testStaff = new Staff();
        testStaff.setId(1L);
        testStaff.setBusiness(testBusiness);
        testStaff.setSalary(new BigDecimal("5000.00"));
    }

    @Test
    void generateInitialSalaryRecord_Success() {
        when(businessService.getBusinessEntity("owner@example.com")).thenReturn(testBusiness);
        when(staffRepository.findByIdAndBusinessId(1L, 1L)).thenReturn(Optional.of(testStaff));
        when(salaryPaymentRepository.findByStaffIdAndSalaryMonth(eq(1L), anyString())).thenReturn(Optional.empty());
        
        SalaryPayment savedPayment = new SalaryPayment();
        savedPayment.setId(1L);
        savedPayment.setStaff(testStaff);
        savedPayment.setSalaryMonth("2026-09");
        savedPayment.setAmount(new BigDecimal("5000.00"));
        savedPayment.setStatus(SalaryStatus.UNPAID);
        
        when(salaryPaymentRepository.save(any(SalaryPayment.class))).thenReturn(savedPayment);

        SalaryPaymentResponse response = salaryService.generateInitialSalaryRecord(1L, "owner@example.com");

        assertNotNull(response);
        assertEquals(SalaryStatus.UNPAID, response.getStatus());
        assertEquals(new BigDecimal("5000.00"), response.getAmount());
    }
}
