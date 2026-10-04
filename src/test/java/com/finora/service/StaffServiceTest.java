package com.finora.service;

import com.finora.dto.request.StaffRequest;
import com.finora.dto.response.StaffResponse;
import com.finora.entity.Business;
import com.finora.entity.Staff;
import com.finora.entity.StaffStatus;
import com.finora.entity.User;
import com.finora.repository.StaffRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class StaffServiceTest {

    @Mock
    private StaffRepository staffRepository;

    @Mock
    private BusinessService businessService;

    @InjectMocks
    private StaffService staffService;

    private Business testBusiness;

    @BeforeEach
    void setUp() {
        testBusiness = new Business();
        testBusiness.setId(1L);
        testBusiness.setUser(new User());
    }

    @Test
    void addStaff_Success() {
        StaffRequest request = new StaffRequest();
        request.setName("John Doe");
        request.setPosition("Manager");
        request.setPhone("1234567890");
        request.setJoiningDate(LocalDate.now());
        request.setSalary(new BigDecimal("5000.00"));

        when(businessService.getBusinessEntity("owner@example.com")).thenReturn(testBusiness);

        Staff savedStaff = new Staff();
        savedStaff.setId(1L);
        savedStaff.setBusiness(testBusiness);
        savedStaff.setName("John Doe");
        savedStaff.setPosition("Manager");
        savedStaff.setPhone("1234567890");
        savedStaff.setJoiningDate(request.getJoiningDate());
        savedStaff.setSalary(new BigDecimal("5000.00"));
        savedStaff.setStatus(StaffStatus.ACTIVE);

        when(staffRepository.save(any(Staff.class))).thenReturn(savedStaff);

        StaffResponse response = staffService.addStaff(request, "owner@example.com");

        assertNotNull(response);
        assertEquals("John Doe", response.getName());
        assertEquals("Manager", response.getPosition());
        assertEquals(StaffStatus.ACTIVE, response.getStatus());
    }

    @Test
    void deleteStaff_Success() {
        Staff staff = new Staff();
        staff.setId(1L);
        staff.setBusiness(testBusiness);
        staff.setStatus(StaffStatus.ACTIVE);

        when(businessService.getBusinessEntity("owner@example.com")).thenReturn(testBusiness);
        when(staffRepository.findByIdAndBusinessId(1L, 1L)).thenReturn(Optional.of(staff));

        staffService.deleteStaff(1L, "owner@example.com");

        assertEquals(StaffStatus.INACTIVE, staff.getStatus());
        verify(staffRepository, times(1)).save(staff);
    }
}
