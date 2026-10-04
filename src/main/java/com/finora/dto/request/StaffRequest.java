package com.finora.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class StaffRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String position;
    private String phone;
    private LocalDate joiningDate;

    @NotNull(message = "Salary is required")
    @PositiveOrZero(message = "Salary cannot be negative")
    private BigDecimal salary;
}
