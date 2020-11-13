package projectw.baesinzer.controller.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
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
    public void register(@RequestBody UserAuthForm form) {
        User user = new User(form.getEmail(), form.getPassword());
        userService.register(user);
        verificationTokenService.createVerification(user.getEmail());
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
            auth.put("authError", "이메일 인증이 필요합니다.");
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

    @PostMapping("/check")
    public UserInfo check(@RequestBody Map<String, String> map, HttpServletRequest request) {
        Cookie jwtToken = cookieUtil.getCookie(request, JwtTokenUtil.ACCESS_TOKEN_NAME);
        System.out.println(map);
        String email = map.get("email");
        if (jwtTokenUtil.getEmail(jwtToken.getValue()).equals(email)) {
            return new UserInfo();
        }
        return null;
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
