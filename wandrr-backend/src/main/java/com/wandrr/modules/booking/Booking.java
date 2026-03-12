package com.wandrr.modules.booking;

import com.wandrr.modules.user.User;
import com.wandrr.modules.packages.TripPackage;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private TripPackage tripPackage;

    @Column(name = "travel_date", nullable = false)
    private LocalDate travelDate;

    @Column(name = "total_persons", nullable = false)
    @Builder.Default
    private int totalPersons = 1;

    @Column(name = "total_cost", nullable = false)
    private int totalCost;

    @Builder.Default
    private String status = "CONFIRMED";

    private String notes;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<BookingBuddy> buddies;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
}
