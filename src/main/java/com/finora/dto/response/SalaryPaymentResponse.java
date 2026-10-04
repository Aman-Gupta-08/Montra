package com.finora.dto.response;

import com.finora.entity.PaymentMethod;
import com.finora.entity.SalaryStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class SalaryPaymentResponse {
    private Long id;
    private Long staffId;
    private String staffName;
    private String salaryMonth;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private SalaryStatus status;
    private PaymentMethod paymentMethod;
    private String comment;
    private String attachmentId;
    private LocalDateTime createdAt;
}
