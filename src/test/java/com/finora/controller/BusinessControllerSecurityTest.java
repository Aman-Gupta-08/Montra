package com.finora.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BusinessControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
    void getBusiness_AsStudent_ReturnsForbidden() throws Exception {
        mockMvc.perform(get("/api/business"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "employee@test.com", roles = {"EMPLOYEE"})
    void getBusiness_AsEmployee_ReturnsForbidden() throws Exception {
        mockMvc.perform(get("/api/business"))
                .andExpect(status().isForbidden());
    }
}
