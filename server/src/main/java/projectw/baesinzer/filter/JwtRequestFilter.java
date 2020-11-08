package projectw.baesinzer.filter;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;
import projectw.baesinzer.domain.User;
import projectw.baesinzer.service.auth.JwtUserDetailsService;
import projectw.baesinzer.util.CookieUtil;
import projectw.baesinzer.util.JwtTokenUtil;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Transactional
@AllArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUserDetailsService userDetailsService;
    private final JwtTokenUtil jwtTokenUtil;
    private final CookieUtil cookieUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final Cookie jwtToken = cookieUtil.getCookie(request, JwtTokenUtil.ACCESS_TOKEN_NAME);

        String email = null;
        String accessToken = null;
        String refreshToken = null;

        try {
            if (jwtToken != null) {
                accessToken = jwtToken.getValue();

                if (!accessToken.equals("")) {
                    email = jwtTokenUtil.getEmail(accessToken);
                }
            }

            if (email != null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                if (jwtTokenUtil.validateToken(accessToken, userDetails)) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken
                            = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }
            }
        } catch (ExpiredJwtException e) {

            final Cookie refreshTokenCookie = cookieUtil.getCookie(request, JwtTokenUtil.REFRESH_TOKEN_NAME);
            if (refreshTokenCookie != null) {
                refreshToken = refreshTokenCookie.getValue();
            }
        }

        try {
            if (refreshToken != null) {
                UserDetails userDetails = userDetailsService.loadUserByRefreshToken(refreshToken);

                if (jwtTokenUtil.validateToken(refreshToken, userDetails)) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken
                            = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

                    User user = userDetailsService.getUserRepository().findByEmail(userDetails.getUsername()).orElseThrow(() ->
                            new ResponseStatusException(HttpStatus.UNAUTHORIZED, "사용자 정보가 일치하지 않습니다."));

                    String newAccessToken = jwtTokenUtil.generateToken(user);

                    Cookie newAccessTokenCookie = cookieUtil.createCookie(JwtTokenUtil.ACCESS_TOKEN_NAME, newAccessToken);
                    response.addCookie(newAccessTokenCookie);

                    if (jwtTokenUtil.needTokenRefresh(refreshToken)) {
                        String newRefreshToken = jwtTokenUtil.generateRefreshToken(user);

                        Cookie newRefreshTokenCookie = cookieUtil.createCookie(JwtTokenUtil.REFRESH_TOKEN_NAME, newRefreshToken);
                        response.addCookie(newRefreshTokenCookie);
                        user.setRefreshToken(newRefreshToken);
                    }
                }
            }
        } catch (ExpiredJwtException e) {
            System.out.println("토큰이 만료되었습니다.");
        }

        filterChain.doFilter(request, response);
    }
}
