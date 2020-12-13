package projectw.baesinzer.controller.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import projectw.baesinzer.domain.User;
import projectw.baesinzer.domain.UserInfo;
import projectw.baesinzer.domain.UserRole;
import projectw.baesinzer.service.auth.UserService;
import projectw.baesinzer.service.auth.VerificationTokenService;
import projectw.baesinzer.util.CookieUtil;
import projectw.baesinzer.util.JwtTokenUtil;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;
    private final CookieUtil cookieUtil;
    private final VerificationTokenService verificationTokenService;

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody UserAuthForm form) {
        User user = new User(form.getEmail(), form.getPassword());
        userService.register(user);
        verificationTokenService.createVerification(user.getEmail());
        Map<String, String> map = new HashMap<>();
        map.put("email", user.getEmail());

        return map;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody UserAuthForm form,
                                     HttpServletRequest request,
                                     HttpServletResponse response) {
        Map<String, String> auth = new HashMap<>();
        User user = userService.login(form.getEmail(), form.getPassword());

        if (user.getRole().equals(UserRole.ROLE_NOT_PERMITTED)) {
            response.setStatus(403);
            verificationTokenService.createVerification(user.getEmail());
            auth.put("message", "이메일 인증이 필요합니다.");
            return auth;
        }

        final String accessToken = jwtTokenUtil.generateToken(user);
        final String refreshToken = jwtTokenUtil.generateRefreshToken(user);
        Cookie accessTokenCookie = cookieUtil.createCookie(JwtTokenUtil.ACCESS_TOKEN_NAME, accessToken);
        Cookie refreshTokenCookie = cookieUtil.createCookie(JwtTokenUtil.REFRESH_TOKEN_NAME, refreshToken);
        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);
        userService.updateRefreshToken(user, refreshToken);
        auth.put("email", user.getEmail());

        return auth;
    }

    @GetMapping("/check")
    public UserInfo check(HttpServletRequest request) {
        Cookie jwtToken = cookieUtil.getCookie(request, JwtTokenUtil.ACCESS_TOKEN_NAME);
        if (jwtToken.getValue().equals("")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        if (jwtTokenUtil.getEmail(jwtToken.getValue()) != null) {
            return new UserInfo();
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/logout")
    public void logout(HttpServletResponse response) {
        Cookie accessTokenCookie = cookieUtil.createCookie(JwtTokenUtil.ACCESS_TOKEN_NAME, null);
        Cookie refreshTokenCookie = cookieUtil.createCookie(JwtTokenUtil.REFRESH_TOKEN_NAME, null);
        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);
    }

    @GetMapping("/verify")
    public String verifyEmail(String code) {
        return verificationTokenService.verifyEmail(code);
    }
}
