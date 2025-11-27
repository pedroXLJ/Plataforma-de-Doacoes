package doacao.demo.controllers;

import doacao.demo.DTOs.PixRequestDTO;
import doacao.demo.DTOs.PixResponseDTO;
import doacao.demo.services.PixService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pix")
public class PixController {

    private final PixService pixService;

    public PixController(PixService pixService) {
        this.pixService = pixService;
    }

    @PostMapping("/gerar")
    public ResponseEntity<?> gerarPix(@RequestBody PixRequestDTO req) {
        try {
            PixResponseDTO resposta =
                    pixService.criarPix(req.referencia(), req.valor());

            return ResponseEntity.ok(resposta);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Erro ao gerar PIX: " + e.getMessage());
        }
    }
}