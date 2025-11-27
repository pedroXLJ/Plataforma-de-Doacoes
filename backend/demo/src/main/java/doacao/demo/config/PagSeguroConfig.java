package doacao.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PagSeguroConfig {

    @Value("${pagseguro.token}")
    private String token;

    public static final String BASE_URL = "https://api.pagseguro.com/";

    public String getToken() {
        return token;
    }
}