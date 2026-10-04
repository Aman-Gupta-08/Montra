package com.finora.repository;

import com.finora.entity.SalaryPayment;
import com.finora.entity.SalaryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryPaymentRepository extends JpaRepository<SalaryPayment, Long> {
    
    List<SalaryPayment> findByStaffIdOrderBySalaryMonthDesc(Long staffId);
    
    @Query("SELECT sp FROM SalaryPayment sp WHERE sp.staff.business.id = :businessId AND sp.status = :status")
    List<SalaryPayment> findByBusinessIdAndStatus(@Param("businessId") Long businessId, @Param("status") SalaryStatus status);
    
    Optional<SalaryPayment> findByIdAndStaffBusinessId(Long id, Long businessId);

    Optional<SalaryPayment> findByStaffIdAndSalaryMonth(Long staffId, String salaryMonth);
    
    @Query("SELECT COALESCE(SUM(sp.amount), 0) FROM SalaryPayment sp WHERE sp.staff.business.id = :businessId AND sp.status = 'UNPAID'")
    BigDecimal getTotalPendingSalariesByBusinessId(@Param("businessId") Long businessId);
}
