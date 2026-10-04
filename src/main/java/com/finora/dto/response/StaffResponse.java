package com.finora.dto.response;

import com.finora.entity.StaffStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class StaffResponse {
    private Long id;
    private Long businessId;
    private String name;
    private String position;
    private String phone;
    private LocalDate joiningDate;
    private BigDecimal salary;
    private StaffStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
