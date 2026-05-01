package com.ltc.NeuroHire.cv;

import com.ltc.NeuroHire.common.exception.ApiException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
public class CvStorageService {

    @Value("${app.storage.local-dir}")
    private String baseDir;

    private Path root;

    @PostConstruct
    public void init() throws IOException {
        this.root = Paths.get(baseDir).toAbsolutePath().normalize();
        Files.createDirectories(root);
        log.info("CV storage directory initialized: {}", root);
    }

    public StoredFile store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("EMPTY_FILE", "Uploaded file is empty");
        }
        String ext = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.'));
        }
        String storedName = UUID.randomUUID() + ext;
        Path target = root.resolve(storedName);
        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw ApiException.badRequest("STORE_FAILED", "Failed to store file: " + ex.getMessage());
        }
        return new StoredFile(target, target.toString(), original, file.getContentType(), file.getSize());
    }

    public record StoredFile(Path path, String url, String originalName, String contentType, long size) {}
}
