package com.finora.repository;

import com.finora.entity.Staff;
import com.finora.entity.StaffStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findByBusinessId(Long businessId);
    
    Optional<Staff> findByIdAndBusinessId(Long id, Long businessId);
    
    long countByBusinessIdAndStatus(Long businessId, StaffStatus status);
}
