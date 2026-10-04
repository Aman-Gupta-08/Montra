package com.finora.service;

import com.finora.dto.request.StaffRequest;
import com.finora.dto.response.StaffResponse;
import com.finora.entity.Business;
import com.finora.entity.Staff;
import com.finora.entity.StaffStatus;
import com.finora.exception.ResourceNotFoundException;
import com.finora.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final BusinessService businessService;

    public List<StaffResponse> getAllStaff(String email) {
        try {
            Business business = businessService.getBusinessEntity(email);
            return staffRepository.findByBusinessId(business.getId())
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } catch (ResourceNotFoundException e) {
            return java.util.Collections.emptyList();
        }
    }

    public StaffResponse getStaffById(Long id, String email) {
        Business business = businessService.getBusinessEntity(email);
        Staff staff = staffRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found"));
        return mapToResponse(staff);
    }

    @Transactional
    @SuppressWarnings("null")
    public StaffResponse addStaff(StaffRequest request, String email) {
        Business business = businessService.getBusinessEntity(email);
        
        Staff staff = Staff.builder()
                .business(business)
                .name(request.getName())
                .position(request.getPosition())
                .phone(request.getPhone())
                .joiningDate(request.getJoiningDate())
                .salary(request.getSalary())
                .status(StaffStatus.ACTIVE)
                .build();
                
        staff = staffRepository.save(staff);
        return mapToResponse(staff);
    }

    @Transactional
    @SuppressWarnings("null")
    public StaffResponse updateStaff(Long id, StaffRequest request, String email) {
        Business business = businessService.getBusinessEntity(email);
        Staff staff = staffRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found"));

        staff.setName(request.getName());
        staff.setPosition(request.getPosition());
        staff.setPhone(request.getPhone());
        staff.setJoiningDate(request.getJoiningDate());
        staff.setSalary(request.getSalary());
        
        staff = staffRepository.save(staff);
        return mapToResponse(staff);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteStaff(Long id, String email) {
        Business business = businessService.getBusinessEntity(email);
        Staff staff = staffRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found"));
                
        // Soft delete
        staff.setStatus(StaffStatus.INACTIVE);
        staffRepository.save(staff);
    }

    private StaffResponse mapToResponse(Staff staff) {
        return StaffResponse.builder()
                .id(staff.getId())
                .businessId(staff.getBusiness().getId())
                .name(staff.getName())
                .position(staff.getPosition())
                .phone(staff.getPhone())
                .joiningDate(staff.getJoiningDate())
                .salary(staff.getSalary())
                .status(staff.getStatus())
                .createdAt(staff.getCreatedAt())
                .updatedAt(staff.getUpdatedAt())
                .build();
    }
}
