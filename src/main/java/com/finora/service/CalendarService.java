package com.finora.service;

import com.finora.dto.response.CalendarEventResponse;
import com.finora.entity.*;
import com.finora.exception.ResourceNotFoundException;
import com.finora.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final LoanRepository loanRepository;
    private final RecurringExpenseRepository recurringExpenseRepository;
    private final BusinessRepository businessRepository;
    private final SalaryPaymentRepository salaryPaymentRepository;
    private final UserRepository userRepository;

    @SuppressWarnings("null")
    public List<CalendarEventResponse> getCalendarEvents(String email, LocalDate startDate, LocalDate endDate) {
        User user = getUser(email);
        Long userId = user.getId();
        List<CalendarEventResponse> events = new ArrayList<>();

        // 1. Incomes
        List<Income> incomes = incomeRepository.findByUserIdOrderByIncomeDateDesc(userId);
        for (Income inc : incomes) {
            LocalDate d = inc.getIncomeDate();
            if (isInRange(d, startDate, endDate)) {
                boolean isSalary = inc.getSource() == IncomeSource.SALARY;
                events.add(CalendarEventResponse.builder()
                        .id("income-" + inc.getId())
                        .type(isSalary ? "SALARY" : "INCOME")
                        .title((isSalary ? "Salary: " : "Income: ") + (inc.getDescription() != null && !inc.getDescription().isBlank() ? inc.getDescription() : inc.getSource().name()))
                        .amount(inc.getAmount())
                        .date(d)
                        .category(inc.getSource().name())
                        .status("COMPLETED")
                        .description(inc.getDescription())
                        .referenceId(inc.getId())
                        .build());
            }
        }

        // 2. Expenses
        List<Expense> expenses = expenseRepository.findByUserIdOrderByExpenseDateDesc(userId);
        for (Expense exp : expenses) {
            LocalDate d = exp.getExpenseDate();
            if (isInRange(d, startDate, endDate)) {
                events.add(CalendarEventResponse.builder()
                        .id("expense-" + exp.getId())
                        .type("EXPENSE")
                        .title("Expense: " + (exp.getDescription() != null && !exp.getDescription().isBlank() ? exp.getDescription() : exp.getCategory().name()))
                        .amount(exp.getAmount())
                        .date(d)
                        .category(exp.getCategory().name())
                        .status("COMPLETED")
                        .description(exp.getDescription())
                        .referenceId(exp.getId())
                        .build());
            }
        }

        // 3. Loans Due
        List<Loan> loans = loanRepository.findByUserIdOrderByDueDateAsc(userId);
        for (Loan l : loans) {
            LocalDate d = l.getDueDate();
            if (d != null && isInRange(d, startDate, endDate)) {
                String prefix = l.getType() == LoanType.LENT ? "Lent to " : "Borrowed from ";
                events.add(CalendarEventResponse.builder()
                        .id("loan-" + l.getId())
                        .type("LOAN")
                        .title("Loan Due: " + prefix + l.getPersonName())
                        .amount(l.getRemainingAmount())
                        .date(d)
                        .category(l.getType().name())
                        .status(l.getStatus().name())
                        .description(l.getDescription() != null ? l.getDescription() : "Due date for " + l.getPersonName())
                        .referenceId(l.getId())
                        .build());
            }
        }

        // 4. Recurring Bills
        List<RecurringExpense> recs = recurringExpenseRepository.findByUserIdOrderByNextDueDateAsc(userId);
        for (RecurringExpense rec : recs) {
            LocalDate d = rec.getNextDueDate();
            if (d != null && isInRange(d, startDate, endDate)) {
                events.add(CalendarEventResponse.builder()
                        .id("bill-" + rec.getId())
                        .type("BILL")
                        .title("Bill: " + rec.getName())
                        .amount(rec.getAmount())
                        .date(d)
                        .category(rec.getCategory().name())
                        .status(Boolean.TRUE.equals(rec.getIsActive()) ? "UPCOMING" : "PAUSED")
                        .description("Recurring bill (" + rec.getFrequency().name() + ")")
                        .referenceId(rec.getId())
                        .build());
            }
        }

        // 5. Staff Salaries (if Business Owner)
        businessRepository.findByUserId(userId).ifPresent(biz -> {
            List<SalaryPayment> payments = salaryPaymentRepository.findByBusinessIdAndStatus(biz.getId(), SalaryStatus.PAID);
            for (SalaryPayment sp : payments) {
                LocalDate d = sp.getPaymentDate();
                if (d != null && isInRange(d, startDate, endDate)) {
                    events.add(CalendarEventResponse.builder()
                            .id("salary-staff-" + sp.getId())
                            .type("SALARY")
                            .title("Salary: " + sp.getStaff().getName())
                            .amount(sp.getAmount())
                            .date(d)
                            .category("STAFF_SALARY")
                            .status(sp.getStatus().name())
                            .description("Salary for " + sp.getSalaryMonth())
                            .referenceId(sp.getId())
                            .build());
                }
            }
        });

        events.sort(Comparator.comparing(CalendarEventResponse::getDate));
        return events;
    }

    private boolean isInRange(LocalDate d, LocalDate start, LocalDate end) {
        if (d == null) return false;
        if (start != null && d.isBefore(start)) return false;
        if (end != null && d.isAfter(end)) return false;
        return true;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
