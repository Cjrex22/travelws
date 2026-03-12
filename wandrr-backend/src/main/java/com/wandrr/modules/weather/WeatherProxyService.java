package com.wandrr.modules.weather;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class WeatherProxyService {

    @Value("${openweather.api.key:}")
    private String openWeatherKey;

    @GetMapping("/current")
    public ResponseEntity<String> getCurrentWeather(@RequestParam String city) {
        if (openWeatherKey == null || openWeatherKey.isEmpty() || openWeatherKey.contains("PASTE_YOUR")) {
            return generateMockWeather(city);
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + openWeatherKey + "&units=metric";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response;
        } catch (Exception e) {
            return generateMockWeather(city);
        }
    }

    private ResponseEntity<String> generateMockWeather(String city) {
        int temp = (int)(Math.random() * 15) + 20; // 20 to 35 C
        String[] desc = {"Clear sky", "Few clouds", "Scattered clouds", "Light rain"};
        String condition = desc[(int)(Math.random() * desc.length)];
        
        String mockJson = String.format("""
            {
              "weather": [{"description": "%s", "main": "%s"}],
              "main": {"temp": %d},
              "name": "%s"
            }
            """, condition, condition.split(" ")[0], temp, city);
            
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(mockJson);
    }
}
