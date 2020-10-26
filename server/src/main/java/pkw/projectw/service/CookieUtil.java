package pkw.projectw.service;

import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

@Service
public class CookieUtil {

    public Cookie createCookie(String cookie, String value) {
        Cookie token = new Cookie(cookie, value);
        token.setHttpOnly(true);
        token.setMaxAge((int)JwtTokenUtil.TOKEN_EXPIRATION_DATE);
        token.setPath("/");

        return token;
    }

    public Cookie getCookie(HttpServletRequest request, String cookie) {
        final Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie c : cookies) {
            if (c.getName().equals(cookie)) {
                return c;
            }
        }

        return null;
    }
}
