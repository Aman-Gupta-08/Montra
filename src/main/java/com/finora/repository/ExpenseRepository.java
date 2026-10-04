package com.finora.repository;

import com.finora.entity.Expense;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.finora.entity.ExpenseCategory;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserIdOrderByExpenseDateDesc(Long userId);
    
    Optional<Expense> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal getTotalExpenseByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND EXTRACT(MONTH FROM e.expenseDate) = :month AND EXTRACT(YEAR FROM e.expenseDate) = :year")
    BigDecimal getMonthlyExpenseByUserId(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);

    @Query("SELECT e.category, SUM(e.amount) as total FROM Expense e WHERE e.user.id = :userId GROUP BY e.category ORDER BY total DESC")
    List<Object[]> getTopExpenseCategoriesByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalExpenseBetween(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.category = :category AND e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalExpenseByCategoryAndBetween(@Param("userId") Long userId, @Param("category") ExpenseCategory category, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
