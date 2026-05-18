package com.example.springprojet.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class StartupListener implements ApplicationListener<ApplicationReadyEvent> {

  @Override
  public void onApplicationEvent(ApplicationReadyEvent event) {
    Environment env = event.getApplicationContext().getEnvironment();
    String port = env.getProperty("server.port", "8081");

    System.out.println();
    System.out.println("========================================");
    System.out.println("  Backend demarre avec succes !");
    System.out.println("  API : http://localhost:" + port);
    System.out.println("========================================");
    System.out.println();
  }
}
