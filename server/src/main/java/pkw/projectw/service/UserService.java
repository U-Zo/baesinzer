package pkw.projectw.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pkw.projectw.domain.User;
import pkw.projectw.repository.UserRepository;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

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
                    throw new IllegalStateException("이미 존재하는 회원입니다.");
                });

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        return user.getId();
    }

    public Optional<User> findOne(Long userId) {
        return userRepository.findById(userId);
    }
    public Optional<User> findOne(String email) {
        return userRepository.findByEmail(email);
    }

    public User update(User user) {
        return userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDetails userDetails = new Us;
        return null;
    }
}
