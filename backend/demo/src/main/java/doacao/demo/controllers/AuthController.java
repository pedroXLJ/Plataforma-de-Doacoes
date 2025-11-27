package doacao.demo.controllers;

import doacao.demo.DTOs.*;
import doacao.demo.models.Entidade;
import doacao.demo.models.User;
import doacao.demo.models.Voluntario;
import doacao.demo.repositories.UserRepository;
import doacao.demo.services.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    // Compatibility constructor used in tests which only provide AuthService
    public AuthController(AuthService authService) {
        this.authService = authService;
        this.userRepository = null;
    }

    @PostMapping("/cadastrar-voluntario")
    public String cadastrarVoluntario(@Valid @RequestBody VoluntarioDTO dto) {
        authService.cadastrarVoluntario(dto);
        return "Voluntário cadastrado com sucesso!";
    }

    @PostMapping("/cadastrar-entidade")
    public String cadastrarEntidade(@Valid @RequestBody EntidadeDTO dto) {
        authService.cadastrarEntidade(dto);
        return "Entidade cadastrada com sucesso!";
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@Valid @RequestBody LoginDTO dto) {
        String token = authService.login(dto);
        return new AuthResponseDTO(token);
    }

    @GetMapping("/me")
    public ResponseEntity<MeDTO> me() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        String email = auth.getName();

        if (userRepository == null) return ResponseEntity.status(501).build();

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        MeDTO dto = new MeDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getUsername());
        dto.setTipo(user.getTipo().name());

        if (user instanceof Voluntario) {
            Voluntario v = (Voluntario) user;
            dto.setNome(v.getNome());
            dto.setCpf(v.getCpf());
            dto.setJaVoluntariou(v.isJaVoluntariou());
        } else if (user instanceof Entidade) {
            Entidade e = (Entidade) user;
            dto.setNomeFantasia(e.getNomeFantasia());
            dto.setCnpj(e.getCnpj());
            dto.setAreaAtuacao(e.getAreaAtuacao());
            if (e.getEndereco() != null) dto.setEndereco(e.getEndereco());
        }

        return ResponseEntity.ok(dto);
    }
}