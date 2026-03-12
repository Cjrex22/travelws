package com.wandrr.modules.content;

import com.wandrr.modules.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "app_content")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppContent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(unique = true, nullable = false)
    private Section section;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "content_json", nullable = false, length = 10000)
    private Map<String, Object> contentJson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Section {
        MISSION, ABOUT_US, SOCIAL_LINKS
    }
}
