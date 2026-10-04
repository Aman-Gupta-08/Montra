package com.finora.repository;

import com.finora.entity.Loan;
import com.finora.entity.LoanType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserIdOrderByDueDateAsc(Long userId);
    
    Optional<Loan> findByIdAndUserId(Long id, Long userId);

    List<Loan> findByUserIdAndTypeOrderByDueDateAsc(Long userId, LoanType type);
    
    @Query("SELECT l FROM Loan l WHERE l.user.id = :userId AND l.status = 'OVERDUE' ORDER BY l.dueDate ASC")
    List<Loan> findOverdueLoansByUserId(@Param("userId") Long userId);

    @Query("SELECT l FROM Loan l WHERE l.dueDate < :today AND l.remainingAmount > 0 AND l.status != 'OVERDUE'")
    List<Loan> findLoansToMarkOverdue(@Param("today") LocalDate today);

    @Query("SELECT COALESCE(SUM(l.remainingAmount), 0) FROM Loan l WHERE l.user.id = :userId AND l.type = :type AND l.status != 'CANCELLED'")
    BigDecimal getTotalRemainingByTypeAndUserId(@Param("userId") Long userId, @Param("type") LoanType type);
}
