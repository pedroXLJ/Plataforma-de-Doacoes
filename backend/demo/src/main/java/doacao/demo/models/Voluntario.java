package doacao.demo.models;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Voluntario extends User {

    private String nome;
    private String cpf;
    private boolean jaVoluntariou = false;

    public Voluntario() {
        this.tipo = UserType.VOLUNTARIO;
    }
}
