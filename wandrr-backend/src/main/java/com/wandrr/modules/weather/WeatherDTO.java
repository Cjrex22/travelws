package com.wandrr.modules.weather;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherDTO {
    private long temp;
    private long feelsLike;
    private String description;
    private String icon;
    private String city;
    private String country;
    private int humidity;
}
