package projectw.baesinzer.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import projectw.baesinzer.domain.User;
import projectw.baesinzer.repository.UserRepository;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * User 객체를 받아 데이터베이스에 저장한다.
     * 데이터베이스에 동일한 이메일을 가진 유저가 있으면
     * 에러가 발생한다.
     *
     * @param user 회원가입 정보
     * @return 회원가입 성공 시 유저의 id
     */
    public Long register(User user) {
        userRepository.findByEmail(user.getEmail())
                .ifPresent(u -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용중인 이메일입니다.");
                });

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        return user.getId();
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.FORBIDDEN, "사용자 정보가 일치하지 않습니다."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "사용자 정보가 일치하지 않습니다.");
        }

        return user;
    }

    public void updateRefreshToken(User user, String token) {
        user.setRefreshToken(token);
    }


    public Optional<User> findOne(Long userId) {
        return userRepository.findById(userId);
    }
}
