package com.finora.service;

import com.finora.dto.request.IncomeRequest;
import com.finora.dto.response.IncomeResponse;
import com.finora.entity.Income;
import com.finora.entity.User;
import com.finora.exception.ResourceNotFoundException;
import com.finora.repository.IncomeRepository;
import com.finora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public List<IncomeResponse> getAllIncomes(String email) {
        User user = getUser(email);
        return incomeRepository.findByUserIdOrderByIncomeDateDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public IncomeResponse getIncomeById(Long id, String email) {
        User user = getUser(email);
        Income income = incomeRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Income not found"));
        return mapToResponse(income);
    }

    @Transactional
    @SuppressWarnings("null")
    public IncomeResponse createIncome(IncomeRequest request, String email) {
        User user = getUser(email);
        Income income = Income.builder()
                .user(user)
                .source(request.getSource())
                .amount(request.getAmount())
                .incomeDate(request.getIncomeDate())
                .description(request.getDescription())
                .paymentMethod(request.getPaymentMethod())
                .attachmentId(request.getAttachmentId())
                .build();
        
        income = incomeRepository.save(income);
        return mapToResponse(income);
    }

    @Transactional
    @SuppressWarnings("null")
    public IncomeResponse updateIncome(Long id, IncomeRequest request, String email) {
        User user = getUser(email);
        Income income = incomeRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Income not found"));

        income.setSource(request.getSource());
        income.setAmount(request.getAmount());
        income.setIncomeDate(request.getIncomeDate());
        income.setDescription(request.getDescription());
        income.setPaymentMethod(request.getPaymentMethod());
        income.setAttachmentId(request.getAttachmentId());

        income = incomeRepository.save(income);
        return mapToResponse(income);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteIncome(Long id, String email) {
        User user = getUser(email);
        Income income = incomeRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Income not found"));
        incomeRepository.delete(income);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private IncomeResponse mapToResponse(Income income) {
        return IncomeResponse.builder()
                .id(income.getId())
                .source(income.getSource())
                .amount(income.getAmount())
                .incomeDate(income.getIncomeDate())
                .description(income.getDescription())
                .paymentMethod(income.getPaymentMethod())
                .attachmentId(income.getAttachmentId())
                .createdAt(income.getCreatedAt())
                .updatedAt(income.getUpdatedAt())
                .build();
    }
}
