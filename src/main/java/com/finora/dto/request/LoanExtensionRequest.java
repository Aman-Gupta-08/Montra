package com.finora.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LoanExtensionRequest {
    @NotNull(message = "New due date is required")
    @Future(message = "New due date must be in the future")
    private LocalDate newDueDate;
}
