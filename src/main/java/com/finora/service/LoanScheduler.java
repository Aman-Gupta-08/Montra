package com.finora.service;

import com.finora.entity.Loan;
import com.finora.entity.LoanStatus;
import com.finora.entity.NotificationType;
import com.finora.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoanScheduler {

    private final LoanRepository loanRepository;
    private final NotificationService notificationService;

    // Run every day at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void markOverdueLoans() {
        log.info("Running scheduled task to mark overdue loans...");
        LocalDate today = LocalDate.now();
        
        List<Loan> loansToMarkOverdue = loanRepository.findLoansToMarkOverdue(today);
        
        for (Loan loan : loansToMarkOverdue) {
            loan.setStatus(LoanStatus.OVERDUE);
            loanRepository.save(loan);
            
            String message = String.format("Your loan with %s for amount %s is now OVERDUE.", 
                    loan.getPersonName(), loan.getRemainingAmount().toString());
            
            notificationService.createNotification(
                    loan.getUser(), 
                    "Loan Overdue", 
                    message, 
                    NotificationType.LOAN_OVERDUE, 
                    loan.getId().toString()
            );
        }
        
        log.info("Marked {} loans as overdue.", loansToMarkOverdue.size());
    }
}
