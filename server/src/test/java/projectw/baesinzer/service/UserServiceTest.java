package projectw.baesinzer.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import projectw.baesinzer.domain.User;
import projectw.baesinzer.service.auth.UserService;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class UserServiceTest {

    @Autowired
    UserService userService;

    @Test
    void 회원가입() {
        User user = new User("abc@abc.com", "123123");

        Long saveId = userService.register(user);

        User findUser = userService.findOne(saveId).get();
        assertThat(findUser.getId()).isEqualTo(saveId);
    }
}
