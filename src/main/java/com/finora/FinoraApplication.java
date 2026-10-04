package com.finora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FinoraApplication {
    public static void main(String[] args) {
        SpringApplication.run(FinoraApplication.class, args);
    }
}
