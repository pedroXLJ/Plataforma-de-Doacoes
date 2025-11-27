package doacao.demo.controllers;

import doacao.demo.models.Entidade;
import doacao.demo.repositories.EntidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/entidades")
@RequiredArgsConstructor
public class EntidadeController {

    private final EntidadeRepository entidadeRepository;

    @GetMapping
    public ResponseEntity<List<Entidade>> listarEntidades() {
        List<Entidade> entidades = entidadeRepository.findAll();
        return ResponseEntity.ok(entidades);
    }
}
