package com.wandrr.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
@Profile("prod")
public class DataSourceConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${spring.datasource.url:}")
    private String springDatasourceUrl;

    @Value("${spring.datasource.username:}")
    private String fallbackUsername;

    @Value("${spring.datasource.password:}")
    private String fallbackPassword;

    @Bean
    public DataSource dataSource() {
        HikariDataSource ds = new HikariDataSource();
        ds.setMaximumPoolSize(5);
        ds.setMinimumIdle(2);

        String rawUrl = databaseUrl != null && !databaseUrl.isEmpty() ? databaseUrl : springDatasourceUrl;

        if (rawUrl != null && !rawUrl.isEmpty()
                && (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://"))) {
            // Render/Railway format: postgres://user:pass@host:port/dbname
            try {
                URI uri = new URI(rawUrl);
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath();
                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                if (uri.getQuery() != null) {
                    jdbcUrl += "?" + uri.getQuery() + "&stringtype=unspecified";
                } else {
                    jdbcUrl += "?stringtype=unspecified";
                }

                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    ds.setUsername(parts[0]);
                    ds.setPassword(parts[1]);
                }

                ds.setJdbcUrl(jdbcUrl);
                ds.setDriverClassName("org.postgresql.Driver");
                return ds;
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse DATABASE_URL: " + e.getMessage(), e);
            }
        }

        // Already a JDBC URL or fallback
        if (rawUrl != null && rawUrl.startsWith("jdbc:")) {
            ds.setJdbcUrl(rawUrl);
        } else {
            ds.setJdbcUrl("jdbc:postgresql://localhost:5432/wandrr_db");
        }
        ds.setUsername(fallbackUsername);
        ds.setPassword(fallbackPassword);
        ds.setDriverClassName("org.postgresql.Driver");
        return ds;
    }
}
