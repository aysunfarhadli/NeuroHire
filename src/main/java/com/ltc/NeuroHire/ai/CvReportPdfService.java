package com.ltc.NeuroHire.ai;

import com.ltc.NeuroHire.ai.dto.CvAnalysisAi;
import com.ltc.NeuroHire.auth.User;
import com.ltc.NeuroHire.common.enums.Recommendation;
import com.ltc.NeuroHire.cv.CVDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Renders a candidate-facing AI CV analysis report as a branded PDF using PDFBox 3.
 * Single document, paginates automatically when content overflows.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CvReportPdfService {

    private static final PDFont SANS = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
    private static final PDFont SANS_BOLD = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

    private static final Color BRAND   = new Color(124, 92, 255);
    private static final Color BRAND_2 = new Color(56, 189, 248);
    private static final Color FG      = new Color(28, 32, 48);
    private static final Color MUTED   = new Color(115, 121, 145);
    private static final Color GREEN   = new Color(16, 185, 129);
    private static final Color AMBER   = new Color(245, 158, 11);
    private static final Color RED     = new Color(239, 68, 68);
    private static final Color SURFACE = new Color(247, 248, 252);
    private static final Color BORDER  = new Color(228, 231, 240);

    private static final float MARGIN = 50f;

    public byte[] generate(CVDocument cv, CvAnalysisAi a, User candidate) {
        try (PDDocument doc = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Cursor cur = new Cursor(doc, MARGIN);
            cur.openPage();

            renderHeader(cur, candidate, cv);
            cur.gap(18);

            renderScorePanel(cur, a);
            cur.gap(20);

            renderBreakdown(cur, a);
            cur.gap(20);

            renderSummary(cur, a);
            cur.gap(16);

            renderTwoCols(cur, "Strengths", a.strengths(), GREEN, "Weaknesses", a.weaknesses(), AMBER);
            cur.gap(16);

            renderChips(cur, "Technical skills detected", a.technicalSkills(), BRAND);
            cur.gap(10);
            renderChips(cur, "Missing keywords", a.missingKeywords(), RED);
            cur.gap(16);

            renderTextBlock(cur, "HR explanation", a.hrExplanation());
            cur.gap(12);
            renderTextBlock(cur, "Feedback for the candidate", a.candidateFeedback());

            if (a.interviewQuestions() != null && !a.interviewQuestions().isEmpty()) {
                cur.gap(16);
                renderInterview(cur, a.interviewQuestions());
            }

            if (a.riskFlags() != null && !a.riskFlags().isEmpty()) {
                cur.gap(16);
                renderRiskFlags(cur, a.riskFlags());
            }

            renderFooterAllPages(cur);
            cur.close();
            doc.save(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Failed to render CV PDF", e);
            throw new IllegalStateException("Failed to render CV report", e);
        }
    }

    /* ---------- sections ---------- */

    private void renderHeader(Cursor cur, User candidate, CVDocument cv) throws Exception {
        // Brand band
        cur.fillRect(MARGIN, cur.y - 56, cur.contentWidth(), 56, BRAND);
        cur.fillRect(MARGIN, cur.y - 56, cur.contentWidth() * 0.55f, 56, blend(BRAND, BRAND_2, 0.5f));

        // White brand mark + title on the band
        cur.text(MARGIN + 18, cur.y - 24, SANS_BOLD, 14, Color.WHITE, "HireMind AI");
        cur.text(MARGIN + 18, cur.y - 41, SANS, 9, new Color(255, 255, 255, 200),
                "AI CV Analysis Report · generated " +
                ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm 'UTC'")));
        cur.y -= 56;
        cur.gap(14);

        // Candidate identity row
        String name = candidate.getFullName() == null ? "—" : candidate.getFullName();
        cur.text(MARGIN, cur.y, SANS_BOLD, 18, FG, name);
        cur.y -= 22;
        cur.text(MARGIN, cur.y, SANS, 10, MUTED,
                cv.getFileName() + "  ·  " + (candidate.getEmail() == null ? "" : candidate.getEmail()));
        cur.y -= 14;
    }

    private void renderScorePanel(Cursor cur, CvAnalysisAi a) throws Exception {
        float panelH = 84;
        float boxX = MARGIN, boxY = cur.y - panelH;
        cur.fillRect(boxX, boxY, cur.contentWidth(), panelH, SURFACE);
        cur.strokeRect(boxX, boxY, cur.contentWidth(), panelH, BORDER);

        // Big number
        cur.text(boxX + 22, cur.y - 30, SANS_BOLD, 36, BRAND, String.valueOf(a.matchScore()));
        cur.text(boxX + 22 + 64, cur.y - 26, SANS, 9, MUTED, "MATCH SCORE / 100");

        Color recColor = recColor(a.recommendation());
        cur.text(boxX + 22 + 64, cur.y - 42, SANS_BOLD, 11, recColor,
                a.recommendation().name().replace('_', ' '));

        // Confidence line
        String conf = "AI confidence " + Math.round(a.aiConfidence() * 100) + "%  ·  Level " + a.candidateLevel().name();
        cur.text(boxX + cur.contentWidth() - 22, cur.y - 30, SANS, 10, MUTED, conf, true);

        cur.y -= panelH;
    }

    private void renderBreakdown(Cursor cur, CvAnalysisAi a) throws Exception {
        cur.text(MARGIN, cur.y, SANS_BOLD, 11, FG, "Score breakdown");
        cur.y -= 16;

        String[] labels = {"Skills", "Experience", "Education", "Domain", "ATS"};
        int[] values = {
                a.scoreBreakdown().skills(), a.scoreBreakdown().experience(),
                a.scoreBreakdown().education(), a.scoreBreakdown().domain(),
                a.scoreBreakdown().atsFormat()
        };
        float gap = 10f;
        float w = (cur.contentWidth() - gap * 4) / 5f;

        for (int i = 0; i < 5; i++) {
            float bx = MARGIN + i * (w + gap);
            float by = cur.y - 50;
            cur.fillRect(bx, by, w, 50, SURFACE);
            cur.strokeRect(bx, by, w, 50, BORDER);
            cur.text(bx + 8, cur.y - 14, SANS, 8, MUTED, labels[i].toUpperCase());
            cur.text(bx + 8, cur.y - 32, SANS_BOLD, 18, FG, String.valueOf(values[i]));
            // mini bar
            cur.fillRect(bx + 8, by + 8, w - 16, 3, BORDER);
            float pct = Math.min(100, Math.max(0, values[i])) / 100f;
            cur.fillRect(bx + 8, by + 8, (w - 16) * pct, 3, BRAND);
        }
        cur.y -= 50;
    }

    private void renderSummary(Cursor cur, CvAnalysisAi a) throws Exception {
        cur.text(MARGIN, cur.y, SANS_BOLD, 11, FG, "Professional summary");
        cur.y -= 14;
        wrappedText(cur, a.professionalSummary(), SANS, 10, FG, cur.contentWidth());
    }

    private void renderTwoCols(Cursor cur,
                               String leftTitle, List<String> leftItems, Color leftBullet,
                               String rightTitle, List<String> rightItems, Color rightBullet) throws Exception {
        float colGap = 14;
        float colW = (cur.contentWidth() - colGap) / 2f;

        float startY = cur.y;
        float leftY = renderBulletList(cur, MARGIN, startY, colW, leftTitle, leftItems, leftBullet);
        float rightY = renderBulletList(cur, MARGIN + colW + colGap, startY, colW, rightTitle, rightItems, rightBullet);
        cur.y = Math.min(leftY, rightY);
    }

    private float renderBulletList(Cursor cur, float x, float startY, float colW,
                                   String title, List<String> items, Color bullet) throws Exception {
        float y = startY;
        cur.text(x, y, SANS_BOLD, 11, FG, title);
        y -= 14;
        if (items == null || items.isEmpty()) {
            cur.text(x, y, SANS, 10, MUTED, "—");
            return y - 12;
        }
        for (String it : items) {
            cur.ensure(40);
            if (cur.y != y) y = cur.y; // page broke
            cur.fillRect(x, y - 4, 4, 4, bullet);
            float used = wrappedTextAt(cur, x + 10, y, it, SANS, 10, FG, colW - 10);
            y -= used + 4;
            cur.y = y;
        }
        return y;
    }

    private void renderChips(Cursor cur, String title, List<String> items, Color tone) throws Exception {
        cur.text(MARGIN, cur.y, SANS_BOLD, 11, FG, title);
        cur.y -= 14;
        if (items == null || items.isEmpty()) {
            cur.text(MARGIN, cur.y, SANS, 10, MUTED, "—");
            cur.y -= 12;
            return;
        }
        float chipH = 14, chipPad = 6, gap = 5;
        float lineX = MARGIN;
        float maxX = MARGIN + cur.contentWidth();
        for (String it : items) {
            float w = stringWidth(SANS, 10, it) + chipPad * 2;
            if (lineX + w > maxX) {
                cur.y -= chipH + gap;
                lineX = MARGIN;
                cur.ensure(chipH + gap);
            }
            Color tinted = withAlpha(tone, 26);
            cur.fillRect(lineX, cur.y - chipH + 2, w, chipH, tinted);
            cur.text(lineX + chipPad, cur.y - 9, SANS, 10, tone, it);
            lineX += w + gap;
        }
        cur.y -= chipH + 4;
    }

    private void renderTextBlock(Cursor cur, String title, String body) throws Exception {
        if (body == null || body.isBlank()) return;
        cur.text(MARGIN, cur.y, SANS_BOLD, 11, FG, title);
        cur.y -= 14;
        wrappedText(cur, body, SANS, 10, FG, cur.contentWidth());
    }

    private void renderInterview(Cursor cur, List<CvAnalysisAi.InterviewQuestion> qs) throws Exception {
        cur.text(MARGIN, cur.y, SANS_BOLD, 11, FG, "Interview prep");
        cur.y -= 14;
        for (CvAnalysisAi.InterviewQuestion q : qs.subList(0, Math.min(qs.size(), 4))) {
            cur.ensure(50);
            cur.text(MARGIN, cur.y, SANS_BOLD, 10, FG, "• " + q.question());
            cur.y -= 13;
            wrappedText(cur, "Why: " + q.reason(), SANS, 9, MUTED, cur.contentWidth());
            cur.gap(6);
        }
    }

    private void renderRiskFlags(Cursor cur, List<String> flags) throws Exception {
        cur.text(MARGIN, cur.y, SANS_BOLD, 11, RED, "Risk flags");
        cur.y -= 14;
        for (String f : flags) {
            cur.ensure(20);
            cur.fillRect(MARGIN, cur.y - 4, 4, 4, RED);
            wrappedTextAt(cur, MARGIN + 10, cur.y, f, SANS, 10, FG, cur.contentWidth() - 10);
            cur.y -= 4;
        }
    }

    private void renderFooterAllPages(Cursor cur) throws Exception {
        int total = cur.doc.getNumberOfPages();
        for (int i = 0; i < total; i++) {
            PDPage page = cur.doc.getPage(i);
            try (PDPageContentStream cs = new PDPageContentStream(cur.doc, page,
                    PDPageContentStream.AppendMode.APPEND, true)) {
                cs.setNonStrokingColor(MUTED);
                cs.beginText();
                cs.setFont(SANS, 8);
                cs.newLineAtOffset(MARGIN, 28);
                cs.showText("HireMind AI · This report is decision support, not a final decision.");
                cs.endText();
                String pageNum = "Page " + (i + 1) + " / " + total;
                float w = stringWidth(SANS, 8, pageNum);
                cs.beginText();
                cs.setFont(SANS, 8);
                cs.newLineAtOffset(page.getMediaBox().getWidth() - MARGIN - w, 28);
                cs.showText(pageNum);
                cs.endText();
            }
        }
    }

    /* ---------- helpers ---------- */

    private static Color recColor(Recommendation r) {
        return switch (r) {
            case STRONG_MATCH -> GREEN;
            case POTENTIAL_MATCH -> AMBER;
            case WEAK_MATCH -> RED;
        };
    }

    private static Color blend(Color a, Color b, float t) {
        int r = Math.round(a.getRed()   * (1 - t) + b.getRed()   * t);
        int g = Math.round(a.getGreen() * (1 - t) + b.getGreen() * t);
        int bl = Math.round(a.getBlue()  * (1 - t) + b.getBlue()  * t);
        return new Color(r, g, bl);
    }

    private static Color withAlpha(Color c, int alpha) {
        return new Color(c.getRed(), c.getGreen(), c.getBlue(), Math.max(0, Math.min(255, alpha)));
    }

    private static float stringWidth(PDFont font, float size, String s) {
        try {
            return font.getStringWidth(s) / 1000f * size;
        } catch (Exception e) {
            return s.length() * size * 0.55f;
        }
    }

    private void wrappedText(Cursor cur, String text, PDFont font, float size, Color color, float maxWidth) throws Exception {
        if (text == null) return;
        float used = wrappedTextAt(cur, MARGIN, cur.y, text, font, size, color, maxWidth);
        cur.y -= used;
    }

    /** Returns total height consumed below the starting y. */
    private float wrappedTextAt(Cursor cur, float x, float y, String text, PDFont font, float size, Color color, float maxWidth) throws Exception {
        if (text == null) return 0;
        List<String> lines = wrapLines(text.replace("\r", ""), font, size, maxWidth);
        float lineH = size + 4;
        float consumed = 0;
        for (String line : lines) {
            cur.ensure(lineH + 8);
            if (cur.y != y) { y = cur.y; }
            cur.text(x, y - lineH * 0.8f, font, size, color, line);
            y -= lineH;
            consumed += lineH;
        }
        return consumed;
    }

    private static List<String> wrapLines(String text, PDFont font, float size, float maxWidth) {
        List<String> out = new ArrayList<>();
        for (String paragraph : text.split("\n")) {
            String[] words = paragraph.split(" ");
            StringBuilder line = new StringBuilder();
            for (String w : words) {
                String candidate = line.length() == 0 ? w : line + " " + w;
                if (stringWidth(font, size, candidate) > maxWidth && line.length() > 0) {
                    out.add(line.toString());
                    line = new StringBuilder(w);
                } else {
                    line = new StringBuilder(candidate);
                }
            }
            if (line.length() > 0) out.add(line.toString());
            if (paragraph.isEmpty()) out.add("");
        }
        return out;
    }

    /* ---------- cursor + page management ---------- */

    private static class Cursor {
        final PDDocument doc;
        final float margin;
        PDPage page;
        PDPageContentStream cs;
        float y;
        float pageHeight;
        float pageWidth;

        Cursor(PDDocument doc, float margin) {
            this.doc = doc;
            this.margin = margin;
        }

        void openPage() throws Exception {
            page = new PDPage(PDRectangle.A4);
            doc.addPage(page);
            pageHeight = page.getMediaBox().getHeight();
            pageWidth = page.getMediaBox().getWidth();
            if (cs != null) cs.close();
            cs = new PDPageContentStream(doc, page);
            y = pageHeight - margin;
        }

        float contentWidth() { return pageWidth - margin * 2; }

        void close() throws Exception { if (cs != null) cs.close(); }

        void gap(float h) { y -= h; }

        void ensure(float needed) throws Exception {
            if (y - needed < margin + 30) openPage();
        }

        void text(float x, float y, PDFont font, float size, Color color, String s) throws Exception {
            text(x, y, font, size, color, s, false);
        }

        void text(float x, float y, PDFont font, float size, Color color, String s, boolean rightAlign) throws Exception {
            if (s == null) return;
            cs.setNonStrokingColor(color);
            cs.beginText();
            cs.setFont(font, size);
            float drawX = rightAlign ? x - stringWidth(font, size, s) : x;
            cs.newLineAtOffset(drawX, y);
            cs.showText(safe(s));
            cs.endText();
        }

        void fillRect(float x, float y, float w, float h, Color color) throws Exception {
            cs.setNonStrokingColor(color);
            cs.addRect(x, y, w, h);
            cs.fill();
        }

        void strokeRect(float x, float y, float w, float h, Color color) throws Exception {
            cs.setStrokingColor(color);
            cs.setLineWidth(0.5f);
            cs.addRect(x, y, w, h);
            cs.stroke();
        }

        private static String safe(String s) {
            // PDFBox Helvetica supports WinAnsiEncoding only — strip emoji and exotic chars.
            return s.replaceAll("[^\\x20-\\x7E\\u00A0-\\u00FF]", "?");
        }
    }
}
