package com.ltc.NeuroHire.integration.n8n;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ltc.NeuroHire.common.event.HireMindEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Forwards platform domain events to a configured n8n webhook so workflow automations
 * (Slack notifications, ATS sync, email follow-ups, etc.) can be wired without touching code.
 *
 * Configure via:
 *   app.n8n.enabled=true
 *   app.n8n.webhook-url=https://n8n.example.com/webhook/hiremind
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class N8nEventPublisher {

    private final N8nProperties props;
    private final ObjectMapper mapper;

    @Async
    @EventListener
    public void onHireMindEvent(HireMindEvent event) {
        if (!props.isEnabled() || props.getWebhookUrl() == null || props.getWebhookUrl().isBlank()) {
            log.trace("n8n disabled, skipping event {}", event.type());
            return;
        }
        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofMillis(props.getTimeoutMs()))
                    .build();
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(props.getWebhookUrl()))
                    .timeout(Duration.ofMillis(props.getTimeoutMs()))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(event)))
                    .build();
            HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() / 100 != 2) {
                log.warn("n8n webhook returned {} for event {}: {}", resp.statusCode(), event.type(), resp.body());
            } else {
                log.debug("n8n forwarded event {} ({} bytes)", event.type(), resp.body() == null ? 0 : resp.body().length());
            }
        } catch (Exception ex) {
            log.warn("n8n webhook publish failed for {}: {}", event.type(), ex.getMessage());
        }
    }
}
