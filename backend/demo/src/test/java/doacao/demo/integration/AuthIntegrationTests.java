package doacao.demo.integration;

import doacao.demo.DTOs.*;
import doacao.demo.models.UserType;
import doacao.demo.repositories.EntidadeRepository;
import doacao.demo.repositories.UserRepository;
import doacao.demo.repositories.VoluntarioRepository;
import doacao.demo.services.AuthService;
import doacao.demo.controllers.AuthController;
import doacao.demo.controllers.GlobalExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("Testes de Integração: Cadastro, Login e Validação")
class AuthIntegrationTests {

	private MockMvc mockMvc;
	private ObjectMapper objectMapper;

	@Mock
	private AuthService authService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
		AuthController authController = new AuthController(authService);
		GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler();
		
		mockMvc = MockMvcBuilders.standaloneSetup(authController)
			.setControllerAdvice(exceptionHandler)
			.build();
		
		objectMapper = new ObjectMapper();
	}

	@Test
	@DisplayName("Deve cadastrar um voluntário com sucesso")
	void testCadastroVoluntarioComSucesso() throws Exception {
		VoluntarioDTO voluntarioDTO = new VoluntarioDTO();
		voluntarioDTO.setNome("João Silva");
		voluntarioDTO.setCpf("12345678901");
		voluntarioDTO.setEmail("joao@example.com");
		voluntarioDTO.setSenha("SenhaSegura123!");

		doNothing().when(authService).cadastrarVoluntario(any(VoluntarioDTO.class));

		mockMvc.perform(post("/auth/cadastrar-voluntario")
				.contentType("application/json")
				.content(objectMapper.writeValueAsString(voluntarioDTO)))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("Voluntário cadastrado com sucesso!")));

		verify(authService, times(1)).cadastrarVoluntario(any(VoluntarioDTO.class));
	}

	@Test
	@DisplayName("Deve cadastrar uma entidade com sucesso")
	void testCadastroEntidadeComSucesso() throws Exception {
		EntidadeDTO.EnderecoDTO enderecoDTO = new EntidadeDTO.EnderecoDTO();
		enderecoDTO.setRua("Rua das Flores");
		enderecoDTO.setNumero("42");
		enderecoDTO.setBairro("Centro");
		enderecoDTO.setCidade("São Paulo");
		enderecoDTO.setEstado("SP");
		enderecoDTO.setCep("01310100");

		EntidadeDTO entidadeDTO = new EntidadeDTO();
		entidadeDTO.setNomeFantasia("ONG Solidária");
		entidadeDTO.setCnpj("12345678000190");
		entidadeDTO.setEmail("ong@example.com");
		entidadeDTO.setSenha("SenhaONG123!");
		entidadeDTO.setAreaDeAtuacao("Educação");
		entidadeDTO.setEndereco(enderecoDTO);

		doNothing().when(authService).cadastrarEntidade(any(EntidadeDTO.class));

		mockMvc.perform(post("/auth/cadastrar-entidade")
				.contentType("application/json")
				.content(objectMapper.writeValueAsString(entidadeDTO)))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("Entidade cadastrada com sucesso!")));

		verify(authService, times(1)).cadastrarEntidade(any(EntidadeDTO.class));
	}

	@Test
	@DisplayName("Deve fazer login e retornar token")
	void testLoginComSucesso() throws Exception {
		LoginDTO loginDTO = new LoginDTO();
		loginDTO.setEmail("usuario@example.com");
		loginDTO.setSenha("SenhaSegura123!");

		when(authService.login(any(LoginDTO.class))).thenReturn("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");

		mockMvc.perform(post("/auth/login")
				.contentType("application/json")
				.content(objectMapper.writeValueAsString(loginDTO)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.token", notNullValue()));

		verify(authService, times(1)).login(any(LoginDTO.class));
	}

	@Test
	@DisplayName("Deve rejeitar cadastro com email inválido")
	void testCadastroVoluntarioEmailInvalido() throws Exception {
		VoluntarioDTO voluntarioDTO = new VoluntarioDTO();
		voluntarioDTO.setNome("Pedro");
		voluntarioDTO.setCpf("11111111111");
		voluntarioDTO.setEmail("email-invalido"); // Email inválido
		voluntarioDTO.setSenha("SenhaValida123!");

		mockMvc.perform(post("/auth/cadastrar-voluntario")
				.contentType("application/json")
				.content(objectMapper.writeValueAsString(voluntarioDTO)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.errors", notNullValue()))
			.andExpect(jsonPath("$.errors[*].field", hasItem("email")));
	}

	@Test
	@DisplayName("Deve rejeitar cadastro com nome vazio")
	void testCadastroVoluntarioNomeVazio() throws Exception {
		VoluntarioDTO voluntarioDTO = new VoluntarioDTO();
		voluntarioDTO.setNome(""); // Nome vazio
		voluntarioDTO.setCpf("11111111111");
		voluntarioDTO.setEmail("voluntario@example.com");
		voluntarioDTO.setSenha("SenhaValida123!");

		mockMvc.perform(post("/auth/cadastrar-voluntario")
				.contentType("application/json")
				.content(objectMapper.writeValueAsString(voluntarioDTO)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.errors", notNullValue()))
			.andExpect(jsonPath("$.errors[*].field", hasItem("nome")));
	}

	@Test
	@DisplayName("Deve rejeitar cadastro com senha vazia")
	void testCadastroVoluntarioSenhaVazia() throws Exception {
		VoluntarioDTO voluntarioDTO = new VoluntarioDTO();
		voluntarioDTO.setNome("Ana");
		voluntarioDTO.setCpf("22222222222");
		voluntarioDTO.setEmail("ana@example.com");
		voluntarioDTO.setSenha(""); // Senha vazia

		mockMvc.perform(post("/auth/cadastrar-voluntario")
				.contentType("application/json")
				.content(objectMapper.writeValueAsString(voluntarioDTO)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.errors", notNullValue()))
			.andExpect(jsonPath("$.errors[*].field", hasItem("senha")));
	}

	@Test
	@DisplayName("Deve rejeitar cadastro de entidade com área vazia")
	void testCadastroEntidadeAreaVazia() throws Exception {
		EntidadeDTO.EnderecoDTO enderecoDTO = new EntidadeDTO.EnderecoDTO();
		enderecoDTO.setRua("Rua Test");
		enderecoDTO.setNumero("100");
		enderecoDTO.setBairro("Bairro");
		enderecoDTO.setCidade("Cidade");
		enderecoDTO.setEstado("ST");
		enderecoDTO.setCep("12345678");

		EntidadeDTO entidadeDTO = new EntidadeDTO();
		entidadeDTO.setNomeFantasia("ONG Test");
		entidadeDTO.setCnpj("12345678000100");
		entidadeDTO.setEmail("ong-test@example.com");
		entidadeDTO.setSenha("SenhaTest123!");
		entidadeDTO.setAreaDeAtuacao(""); // Área vazia
		entidadeDTO.setEndereco(enderecoDTO);

		mockMvc.perform(post("/auth/cadastrar-entidade")
				.contentType("application/json")
				.content(objectMapper.writeValueAsString(entidadeDTO)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.errors", notNullValue()))
			.andExpect(jsonPath("$.errors[*].field", hasItem("areaDeAtuacao")));
	}

	@Test
	@DisplayName("Deve rejeitar login com email vazio")
	void testLoginEmailVazio() throws Exception {
		LoginDTO loginDTO = new LoginDTO();
		loginDTO.setEmail(""); // Email vazio
		loginDTO.setSenha("SenhaQualquer123!");

		mockMvc.perform(post("/auth/login")
				.contentType("application/json")
				.content(objectMapper.writeValueAsString(loginDTO)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.errors", notNullValue()))
			.andExpect(jsonPath("$.errors[*].field", hasItem("email")));
	}

	@Test
	@DisplayName("Deve rejeitar login com email inválido")
	void testLoginEmailInvalido() throws Exception {
		LoginDTO loginDTO = new LoginDTO();
		loginDTO.setEmail("invalid-email"); // Email inválido
		loginDTO.setSenha("SenhaQualquer123!");

		mockMvc.perform(post("/auth/login")
				.contentType("application/json")
				.content(objectMapper.writeValueAsString(loginDTO)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.errors", notNullValue()));
	}

	@Test
	@DisplayName("Deve retornar múltiplos erros de validação")
	void testMultiplosErrosValidacao() throws Exception {
		VoluntarioDTO voluntarioDTO = new VoluntarioDTO();
		voluntarioDTO.setNome(""); // Vazio
		voluntarioDTO.setCpf(""); // Vazio
		voluntarioDTO.setEmail("invalid-email"); // Inválido
		voluntarioDTO.setSenha(""); // Vazio

		mockMvc.perform(post("/auth/cadastrar-voluntario")
				.contentType("application/json")
				.content(objectMapper.writeValueAsString(voluntarioDTO)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.errors", notNullValue()))
			.andExpect(jsonPath("$.errors[?(@.field == 'nome')]", notNullValue()))
			.andExpect(jsonPath("$.errors[?(@.field == 'cpf')]", notNullValue()))
			.andExpect(jsonPath("$.errors[?(@.field == 'email')]", notNullValue()))
			.andExpect(jsonPath("$.errors[?(@.field == 'senha')]", notNullValue()));
	}
}
