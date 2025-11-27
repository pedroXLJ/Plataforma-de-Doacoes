package doacao.demo.models;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Entidade extends User {

    private String nomeFantasia;
    private String cnpj;
    private String areaAtuacao;

    @Embedded
    private Endereco endereco;

    public Entidade() {
        this.tipo = UserType.ENTIDADE;
    }
}