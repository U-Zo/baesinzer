package pkw.projectw.controller;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pkw.projectw.domain.RequestLoginUser;
import pkw.projectw.domain.User;
import pkw.projectw.service.CookieUtil;
import pkw.projectw.service.JwtTokenUtil;
import pkw.projectw.service.UserService;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;
    private final CookieUtil cookieUtil;

    @PostMapping("/api/register")
    public Map<String, String> register(@RequestBody RegisterForm form) {
        User user = new User(form.getEmail(), form.getPassword());
        userService.register(user);

        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("email", user.getEmail());

        return userInfo;
    }

    @PostMapping("/api/login")
    public Map<String, String> login(@RequestBody RequestLoginUser form,
                                     HttpServletRequest request,
                                     HttpServletResponse response) {
        Map<String, String> auth = new HashMap<>();
        User user = userService.login(form.getEmail(), form.getPassword());

        final String accessToken = jwtTokenUtil.generateToken(user);
        final String refreshToken = jwtTokenUtil.generateRefreshToken(user);
        Cookie accessTokenCookie = cookieUtil.createCookie(JwtTokenUtil.ACCESS_TOKEN_NAME, accessToken);
        Cookie refreshTokenCookie = cookieUtil.createCookie(JwtTokenUtil.REFRESH_TOKEN_NAME, refreshToken);
        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);
        user.setRefreshToken(refreshToken);
        userService.update(user);
        auth.put("email", user.getEmail());

        return auth;
    }

}
