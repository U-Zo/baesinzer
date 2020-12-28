package projectw.baesinzer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projectw.baesinzer.domain.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByRefreshToken(String token);
}
