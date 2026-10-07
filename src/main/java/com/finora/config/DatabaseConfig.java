package com.finora.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.driver-class-name:org.postgresql.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        String resolvedUrl = url;
        String resolvedUsername = username;
        String resolvedPassword = password;

        if (resolvedUrl != null) {
            // Extract user from JDBC URL if username is empty or default 'postgres'
            Pattern userPattern = Pattern.compile("[?&]user=([^&]+)");
            Matcher userMatcher = userPattern.matcher(resolvedUrl);
            if (userMatcher.find()) {
                String extractedUser;
                try {
                    extractedUser = URLDecoder.decode(userMatcher.group(1), StandardCharsets.UTF_8);
                } catch (Exception e) {
                    extractedUser = userMatcher.group(1);
                }
                if (resolvedUsername == null || resolvedUsername.isBlank() || "postgres".equals(resolvedUsername)) {
                    resolvedUsername = extractedUser;
                }
            }

            // Extract password from JDBC URL if password is empty or default 'password'
            Pattern passPattern = Pattern.compile("[?&]password=([^&]+)");
            Matcher passMatcher = passPattern.matcher(resolvedUrl);
            if (passMatcher.find()) {
                String extractedPass;
                try {
                    extractedPass = URLDecoder.decode(passMatcher.group(1), StandardCharsets.UTF_8);
                } catch (Exception e) {
                    extractedPass = passMatcher.group(1);
                }
                if (resolvedPassword == null || resolvedPassword.isBlank() || "password".equals(resolvedPassword)) {
                    resolvedPassword = extractedPass;
                }
            }

            // Clean user and password query parameters from JDBC URL to prevent HikariCP property collision
            resolvedUrl = resolvedUrl
                    .replaceAll("([?&])user=[^&]*(&|$)", "$1")
                    .replaceAll("([?&])password=[^&]*(&|$)", "$1")
                    .replaceAll("\\?&", "?")
                    .replaceAll("[?&]$", "");

            // Supabase requires SSL connection
            if (resolvedUrl.contains(".supabase.com") || resolvedUrl.contains(".supabase.co")) {
                if (!resolvedUrl.contains("sslmode=")) {
                    resolvedUrl += (resolvedUrl.contains("?") ? "&" : "?") + "sslmode=require";
                }
            }
        }

        // Auto-decode password in case percent-encoded characters (like %40 for @) were provided
        if (resolvedPassword != null && resolvedPassword.contains("%")) {
            try {
                resolvedPassword = URLDecoder.decode(resolvedPassword, StandardCharsets.UTF_8);
            } catch (Exception ignored) {
            }
        }

        // Safely extract host, port, and database name for diagnostics without exposing credentials
        String host = "unknown";
        String port = "default";
        String database = "unknown";
        try {
            if (resolvedUrl != null) {
                String cleanForUri = resolvedUrl.startsWith("jdbc:") ? resolvedUrl.substring(5) : resolvedUrl;
                int queryIdx = cleanForUri.indexOf('?');
                if (queryIdx != -1) {
                    cleanForUri = cleanForUri.substring(0, queryIdx);
                }
                URI uri = URI.create(cleanForUri);
                if (uri.getHost() != null) {
                    host = uri.getHost();
                }
                if (uri.getPort() != -1) {
                    port = String.valueOf(uri.getPort());
                }
                if (uri.getPath() != null && uri.getPath().length() > 1) {
                    database = uri.getPath().substring(1);
                }
            }
        } catch (Exception ignored) {
        }

        log.info("Configuring DataSource -> Host: {}, Port: {}, Database: {}, Username: {}",
                host, port, database, resolvedUsername);

        if (host.contains("pooler.supabase.com") && "postgres".equalsIgnoreCase(resolvedUsername)) {
            log.warn("WARNING: Connecting to Supabase Session Pooler with username 'postgres'. " +
                    "Supabase Session Pooler requires the tenant username format (e.g., 'postgres.<project-ref>'). " +
                    "Ensure DB_USERNAME is set to your exact Supabase Session Pooler username in Render environment variables.");
        }

        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(resolvedUrl);
        hikariConfig.setUsername(resolvedUsername);
        hikariConfig.setPassword(resolvedPassword);
        hikariConfig.setDriverClassName(driverClassName);
        hikariConfig.setPoolName("MontraHikariPool");

        // Sensible connection pool configuration
        hikariConfig.setMaximumPoolSize(10);
        hikariConfig.setMinimumIdle(2);
        hikariConfig.setConnectionTimeout(30000);
        hikariConfig.setIdleTimeout(600000);
        hikariConfig.setMaxLifetime(1800000);

        return new HikariDataSource(hikariConfig);
    }
}
