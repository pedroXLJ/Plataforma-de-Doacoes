package doacao.demo.DTOs;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EntidadeDTO {
    @NotBlank(message = "Nome fantasia é obrigatório")
    private String nomeFantasia;

    @NotBlank(message = "CNPJ é obrigatório")
    @Size(min = 14, message = "CNPJ inválido")
    private String cnpj;

    @NotNull(message = "Endereço é obrigatório")
    @Valid
    private EnderecoDTO endereco;

    @NotBlank(message = "Área de atuação é obrigatória")
    private String areaDeAtuacao;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")
    private String senha;

    @Getter @Setter
    public static class EnderecoDTO {
        @NotBlank(message = "Rua é obrigatória")
        private String rua;

        @NotBlank(message = "Número é obrigatório")
        private String numero;

        @NotBlank(message = "Bairro é obrigatório")
        private String bairro;

        @NotBlank(message = "Cidade é obrigatória")
        private String cidade;

        @NotBlank(message = "Estado é obrigatório")
        private String estado;

        @NotBlank(message = "CEP é obrigatório")
        private String cep;

        // complemento é opcional
        private String complemento;
    }
}
