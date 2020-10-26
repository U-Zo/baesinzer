package pkw.projectw.filter;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.web.filter.OncePerRequestFilter;
import pkw.projectw.domain.User;
import pkw.projectw.service.CookieUtil;
import pkw.projectw.service.JwtTokenUtil;
import pkw.projectw.service.UserService;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtRequestFilter extends OncePerRequestFilter {

    private UserService userService;
    private JwtTokenUtil jwtTokenUtil;
    private CookieUtil cookieUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final Cookie jwtToken = cookieUtil.getCookie(request, JwtTokenUtil.ACCESS_TOKEN_NAME);

        String email = null;
        String accessToken = null;
        String refreshToken = null;
        String refreshEmail = null;

        try {
            if (jwtToken != null) {
                accessToken = jwtToken.getValue();
                email = jwtTokenUtil.getEmail(accessToken);
            }

            if (email != null) {
                userService.findOne(email).ifPresent(user -> {
                    if (!jwtTokenUtil.validateToken(accessToken, user)) {
                    }
                });
            }
        } catch (ExpiredJwtException e) {

        }
    }
}
