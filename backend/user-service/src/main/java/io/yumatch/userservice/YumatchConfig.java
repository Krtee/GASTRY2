package io.yumatch.userservice;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties("yumatch")
public class YumatchConfig {
  private String corsHeaderLocal;
  private String corsHeaderDev;
  private String corsHeaderProd;
  private String adminMail;
  private Keycloak keycloak = new Keycloak();

  @Data
  public class Keycloak {
    private String url;
    private String realm;
    private String adminUser;
    private String adminPassword;
  }

}
