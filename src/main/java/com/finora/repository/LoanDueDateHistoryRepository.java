package com.finora.repository;

import com.finora.entity.LoanDueDateHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanDueDateHistoryRepository extends JpaRepository<LoanDueDateHistory, Long> {
    List<LoanDueDateHistory> findByLoanIdOrderByCreatedAtDesc(Long loanId);
}
