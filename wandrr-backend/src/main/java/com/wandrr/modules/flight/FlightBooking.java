package com.wandrr.modules.flight;

import com.wandrr.modules.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "flight_bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "flight_data_json", columnDefinition = "TEXT")
    private String flightDataJson;

    @Column(name = "passenger_details_json", columnDefinition = "TEXT")
    private String passengerDetailsJson;

    private String pnr;

    @Column(name = "total_cost", nullable = false)
    private int totalCost;

    @Builder.Default
    private String status = "CONFIRMED";

    @Column(name = "departure_date")
    private LocalDate departureDate;

    @Column(name = "from_city")
    private String fromCity;

    @Column(name = "to_city")
    private String toCity;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
}
