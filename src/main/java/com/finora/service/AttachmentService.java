package com.finora.service;

import com.finora.entity.Attachment;
import com.finora.entity.User;
import com.finora.exception.ResourceNotFoundException;
import com.finora.repository.AttachmentRepository;
import com.finora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    
    private final String UPLOAD_DIR = "uploads/";

    @Transactional
    @SuppressWarnings("null")
    public Attachment uploadFile(MultipartFile file, String email) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String uniqueFileName = UUID.randomUUID().toString() + extension;
        Path filePath = Paths.get(UPLOAD_DIR + uniqueFileName);
        
        Files.copy(file.getInputStream(), filePath);

        Attachment attachment = Attachment.builder()
                .user(user)
                .fileName(originalFilename)
                .fileUrl("/" + UPLOAD_DIR + uniqueFileName) // In reality, this would be an S3 URL
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .build();

        return attachmentRepository.save(attachment);
    }
    
    public Attachment getAttachment(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return attachmentRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));
    }
}
