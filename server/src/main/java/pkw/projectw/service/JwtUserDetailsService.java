package pkw.projectw.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pkw.projectw.domain.User;
import pkw.projectw.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JwtUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username).orElse(null);

        return getUserDetails(user);
    }

    public UserDetails loadUserByRefreshToken(String token) {
        User user = userRepository.findByRefreshToken(token).orElse(null);

        return getUserDetails(user);
    }

    private UserDetails getUserDetails(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().toString()));

        if (user == null) {
            throw new UsernameNotFoundException("유저가 없습니다.");
        }


        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
    }

    public void userUpdate(User user) {
        userRepository.save(user);
    }
}
