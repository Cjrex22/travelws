package com.wandrr.modules.weather;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/api/weather")
    public ResponseEntity<WeatherDTO> getWeather(
            @RequestParam double lat,
            @RequestParam double lon) {
        return ResponseEntity.ok(weatherService.getWeatherByCoords(lat, lon));
    }
}
