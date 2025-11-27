package doacao.demo.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter @Setter
public abstract class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    protected String email;
    protected String senha;

    protected LocalDateTime dataCadastro = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    protected UserType tipo;

    public Long getId() { return id; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(); // sem roles por enquanto
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    public UserType getTipo() {
        return tipo;
    }
}