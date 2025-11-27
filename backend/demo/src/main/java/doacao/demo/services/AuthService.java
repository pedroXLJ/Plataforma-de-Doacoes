package doacao.demo.services;

import doacao.demo.DTOs.*;
import doacao.demo.models.*;
import doacao.demo.repositories.*;

import doacao.demo.config.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final VoluntarioRepository voluntarioRepo;
    private final EntidadeRepository entidadeRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public void cadastrarVoluntario(VoluntarioDTO dto) {
        Voluntario v = new Voluntario();
        v.setNome(dto.getNome());
        v.setCpf(dto.getCpf());
        v.setEmail(dto.getEmail());
        v.setSenha(encoder.encode(dto.getSenha()));
        voluntarioRepo.save(v);
    }

    public void cadastrarEntidade(EntidadeDTO dto) {
        // map nested EnderecoDTO -> Endereco
        EntidadeDTO.EnderecoDTO endDto = dto.getEndereco();
        Endereco end = new Endereco();
        if (endDto != null) {
            end.setRua(endDto.getRua());
            end.setNumero(endDto.getNumero());
            end.setBairro(endDto.getBairro());
            end.setCidade(endDto.getCidade());
            end.setEstado(endDto.getEstado());
            end.setCep(endDto.getCep());
        }

        Entidade e = new Entidade();
        e.setNomeFantasia(dto.getNomeFantasia());
        e.setCnpj(dto.getCnpj());
        e.setAreaAtuacao(dto.getAreaDeAtuacao());

        e.setEndereco(end);
        e.setEmail(dto.getEmail());
        e.setSenha(encoder.encode(dto.getSenha()));

        entidadeRepo.save(e);
    }

    public String login(LoginDTO dto) {

        User user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));

        if (!encoder.matches(dto.getSenha(), user.getPassword()))
            throw new RuntimeException("Credenciais inválidas");

        return jwtUtil.generateToken(user.getEmail(), user.getTipo().toString());
    }
}