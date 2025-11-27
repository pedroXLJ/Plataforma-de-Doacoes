package doacao.demo.DTOs;

import doacao.demo.models.Endereco;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MeDTO {
    private Long id;
    private String email;
    private String tipo;

    // campos voluntário
    private String nome;
    private String cpf;
    private Boolean jaVoluntariou;

    // campos entidade
    private String nomeFantasia;
    private String cnpj;
    private String areaAtuacao;
    private Endereco endereco;
}
