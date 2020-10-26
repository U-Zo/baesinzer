package pkw.projectw.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pkw.projectw.domain.User;
import pkw.projectw.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/api/register")
    public Map<String, String> register(@RequestBody RegisterForm form) {
        System.out.println(form.getEmail());
        User user = new User(form.getEmail(), form.getPassword());
        userService.register(user);

        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("email", user.getEmail());

        return userInfo;
    }

    @PostMapping("/api/login")
    public Map<String, String> login(@RequestBody Map<String, Long> map) {
        Map<String, String> auth = new HashMap<>();
        userService.findOne(map.get("id")).ifPresentOrElse(user -> {
            auth.put("email", user.getEmail());
        }, () -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "유저가 존재하지 않습니다.");
        });

        return auth;
    }

}
