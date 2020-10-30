package projectw.baesinzer.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import projectw.baesinzer.domain.User;

import java.util.Date;

@Service
public class JwtTokenUtil {

    // 토큰 만료 시간
    public final static long TOKEN_EXPIRATION_DATE = 1000L * 60 * 60 * 24;
    public final static long REFRESH_TOKEN_EXPIRATION_DATE = 1000L * 60 * 60 * 24 * 7;
    private final static long HAVE_TO_REFRESH_TOKEN_DATE = 1000L * 60 * 60 * 24 * 3;

    // 토큰 이름
    public final static String ACCESS_TOKEN_NAME = "access_token";
    public final static String REFRESH_TOKEN_NAME = "refresh_token";

    // jwt 시크릿 키
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    public Claims extractAllClaims(String token) throws ExpiredJwtException {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    public String getEmail(String token) {
        return extractAllClaims(token).get("email", String.class);
    }

    public Boolean isTokenExpired(String token) {
        final Date expiration = extractAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    public Boolean needTokenRefresh(String token) {
        final Date expiration = extractAllClaims(token).getExpiration();
        long leftTime = new Date().getTime() - expiration.getTime();

        return leftTime < HAVE_TO_REFRESH_TOKEN_DATE;
    }

    public String generateToken(User user) {
        return doGenerateToken(user.getEmail(), TOKEN_EXPIRATION_DATE);
    }

    public String generateRefreshToken(User user) {
        return doGenerateToken(user.getEmail(), REFRESH_TOKEN_EXPIRATION_DATE);
    }

    private String doGenerateToken(String email, long expire) {
        Claims claims = Jwts.claims();
        claims.put("email", email);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expire))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String email = getEmail(token);

        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
