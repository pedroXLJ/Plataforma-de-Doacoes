package doacao.demo.controllers;

import doacao.demo.models.Voluntario;
import doacao.demo.repositories.VoluntarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/voluntarios")
@RequiredArgsConstructor
public class VoluntarioController {

    private final VoluntarioRepository voluntarioRepository;

    @GetMapping
    public ResponseEntity<List<Voluntario>> listarVoluntarios() {
        List<Voluntario> voluntarios = voluntarioRepository.findAll();
        return ResponseEntity.ok(voluntarios);
    }
}
