package com.finora.service;

import com.finora.dto.response.DashboardResponse;
import com.finora.entity.ExpenseCategory;
import com.finora.entity.User;
import com.finora.repository.ExpenseRepository;
import com.finora.repository.IncomeRepository;
import com.finora.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private IncomeRepository incomeRepository;

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DashboardService dashboardService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .build();
    }

    @Test
    void getDashboard_Success() {
        // Arrange
        when(userRepository.findByEmail(any(String.class))).thenReturn(Optional.of(mockUser));
        when(incomeRepository.getTotalIncomeByUserId(anyLong())).thenReturn(new BigDecimal("5000.00"));
        when(expenseRepository.getTotalExpenseByUserId(anyLong())).thenReturn(new BigDecimal("2000.00"));
        when(incomeRepository.getMonthlyIncomeByUserId(anyLong(), anyInt(), anyInt())).thenReturn(new BigDecimal("1500.00"));
        when(expenseRepository.getMonthlyExpenseByUserId(anyLong(), anyInt(), anyInt())).thenReturn(new BigDecimal("800.00"));

        List<Object[]> topCategories = new ArrayList<>();
        topCategories.add(new Object[]{ExpenseCategory.FOOD, new BigDecimal("400.00")});
        topCategories.add(new Object[]{ExpenseCategory.RENT, new BigDecimal("1000.00")});
        
        when(expenseRepository.getTopExpenseCategoriesByUserId(anyLong(), any(Pageable.class))).thenReturn(topCategories);

        // Act
        DashboardResponse response = dashboardService.getDashboard("test@example.com");

        // Assert
        assertNotNull(response);
        assertEquals(new BigDecimal("5000.00"), response.getTotalIncome());
        assertEquals(new BigDecimal("2000.00"), response.getTotalExpenses());
        assertEquals(new BigDecimal("3000.00"), response.getAvailableBalance()); // 5000 - 2000
        assertEquals(new BigDecimal("1500.00"), response.getMonthlyIncome());
        assertEquals(new BigDecimal("800.00"), response.getMonthlyExpenses());
        
        assertNotNull(response.getTopExpenseCategories());
        assertEquals(2, response.getTopExpenseCategories().size());
        assertEquals(new BigDecimal("400.00"), response.getTopExpenseCategories().get(ExpenseCategory.FOOD.name()));
        assertEquals(new BigDecimal("1000.00"), response.getTopExpenseCategories().get(ExpenseCategory.RENT.name()));
    }
}
