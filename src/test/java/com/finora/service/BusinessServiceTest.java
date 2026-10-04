package com.finora.service;

import com.finora.dto.request.BusinessRequest;
import com.finora.dto.response.BusinessResponse;
import com.finora.entity.Business;
import com.finora.entity.User;
import com.finora.entity.UserType;
import com.finora.repository.BusinessRepository;
import com.finora.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class BusinessServiceTest {

    @Mock
    private BusinessRepository businessRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BusinessService businessService;

    private User testUser;
    private Business testBusiness;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("owner@example.com");
        testUser.setUserType(UserType.BUSINESS_OWNER);

        testBusiness = new Business();
        testBusiness.setId(1L);
        testBusiness.setUser(testUser);
        testBusiness.setBusinessName("Tech Corp");
        testBusiness.setBusinessType("IT");
    }

    @Test
    void createBusiness_Success() {
        BusinessRequest request = new BusinessRequest();
        request.setBusinessName("Tech Corp");
        request.setBusinessType("IT");

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(testUser));
        when(businessRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(businessRepository.save(any(Business.class))).thenReturn(testBusiness);

        BusinessResponse response = businessService.createBusiness(request, "owner@example.com");

        assertNotNull(response);
        assertEquals("Tech Corp", response.getBusinessName());
        verify(businessRepository, times(1)).save(any(Business.class));
    }

    @Test
    void getBusiness_Success() {
        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(testUser));
        when(businessRepository.findByUserId(1L)).thenReturn(Optional.of(testBusiness));

        BusinessResponse response = businessService.getBusiness("owner@example.com");

        assertNotNull(response);
        assertEquals("Tech Corp", response.getBusinessName());
    }
}
