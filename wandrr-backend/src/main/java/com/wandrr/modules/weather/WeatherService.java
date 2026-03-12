package com.wandrr.modules.weather;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class WeatherService {

    @Value("${openweather.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public WeatherDTO getWeatherByCoords(double lat, double lon) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("No OpenWeatherMap API key configured, returning mock data");
            return WeatherDTO.builder()
                    .temp(24).feelsLike(26)
                    .description("Clear sky").icon("wb_sunny")
                    .city("Your Location").country("")
                    .humidity(60)
                    .build();
        }

        try {
            String url = String.format(
                    "https://api.openweathermap.org/data/2.5/weather?lat=%f&lon=%f&appid=%s&units=metric",
                    lat, lon, apiKey);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response == null)
                throw new RuntimeException("Empty response from weather API");

            @SuppressWarnings("unchecked")
            Map<String, Object> main = (Map<String, Object>) response.get("main");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> weatherList = (List<Map<String, Object>>) response.get("weather");
            Map<String, Object> weatherObj = weatherList.get(0);
            @SuppressWarnings("unchecked")
            Map<String, Object> sys = (Map<String, Object>) response.get("sys");

            return WeatherDTO.builder()
                    .temp(Math.round(((Number) main.get("temp")).doubleValue()))
                    .feelsLike(Math.round(((Number) main.get("feels_like")).doubleValue()))
                    .description(capitalize((String) weatherObj.get("description")))
                    .icon(mapIconCode((String) weatherObj.get("icon")))
                    .city((String) response.get("name"))
                    .country((String) sys.get("country"))
                    .humidity(((Number) main.get("humidity")).intValue())
                    .build();
        } catch (Exception e) {
            log.error("Weather API call failed: {}", e.getMessage());
            return WeatherDTO.builder()
                    .temp(0).feelsLike(0)
                    .description("Unavailable").icon("cloud_queue")
                    .city("Unknown").country("")
                    .humidity(0)
                    .build();
        }
    }

    private String mapIconCode(String code) {
        if (code == null || code.length() < 2)
            return "cloud_queue";
        return switch (code.substring(0, 2)) {
            case "01" -> "wb_sunny";
            case "02", "03" -> "partly_cloudy_day";
            case "04" -> "cloud_queue";
            case "09", "10" -> "rainy";
            case "11" -> "thunderstorm";
            case "13" -> "ac_unit";
            case "50" -> "foggy";
            default -> "cloud_queue";
        };
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty())
            return s;
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    }
}
