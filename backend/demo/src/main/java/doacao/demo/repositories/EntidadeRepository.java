package doacao.demo.repositories;

import doacao.demo.models.Entidade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntidadeRepository extends JpaRepository<Entidade, Long> {
}
