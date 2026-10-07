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
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    private static final String DEFAULT_SUPABASE_PROJECT_USER = "postgres.zmfyysjojvshleibvgjs";

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username:postgres}")
    private String username;

    @Value("${spring.datasource.password:password}")
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
            // Extract user from JDBC URL if present
            Pattern userPattern = Pattern.compile("[?&]user=([^&]+)");
            Matcher userMatcher = userPattern.matcher(resolvedUrl);
            if (userMatcher.find()) {
                try {
                    resolvedUsername = URLDecoder.decode(userMatcher.group(1), StandardCharsets.UTF_8);
                } catch (Exception e) {
                    resolvedUsername = userMatcher.group(1);
                }
            }

            // Extract password from JDBC URL if present
            Pattern passPattern = Pattern.compile("[?&]password=([^&]+)");
            Matcher passMatcher = passPattern.matcher(resolvedUrl);
            if (passMatcher.find()) {
                try {
                    resolvedPassword = URLDecoder.decode(passMatcher.group(1), StandardCharsets.UTF_8);
                } catch (Exception e) {
                    resolvedPassword = passMatcher.group(1);
                }
            }

            // Supabase shared pooler requires postgres.<project-ref> username format
            if (resolvedUrl.contains(".pooler.supabase.com")) {
                if ("postgres".equals(resolvedUsername) || resolvedUsername == null || resolvedUsername.isBlank()) {
                    resolvedUsername = DEFAULT_SUPABASE_PROJECT_USER;
                    log.info("Auto-corrected Supabase pooler username to: {}", DEFAULT_SUPABASE_PROJECT_USER);
                }

                if (!resolvedUrl.contains("sslmode=")) {
                    resolvedUrl += (resolvedUrl.contains("?") ? "&" : "?") + "sslmode=require";
                }
            }
        }

        log.info("Configuring DataSource for URL: {} with user: {}", 
                resolvedUrl != null ? resolvedUrl.replaceAll("password=[^&]*", "password=***") : "null", 
                resolvedUsername);

        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(resolvedUrl);
        hikariConfig.setUsername(resolvedUsername);
        hikariConfig.setPassword(resolvedPassword);
        hikariConfig.setDriverClassName(driverClassName);

        return new HikariDataSource(hikariConfig);
    }
}
