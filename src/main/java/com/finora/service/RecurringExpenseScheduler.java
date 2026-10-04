package com.finora.service;

import com.finora.entity.Frequency;
import com.finora.entity.NotificationType;
import com.finora.entity.RecurringExpense;
import com.finora.repository.RecurringExpenseRepository;
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
public class RecurringExpenseScheduler {

    private final RecurringExpenseRepository recurringExpenseRepository;
    private final NotificationService notificationService;

    // Run every day at 00:05 AM
    @Scheduled(cron = "0 5 0 * * ?")
    @Transactional
    public void processDueRecurringExpenses() {
        log.info("Running scheduled task for due recurring expenses...");
        LocalDate today = LocalDate.now();

        List<RecurringExpense> dueExpenses = recurringExpenseRepository
                .findByIsActiveTrueAndNextDueDateLessThanEqual(today);

        for (RecurringExpense expense : dueExpenses) {
            String message = String.format("Recurring bill '%s' for amount %s is due today.",
                    expense.getName(), expense.getAmount().toString());

            notificationService.createNotification(
                    expense.getUser(),
                    "Bill Due",
                    message,
                    NotificationType.BILL_DUE,
                    expense.getId().toString()
            );

            // Advance next due date based on frequency
            LocalDate currentDue = expense.getNextDueDate() != null ? expense.getNextDueDate() : today;
            LocalDate nextDue = calculateNextDueDate(currentDue, expense.getFrequency());

            if (expense.getEndDate() != null && nextDue.isAfter(expense.getEndDate())) {
                expense.setIsActive(false);
            } else {
                expense.setNextDueDate(nextDue);
            }

            recurringExpenseRepository.save(expense);
        }

        log.info("Processed {} due recurring expenses.", dueExpenses.size());
    }

    private LocalDate calculateNextDueDate(LocalDate fromDate, Frequency frequency) {
        if (frequency == null) {
            return fromDate.plusMonths(1);
        }
        return switch (frequency) {
            case DAILY -> fromDate.plusDays(1);
            case WEEKLY -> fromDate.plusWeeks(1);
            case MONTHLY -> fromDate.plusMonths(1);
            case YEARLY -> fromDate.plusYears(1);
        };
    }
}
