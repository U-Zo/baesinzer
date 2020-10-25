package pkw.projectw.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pkw.projectw.domain.User;
import pkw.projectw.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/api/register")
    public Map<String, String> signUp(@RequestBody RegisterForm form) {
        System.out.println(form.getEmail());
        User user = new User(form.getEmail(), form.getPassword());
        userService.register(user);

        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("email", user.getEmail());

        return userInfo;
    }
}
