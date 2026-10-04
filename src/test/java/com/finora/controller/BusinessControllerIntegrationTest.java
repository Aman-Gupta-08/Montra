package com.finora.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finora.dto.request.BusinessRequest;
import com.finora.entity.User;
import com.finora.entity.UserType;
import com.finora.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BusinessControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        if (userRepository.findByEmail("test_owner@example.com").isEmpty()) {
            User user = new User();
            user.setName("Test Owner");
            user.setEmail("test_owner@example.com");
            user.setPhone("1234567890");
            user.setPasswordHash("hash");
            user.setUserType(UserType.BUSINESS_OWNER);
            user.setIsActive(true);
            userRepository.save(user);
        }
    }

    @Test
    @SuppressWarnings("null")
    @WithMockUser(username = "test_owner@example.com", roles = {"BUSINESS_OWNER"})
    void testCreateBusiness() throws Exception {
        BusinessRequest request = new BusinessRequest();
        request.setBusinessName("Integration Test Biz");
        request.setBusinessType("Retail");
        request.setLocation("Test City");
        request.setDescription("A test business");

        mockMvc.perform(post("/api/business")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.businessName").value("Integration Test Biz"));
    }
}
