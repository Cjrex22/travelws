package com.wandrr.modules.content;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class UnsplashService {

    @Value("${unsplash.access.key:}")
    private String unsplashKey;

    @GetMapping("/destination")
    public ResponseEntity<String> getDestinationPhoto(@RequestParam String query) {
        if (unsplashKey == null || unsplashKey.isEmpty() || unsplashKey.contains("PASTE_YOUR")) {
            return generateMockUnsplashResponse(query);
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.unsplash.com/search/photos?page=1&per_page=1&query=" + query + "&client_id=" + unsplashKey;
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response;
        } catch (Exception e) {
            return generateMockUnsplashResponse(query);
        }
    }

    private ResponseEntity<String> generateMockUnsplashResponse(String query) {
        // Very basic mock structure returning a random landscape photo from Unsplash source
        String mockJson = String.format("""
            {
               "results": [
                  {
                     "urls": {
                         "regular": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800"
                     },
                     "user": {
                         "name": "Wanderlust Photographer"
                     }
                  }
               ]
            }
            """);
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(mockJson);
    }
}
