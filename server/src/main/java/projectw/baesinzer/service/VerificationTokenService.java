package projectw.baesinzer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import projectw.baesinzer.domain.User;
import projectw.baesinzer.domain.UserRole;
import projectw.baesinzer.domain.VerificationToken;
import projectw.baesinzer.repository.UserRepository;
import projectw.baesinzer.repository.VerificationTokenRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class VerificationTokenService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailService emailService;

    public void createVerification(String email) {
        final String VERIFICATION_LINK = "http://localhost:8080/api/verify?code=";

        User user = userRepository.findByEmail(email).orElseThrow(() ->
                new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        VerificationToken verificationTokens = verificationTokenRepository
                .findByUserEmail(email).orElseGet(VerificationToken::new);

        verificationTokens.setToken(UUID.randomUUID().toString());
        verificationTokens.setExpireDateTime(LocalDateTime.now().plusSeconds(20));

        if (verificationTokens.getUser() == null) {
            verificationTokens.setUser(user);
            verificationTokenRepository.save(verificationTokens);
        }

        emailService.sendMail(email, "회원가입 인증 메일 안내",
                VERIFICATION_LINK + verificationTokens.getToken());
    }

    public String verifyEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository
                .findByToken(token).orElseGet(VerificationToken::new);

        if (verificationToken.getUser() == null) {
            return "잘못된 접근입니다.";
        }

        if (isTokenExpired(verificationToken)
                || verificationToken.getStatus().equals(VerificationToken.STATUS_VERIFIED)) {
            return "만료된 인증 이메일입니다.";
        }

        verificationToken.setStatus(VerificationToken.STATUS_VERIFIED);
        verificationToken.getUser().setRole(UserRole.ROLE_USER);
        verificationTokenRepository.save(verificationToken);

        return "인증이 완료되었습니다.";
    }

    private boolean isTokenExpired(VerificationToken verificationToken) {
        return verificationToken.getExpireDateTime().isBefore(LocalDateTime.now());
    }
}
