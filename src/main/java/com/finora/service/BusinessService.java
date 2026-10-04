package com.finora.service;

import com.finora.dto.request.BusinessRequest;
import com.finora.dto.request.BusinessTransactionRequest;
import com.finora.dto.response.BusinessDashboardResponse;
import com.finora.dto.response.BusinessResponse;
import com.finora.dto.response.BusinessTransactionResponse;
import com.finora.entity.Business;
import com.finora.entity.BusinessTransaction;
import com.finora.entity.StaffStatus;
import com.finora.entity.TransactionType;
import com.finora.entity.User;
import com.finora.exception.ResourceNotFoundException;
import com.finora.repository.BusinessRepository;
import com.finora.repository.BusinessTransactionRepository;
import com.finora.repository.LoanRepository;
import com.finora.repository.SalaryPaymentRepository;
import com.finora.repository.StaffRepository;
import com.finora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessService {

    private final BusinessRepository businessRepository;
    private final BusinessTransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    private final SalaryPaymentRepository salaryPaymentRepository;
    private final LoanRepository loanRepository;

    @Transactional
    @SuppressWarnings("null")
    public BusinessResponse createBusiness(BusinessRequest request, String email) {
        User user = getUser(email);
        
        if (businessRepository.findByUserId(user.getId()).isPresent()) {
            throw new IllegalStateException("Business already exists for this user");
        }

        Business business = Business.builder()
                .user(user)
                .businessName(request.getBusinessName())
                .businessType(request.getBusinessType())
                .location(request.getLocation())
                .description(request.getDescription())
                .build();
        
        business = businessRepository.save(business);
        return mapToResponse(business);
    }

    public BusinessResponse getBusiness(String email) {
        User user = getUser(email);
        return businessRepository.findByUserId(user.getId())
                .map(this::mapToResponse)
                .orElse(null);
    }

    @Transactional
    @SuppressWarnings("null")
    public BusinessResponse updateBusiness(BusinessRequest request, String email) {
        Business business = getBusinessEntity(email);
        
        business.setBusinessName(request.getBusinessName());
        business.setBusinessType(request.getBusinessType());
        business.setLocation(request.getLocation());
        business.setDescription(request.getDescription());
        
        business = businessRepository.save(business);
        return mapToResponse(business);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteBusiness(String email) {
        Business business = getBusinessEntity(email);
        businessRepository.delete(business);
    }

    // Transactions

    public List<BusinessTransactionResponse> getAllTransactions(String email) {
        User user = getUser(email);
        java.util.Optional<Business> businessOpt = businessRepository.findByUserId(user.getId());
        if (businessOpt.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        Business business = businessOpt.get();
        return transactionRepository.findByBusinessIdOrderByTransactionDateDesc(business.getId())
                .stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @SuppressWarnings("null")
    public BusinessTransactionResponse addTransaction(BusinessTransactionRequest request, TransactionType type, String email) {
        Business business = getBusinessEntity(email);
        
        BusinessTransaction transaction = BusinessTransaction.builder()
                .business(business)
                .type(type)
                .amount(request.getAmount())
                .transactionDate(request.getTransactionDate())
                .description(request.getDescription())
                .paymentMethod(request.getPaymentMethod())
                .attachmentId(request.getAttachmentId())
                .build();
                
        transaction = transactionRepository.save(transaction);
        return mapToTransactionResponse(transaction);
    }

    @Transactional
    @SuppressWarnings("null")
    public BusinessTransactionResponse updateTransaction(Long id, BusinessTransactionRequest request, String email) {
        Business business = getBusinessEntity(email);
        BusinessTransaction transaction = transactionRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        transaction.setAmount(request.getAmount());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setDescription(request.getDescription());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setAttachmentId(request.getAttachmentId());

        transaction = transactionRepository.save(transaction);
        return mapToTransactionResponse(transaction);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteTransaction(Long id, String email) {
        Business business = getBusinessEntity(email);
        BusinessTransaction transaction = transactionRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        
        transactionRepository.delete(transaction);
    }

    // Dashboard & Profit Logic

    public BusinessDashboardResponse getDashboard(String email) {
        User user = getUser(email);
        java.util.Optional<Business> businessOpt = businessRepository.findByUserId(user.getId());
        long overdueLoansCount = loanRepository.findOverdueLoansByUserId(user.getId()).size();

        if (businessOpt.isEmpty()) {
            return BusinessDashboardResponse.builder()
                    .todaysSales(BigDecimal.ZERO)
                    .todaysExpenses(BigDecimal.ZERO)
                    .todaysProfit(BigDecimal.ZERO)
                    .monthlySales(BigDecimal.ZERO)
                    .monthlyExpenses(BigDecimal.ZERO)
                    .monthlyProfit(BigDecimal.ZERO)
                    .pendingSalaries(BigDecimal.ZERO)
                    .activeStaffCount(0L)
                    .overdueLoansCount(overdueLoansCount)
                    .build();
        }

        Business business = businessOpt.get();
        Long businessId = business.getId();
        
        LocalDate today = LocalDate.now();
        int month = today.getMonthValue();
        int year = today.getYear();

        BigDecimal todaysSales = transactionRepository.getTotalByBusinessIdAndTypeAndDate(businessId, TransactionType.SALE, today);
        BigDecimal todaysExpenses = transactionRepository.getTotalByBusinessIdAndTypeAndDate(businessId, TransactionType.EXPENSE, today);
        BigDecimal todaysProfit = todaysSales.subtract(todaysExpenses);

        BigDecimal monthlySales = transactionRepository.getTotalByBusinessIdAndTypeAndMonth(businessId, TransactionType.SALE, month, year);
        BigDecimal monthlyExpenses = transactionRepository.getTotalByBusinessIdAndTypeAndMonth(businessId, TransactionType.EXPENSE, month, year);
        BigDecimal monthlyProfit = monthlySales.subtract(monthlyExpenses);

        BigDecimal pendingSalaries = salaryPaymentRepository.getTotalPendingSalariesByBusinessId(businessId);
        long activeStaffCount = staffRepository.countByBusinessIdAndStatus(businessId, StaffStatus.ACTIVE);

        return BusinessDashboardResponse.builder()
                .todaysSales(todaysSales)
                .todaysExpenses(todaysExpenses)
                .todaysProfit(todaysProfit)
                .monthlySales(monthlySales)
                .monthlyExpenses(monthlyExpenses)
                .monthlyProfit(monthlyProfit)
                .pendingSalaries(pendingSalaries)
                .activeStaffCount(activeStaffCount)
                .overdueLoansCount(overdueLoansCount)
                .build();
    }

    public Business getBusinessEntity(String email) {
        User user = getUser(email);
        return businessRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Business not found for user"));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private BusinessResponse mapToResponse(Business business) {
        return BusinessResponse.builder()
                .id(business.getId())
                .userId(business.getUser().getId())
                .businessName(business.getBusinessName())
                .businessType(business.getBusinessType())
                .location(business.getLocation())
                .description(business.getDescription())
                .createdAt(business.getCreatedAt())
                .updatedAt(business.getUpdatedAt())
                .build();
    }

    private BusinessTransactionResponse mapToTransactionResponse(BusinessTransaction t) {
        return BusinessTransactionResponse.builder()
                .id(t.getId())
                .businessId(t.getBusiness().getId())
                .type(t.getType())
                .amount(t.getAmount())
                .transactionDate(t.getTransactionDate())
                .paymentMethod(t.getPaymentMethod())
                .description(t.getDescription())
                .attachmentId(t.getAttachmentId())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
