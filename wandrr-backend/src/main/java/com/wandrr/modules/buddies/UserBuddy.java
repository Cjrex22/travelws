package com.wandrr.modules.buddies;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_buddies", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id", "buddy_id" }))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBuddy {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "buddy_id", nullable = false)
    private UUID buddyId;

    @Column(name = "added_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime addedAt;
}
