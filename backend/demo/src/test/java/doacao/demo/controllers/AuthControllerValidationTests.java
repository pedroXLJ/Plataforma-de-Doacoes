package doacao.demo.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import doacao.demo.DTOs.EntidadeDTO;
import doacao.demo.DTOs.LoginDTO;
import doacao.demo.DTOs.VoluntarioDTO;
import doacao.demo.services.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class AuthControllerValidationTests {

    private MockMvc mvc;
    private ObjectMapper mapper = new ObjectMapper();

    private AuthService authService;

    @BeforeEach
    void setup() {
        authService = Mockito.mock(AuthService.class);
        AuthController controller = new AuthController(authService);
        mvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void cadastrarVoluntario_missingFields_returns400() throws Exception {
        VoluntarioDTO dto = new VoluntarioDTO();
        dto.setNome("");
        dto.setCpf("");
        dto.setEmail("bad");
        dto.setSenha("123");

        mvc.perform(post("/auth/cadastrar-voluntario")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").isArray());
    }

    @Test
    void cadastrarVoluntario_valid_returns200() throws Exception {
        VoluntarioDTO dto = new VoluntarioDTO();
        dto.setNome("Nome");
        dto.setCpf("12345678901");
        dto.setEmail("a@b.com");
        dto.setSenha("abcdef");

        doNothing().when(authService).cadastrarVoluntario(any());

        mvc.perform(post("/auth/cadastrar-voluntario")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().string("Voluntário cadastrado com sucesso!"));
    }

    @Test
    void cadastrarEntidade_missingEndereco_returns400() throws Exception {
        EntidadeDTO dto = new EntidadeDTO();
        dto.setNomeFantasia("Nome");
        dto.setCnpj("12345678901234");
        dto.setAreaDeAtuacao("Area");
        dto.setEmail("a@b.com");
        dto.setSenha("abcdef");
        // endereco null

        mvc.perform(post("/auth/cadastrar-entidade")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").isArray());
    }

    @Test
    void login_missingFields_returns400() throws Exception {
        LoginDTO dto = new LoginDTO();
        dto.setEmail("");
        dto.setSenha("");

        mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").isArray());
    }

    @Test
    void login_valid_returnsToken() throws Exception {
        LoginDTO dto = new LoginDTO();
        dto.setEmail("a@b.com");
        dto.setSenha("abcdef");

        when(authService.login(any())).thenReturn("tok");

        mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("tok"));
    }
}
