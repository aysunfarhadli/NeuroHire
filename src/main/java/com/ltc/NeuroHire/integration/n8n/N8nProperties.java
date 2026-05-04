package com.ltc.NeuroHire.integration.n8n;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.n8n")
public class N8nProperties {
    private boolean enabled = false;
    private String webhookUrl = "";
    private int timeoutMs = 4000;
}
