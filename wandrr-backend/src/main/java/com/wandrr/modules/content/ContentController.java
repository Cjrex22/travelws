package com.wandrr.modules.content;

import com.wandrr.exception.ResourceNotFoundException;
import com.wandrr.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentRepository contentRepository;

    @GetMapping("/{section}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getContent(
            @PathVariable String section) {
        AppContent.Section sectionEnum;
        try {
            sectionEnum = AppContent.Section.valueOf(section.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException("Content section not found: " + section);
        }

        AppContent content = contentRepository.findBySection(sectionEnum)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found."));

        return ResponseEntity.ok(ApiResponse.success("Content retrieved.", content.getContentJson()));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = Map.of(
                "total_trips_planned", "50k+",
                "destinations_count", "120+");
        return ResponseEntity.ok(ApiResponse.success("Stats retrieved.", stats));
    }
}
