package com.finora.repository;

import com.finora.entity.BusinessTransaction;
import com.finora.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessTransactionRepository extends JpaRepository<BusinessTransaction, Long> {
    
    List<BusinessTransaction> findByBusinessIdOrderByTransactionDateDesc(Long businessId);
    
    List<BusinessTransaction> findByBusinessIdAndTypeOrderByTransactionDateDesc(Long businessId, TransactionType type);
    
    Optional<BusinessTransaction> findByIdAndBusinessId(Long id, Long businessId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM BusinessTransaction t WHERE t.business.id = :businessId AND t.type = :type AND t.transactionDate = :date")
    BigDecimal getTotalByBusinessIdAndTypeAndDate(@Param("businessId") Long businessId, @Param("type") TransactionType type, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM BusinessTransaction t WHERE t.business.id = :businessId AND t.type = :type AND EXTRACT(MONTH FROM t.transactionDate) = :month AND EXTRACT(YEAR FROM t.transactionDate) = :year")
    BigDecimal getTotalByBusinessIdAndTypeAndMonth(@Param("businessId") Long businessId, @Param("type") TransactionType type, @Param("month") int month, @Param("year") int year);
}
