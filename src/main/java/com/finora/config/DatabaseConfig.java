package com.finora.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import com.zaxxer.hikari.pool.HikariPool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    private static final String DEFAULT_SUPABASE_PROJECT_REF = "zmfyysjojvshleibvgjs";

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
        // Priority 1: Check environment variables directly, then fallback to Spring @Value properties
        String resolvedUrl = System.getenv("DB_URL");
        if (resolvedUrl == null || resolvedUrl.isBlank()) {
            String dbUrlAlt = System.getenv("DATABASE_URL");
            resolvedUrl = (dbUrlAlt != null && !dbUrlAlt.isBlank()) ? dbUrlAlt : this.url;
        }

        String resolvedUsername = System.getenv("DB_USERNAME");
        if (resolvedUsername == null || resolvedUsername.isBlank()) {
            String dbUserAlt = System.getenv("DATABASE_USERNAME");
            resolvedUsername = (dbUserAlt != null && !dbUserAlt.isBlank()) ? dbUserAlt : this.username;
        }

        String resolvedPassword = System.getenv("DB_PASSWORD");
        boolean passwordFromEnv = (resolvedPassword != null && !resolvedPassword.isBlank());
        if (!passwordFromEnv) {
            String dbPassAlt = System.getenv("DATABASE_PASSWORD");
            if (dbPassAlt != null && !dbPassAlt.isBlank()) {
                resolvedPassword = dbPassAlt;
                passwordFromEnv = true;
            } else {
                resolvedPassword = this.password;
            }
        }

        // Clean surrounding whitespace and quotes
        resolvedUrl = cleanValue(resolvedUrl);
        resolvedUsername = cleanValue(resolvedUsername);
        resolvedPassword = cleanValue(resolvedPassword);

        if (resolvedUrl != null) {
            // Normalize postgres:// or postgresql:// to jdbc:postgresql://
            if (resolvedUrl.startsWith("postgres://")) {
                resolvedUrl = "jdbc:postgresql://" + resolvedUrl.substring("postgres://".length());
            } else if (resolvedUrl.startsWith("postgresql://")) {
                resolvedUrl = "jdbc:postgresql://" + resolvedUrl.substring("postgresql://".length());
            }

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
                extractedUser = cleanValue(extractedUser);
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
                extractedPass = cleanValue(extractedPass);
                if (!passwordFromEnv && (resolvedPassword == null || resolvedPassword.isBlank() || "password".equals(resolvedPassword))) {
                    resolvedPassword = extractedPass;
                    passwordFromEnv = true;
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

        // Supabase Session Pooler check:
        // Supabase Session Pooler requires the tenant-scoped username (postgres.<project-ref>).
        // If username is bare 'postgres' or empty on pooler.supabase.com, auto-resolve to postgres.<project-ref>
        if (host.contains("pooler.supabase.com")) {
            if (resolvedUsername == null || resolvedUsername.isBlank() || "postgres".equalsIgnoreCase(resolvedUsername)) {
                String projectRef = System.getenv("SUPABASE_PROJECT_REF");
                if (projectRef == null || projectRef.isBlank()) {
                    projectRef = System.getenv("SUPABASE_PROJECT_ID");
                }
                if (projectRef == null || projectRef.isBlank()) {
                    projectRef = DEFAULT_SUPABASE_PROJECT_REF;
                }
                resolvedUsername = "postgres." + projectRef;
                log.info("Auto-resolved Supabase Session Pooler tenant username to: {}", resolvedUsername);
            }
        }

        // Candidate password variations to try
        List<String> passwordCandidates = new ArrayList<>();
        if (resolvedPassword != null && !resolvedPassword.isBlank()) {
            passwordCandidates.add(resolvedPassword);

            if (resolvedPassword.contains("%")) {
                try {
                    String decoded = URLDecoder.decode(resolvedPassword, StandardCharsets.UTF_8);
                    if (!passwordCandidates.contains(decoded)) {
                        passwordCandidates.add(0, decoded); // prefer decoded if percent signs exist
                    }
                } catch (Exception ignored) {
                }
            }

            if (resolvedPassword.contains("%40")) {
                String atReplaced = resolvedPassword.replace("%40", "@");
                if (!passwordCandidates.contains(atReplaced)) {
                    passwordCandidates.add(atReplaced);
                }
            }
        }

        int passLength = (resolvedPassword != null) ? resolvedPassword.length() : 0;
        String passSource = passwordFromEnv ? "Render Environment" : "Default Fallback";
        String maskedPass = maskPassword(resolvedPassword);

        log.info("Configuring DataSource -> Host: {}, Port: {}, Database: {}, Username: {}, PasswordSource: {}, PasswordLength: {}, MaskedPassword: {}",
                host, port, database, resolvedUsername, passSource, passLength, maskedPass);

        if (!passwordFromEnv && (host.contains("supabase.com") || host.contains("pooler.supabase.com"))) {
            log.error("CRITICAL: DB_PASSWORD environment variable is NOT reaching the application! " +
                    "The application is using the fallback password 'password', which Supabase will reject. " +
                    "Make sure your Environment Group is LINKED to this service under 'montra-backend -> Environment' in Render.");
        }

        HikariPool.PoolInitializationException lastException = null;
        for (int i = 0; i < passwordCandidates.size(); i++) {
            String candidate = passwordCandidates.get(i);
            try {
                HikariConfig config = createHikariConfig(resolvedUrl, resolvedUsername, candidate, driverClassName);
                HikariDataSource ds = new HikariDataSource(config);
                if (i > 0) {
                    log.info("Successfully connected to database with password candidate variant #{}", (i + 1));
                }
                return ds;
            } catch (HikariPool.PoolInitializationException e) {
                lastException = e;
                if (i < passwordCandidates.size() - 1) {
                    log.warn("Datasource initialization failed with candidate variant #{}. Trying next variant...", (i + 1));
                }
            }
        }

        if (lastException != null) {
            throw lastException;
        }

        // Fallback if no candidates
        HikariConfig fallbackConfig = createHikariConfig(resolvedUrl, resolvedUsername, resolvedPassword, driverClassName);
        return new HikariDataSource(fallbackConfig);
    }

    private String cleanValue(String val) {
        if (val == null) {
            return null;
        }
        val = val.trim();
        if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
            if (val.length() >= 2) {
                val = val.substring(1, val.length() - 1).trim();
            }
        }
        return val;
    }

    private String maskPassword(String pass) {
        if (pass == null || pass.isEmpty()) {
            return "EMPTY";
        }
        if (pass.length() <= 4) {
            return "*".repeat(pass.length());
        }
        return pass.substring(0, 2) + "***" + pass.substring(pass.length() - 2);
    }

    private HikariConfig createHikariConfig(String jdbcUrl, String user, String pass, String driverClass) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(user);
        config.setPassword(pass);
        config.setDriverClassName(driverClass);
        config.setPoolName("MontraHikariPool");

        // Sensible connection pool configuration
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        return config;
    }

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            try {
                DataSource ds = flyway.getConfiguration().getDataSource();
                try (Connection conn = ds.getConnection();
                     Statement stmt = conn.createStatement()) {
                    // Check if 'users' table exists. If not, V1__init.sql has never successfully run.
                    // If flyway_schema_history exists with an invalid baseline or failed V2 state, reset it so V1 executes.
                    ResultSet rs = stmt.executeQuery(
                            "SELECT EXISTS (" +
                            "    SELECT 1 FROM information_schema.tables " +
                            "    WHERE table_schema = 'public' AND table_name = 'users'" +
                            ")"
                    );
                    if (rs.next() && !rs.getBoolean(1)) {
                        log.info("Notice: 'users' table does not exist in 'public' schema. " +
                                "Clearing corrupted flyway_schema_history to ensure V1__init.sql runs cleanly...");
                        stmt.execute("DROP TABLE IF EXISTS flyway_schema_history CASCADE");
                    }
                }
            } catch (Exception e) {
                log.warn("Notice: could not inspect 'users' table: {}", e.getMessage());
            }

            try {
                flyway.repair();
            } catch (Exception e) {
                log.warn("Flyway repair notice: {}", e.getMessage());
            }

            log.info("Executing Flyway migrations...");
            flyway.migrate();
            log.info("Flyway migrations completed successfully.");
        };
    }
}
