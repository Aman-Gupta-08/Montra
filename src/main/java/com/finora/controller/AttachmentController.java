package com.finora.controller;

import com.finora.entity.Attachment;
import com.finora.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping("/upload")
    public ResponseEntity<Attachment> uploadFile(@RequestParam("file") MultipartFile file, Authentication authentication) throws IOException {
        return ResponseEntity.ok(attachmentService.uploadFile(file, authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attachment> getAttachment(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(attachmentService.getAttachment(id, authentication.getName()));
    }
}
