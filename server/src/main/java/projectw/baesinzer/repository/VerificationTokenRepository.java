package projectw.baesinzer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projectw.baesinzer.domain.VerificationToken;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByUserEmail(String email);

    Optional<VerificationToken> findByToken(String token);
}
