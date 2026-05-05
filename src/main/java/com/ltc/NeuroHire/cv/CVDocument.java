package com.ltc.NeuroHire.cv;

import com.ltc.NeuroHire.common.audit.BaseEntity;
import com.ltc.NeuroHire.common.enums.ParsingStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cv_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVDocument extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long candidateUserId;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(nullable = false, length = 100)
    private String contentType;

    @Column(nullable = false, length = 500)
    private String fileUrl;

    @Column(nullable = false)
    private long fileSize;

    @Lob
    @Column(name = "extracted_text", columnDefinition = "CLOB")
    private String extractedText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ParsingStatus parsingStatus;

    @Column(length = 500)
    private String parsingError;
}

